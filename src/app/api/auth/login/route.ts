import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { decryptPassword, isEncrypted } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const { phone, password, deviceFingerprint } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { email: phone }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { accountStatus: "EXPIRED" }
      });
      return NextResponse.json({ error: 'Your subscription has expired, please contact admin or purchase again.' }, { status: 403 });
    }

    if (user.isBlocked || user.accountStatus === "SUSPENDED" || user.accountStatus === "EXPIRED") {
      return NextResponse.json({ error: 'Your account has been suspended, please contact admin.' }, { status: 403 });
    }

    let isValid = false;
    if (isEncrypted(user.password)) {
      const decrypted = decryptPassword(user.password);
      isValid = decrypted === password;
    } else {
      isValid = await bcrypt.compare(password, user.password);
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (user.role === 'USER') {
      const completedOrder = await prisma.order.findFirst({
        where: {
          userId: user.id,
          status: 'COMPLETED'
        }
      });
      
      if (!completedOrder) {
        return NextResponse.json({ error: 'Your payment is currently pending admin verification. Please wait until your transaction is verified.' }, { status: 403 });
      }

      if (deviceFingerprint) {
        const activeSessions = await prisma.session.findMany({
          where: {
            userId: user.id,
            isActive: true
          }
        });

        const isCurrentDeviceRegistered = activeSessions.some(s => s.deviceFingerprint === deviceFingerprint);

        if (!isCurrentDeviceRegistered) {
          if (activeSessions.length >= 2) {
            await prisma.user.update({
              where: { id: user.id },
              data: { isBlocked: true }
            });
            await prisma.session.updateMany({
              where: { userId: user.id },
              data: { isActive: false }
            });

            await prisma.activityLog.create({
              data: {
                type: "MULTI_DEVICE_LOGIN",
                userId: user.id,
                details: JSON.stringify({
                  status: "SUSPENDED",
                  activeSessionCount: activeSessions.length,
                  deviceFingerprint,
                  message: "User account suspended due to login attempt on a 3rd device."
                })
              }
            });

            return NextResponse.json({ error: 'Account suspended! You have exceeded the maximum limit of 2 registered devices. Contact admin to unblock.' }, { status: 403 });
          }

          const userAgent = req.headers.get('user-agent') || 'Unknown';
          const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
          await prisma.session.create({
            data: {
              userId: user.id,
              deviceFingerprint,
              ipAddress,
              userAgent,
              isActive: true
            }
          });

          await prisma.activityLog.create({
            data: {
              type: "NEW_DEVICE_LOGIN",
              userId: user.id,
              details: JSON.stringify({
                ip: ipAddress,
                userAgent,
                deviceFingerprint,
                activeDevicesCount: activeSessions.length + 1
              })
            }
          });
        } else {
          await prisma.session.updateMany({
            where: { userId: user.id, deviceFingerprint, isActive: true },
            data: { lastSeen: new Date() }
          });
        }
      }
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const recentLoginsCount = await prisma.activityLog.count({
      where: {
        userId: user.id,
        type: "LOGIN_SUCCESS",
        createdAt: { gte: oneHourAgo }
      }
    });

    if (recentLoginsCount >= 4) {
      await prisma.activityLog.create({
        data: {
          type: "REPEATED_LOGIN_LOGOUT",
          userId: user.id,
          details: JSON.stringify({
            ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
            recentLoginsCount,
            message: `User logged in/out ${recentLoginsCount + 1} times within the last hour.`
          })
        }
      });
    }

    await prisma.activityLog.create({
      data: {
        type: "LOGIN_SUCCESS",
        userId: user.id,
        details: JSON.stringify({
          ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
          deviceFingerprint
        })
      }
    });

    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, redirectUrl: user.role === 'ADMIN' ? '/admin' : '/dashboard' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
