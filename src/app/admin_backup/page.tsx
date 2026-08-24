import { prisma } from "@/lib/prisma";
import { Video, Package, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const videosCount = await prisma.video.count();
  const packagesCount = await prisma.package.count();
  const ordersCount = await prisma.order.count();

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><Video className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Videos</p>
            <h3 className="text-3xl font-bold text-slate-800">{videosCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-lg"><Package className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Packages</p>
            <h3 className="text-3xl font-bold text-slate-800">{packagesCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-lg"><Users className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Orders</p>
            <h3 className="text-3xl font-bold text-slate-800">{ordersCount}</h3>
          </div>
        </div>
      </div>
    </>
  );
}
