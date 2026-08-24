import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

export const revalidate = 0; // Ensure fresh data on reload

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "USER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ 
    where: { id: session.userId },
    include: {
      orders: {
        include: { package: true }
      }
    }
  });

  let isExpired = false;
  if (user && user.expiresAt && new Date(user.expiresAt) < new Date()) {
    isExpired = true;
    await prisma.user.update({ where: { id: user.id }, data: { accountStatus: "EXPIRED" } });
  }

  if (!user || user.isBlocked || user.accountStatus === "SUSPENDED" || user.accountStatus === "EXPIRED" || isExpired) {
    redirect("/api/auth/logout?redirect=/login");
  }

  // Get packages, videos, and ebooks
  const packages = await prisma.package.findMany();
  const videos = await prisma.video.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  const ebooks = await prisma.ebook.findMany({ orderBy: { createdAt: "desc" } });

  // Map user's owned package IDs from completed orders
  const ownedPackageIds = user.orders
    .filter(order => order.status === "COMPLETED")
    .map(order => order.packageId);

  return (
    <DashboardClient 
      user={{ 
        id: user.id, 
        name: user.name || "সাকিব হাসান", 
        phone: user.phone || "",
        email: user.email || "",
        accountStatus: user.accountStatus
      }}
      packages={packages}
      videos={videos}
      ebooks={ebooks}
      ownedPackageIds={ownedPackageIds}
    />
  );
}
