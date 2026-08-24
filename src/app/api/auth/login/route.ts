import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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

    // Check if user is expired
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { accountStatus: "EXPIRED" }
      });
      return NextResponse.json({ error: 'Your subscription has expired, please contact admin or purchase again.' }, { status: 403 });
    }

    // Check if user is blocked/suspended
    if (user.isBlocked || user.accountStatus === "SUSPENDED" || user.accountStatus === "EXPIRED") {
      return NextResponse.json({ error: 'Your account has been suspended, please contact admin.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // If user is a student, check for approved payment and enforce device locking
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

      // Session and device fingerprint verification
      if (deviceFingerprint) {
        const activeSessions = await prisma.session.findMany({
          where: {
            userId: user.id,
            isActive: true
          }
        });

        const isCurrentDeviceRegistered = activeSessions.some(s => s.deviceFingerprint === deviceFingerprint);

        if (!isCurrentDeviceRegistered) {
          // If trying to login on a 3rd device
          if (activeSessions.length >= 2) {
            // Block user and invalidate all sessions
            await prisma.user.update({
              where: { id: user.id },
              data: { isBlocked: true }
            });
            await prisma.session.updateMany({
              where: { userId: user.id },
              data: { isActive: false }
            });

            // Log multi-device suspension event
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

          // Register new session
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

          // Log new device registration
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
          // Update last seen
          await prisma.session.updateMany({
            where: { userId: user.id, deviceFingerprint, isActive: true },
            data: { lastSeen: new Date() }
          });
        }
      }
    }

    // Record login success and check for repeated login/logout behavior
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const recentLoginsCount = await prisma.activityLog.count({
      where: {
        userId: user.id,
        type: "LOGIN_SUCCESS",
        createdAt: { gte: oneHourAgo }
      }
    });

    if (recentLoginsCount >= 4) { // More than 4 logins in the last hour is suspicious
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
