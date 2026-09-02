import { prisma } from "@/lib/prisma";
import { Video, Package, ShoppingBag, CreditCard, Laptop, Smartphone, Tablet, ExternalLink } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh metrics on reload

export default async function AdminDashboardPage() {
  const videosCount = await prisma.video.count();
  const packagesCount = await prisma.package.count();
  const ordersCount = await prisma.order.count();

  // Calculate total revenue from COMPLETED orders
  const totalRevenueResult = await prisma.order.aggregate({
    _sum: { amount: true },
    where: { status: "COMPLETED" }
  });
  const totalRevenue = totalRevenueResult._sum.amount || 0;

  // Fetch recent 5 orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      package: true
    }
  });

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Dashboard Overview
        </h2>
        <p className="font-medium text-slate-500 text-xs mt-1">Manage and monitor your landing page, course settings, and sales metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        
        {/* Total Videos Card */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark flex justify-between items-center relative overflow-hidden group hover:border-[#3c50e0]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3c50e0]/10 text-[#3c50e0]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Videos</span>
              <h4 className="text-2xl font-black text-dark dark:text-white mt-1">
                {videosCount}
              </h4>
            </div>
          </div>
          {/* Sparkline trend */}
          <div className="w-16 h-8 opacity-80">
            <svg className="w-full h-full text-[#3c50e0]" viewBox="0 0 100 30" fill="none">
              <path d="M0,25 Q15,5 30,20 T60,5 T90,25 L100,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Active Packages Card */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark flex justify-between items-center relative overflow-hidden group hover:border-[#10b981]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Active Packages</span>
              <h4 className="text-2xl font-black text-dark dark:text-white mt-1">
                {packagesCount}
              </h4>
            </div>
          </div>
          <div className="w-16 h-8 opacity-80">
            <svg className="w-full h-full text-[#10b981]" viewBox="0 0 100 30" fill="none">
              <path d="M0,15 Q20,25 40,10 T80,5 L100,20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark flex justify-between items-center relative overflow-hidden group hover:border-[#ff0000]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff0000]/10 text-[#ff0000]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Orders</span>
              <h4 className="text-2xl font-black text-dark dark:text-white mt-1">
                {ordersCount}
              </h4>
            </div>
          </div>
          <div className="w-16 h-8 opacity-80">
            <svg className="w-full h-full text-[#ff0000]" viewBox="0 0 100 30" fill="none">
              <path d="M0,25 L20,10 L40,28 L60,5 L80,20 L100,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark flex justify-between items-center relative overflow-hidden group hover:border-[#ffba00]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffba00]/10 text-[#ffba00]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <h4 className="text-2xl font-black text-dark dark:text-white mt-1">
                {totalRevenue}৳
              </h4>
            </div>
          </div>
          <div className="w-16 h-8 opacity-80">
            <svg className="w-full h-full text-[#ffba00]" viewBox="0 0 100 30" fill="none">
              <path d="M0,20 Q15,5 30,15 T60,25 T90,5 L100,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        
        {/* Weekly Revenue Chart Widget */}
        <div className="lg:col-span-8 rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark text-left space-y-6">
          <div className="flex items-center justify-between border-b border-stroke dark:border-stroke-dark pb-4">
            <div>
              <h3 className="text-sm font-bold text-dark dark:text-white">সাপ্তাহিক আয় গ্রাফ (Revenue Trend)</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">বিগত ৭ দিনের সেলস ও রেভিনিউ রিপোর্ট</p>
            </div>
            <div className="flex gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff0000]" /> সেলস</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-350" /> ল্যাক</span>
            </div>
          </div>

          {/* SVG Area chart */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              {/* Grids */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(156,163,175,0.08)" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(156,163,175,0.08)" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(156,163,175,0.08)" strokeWidth="1" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="rgba(156,163,175,0.08)" strokeWidth="1" />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0000" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ff0000" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path d="M0,200 L100,160 L200,190 L300,100 L400,140 L500,60 L600,20 L600,220 L0,220 Z" fill="url(#chartGrad)" />

              {/* Line path */}
              <path d="M0,200 L100,160 L200,190 L300,100 L400,140 L500,60 L600,20" stroke="#ff0000" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              {/* Dot Indicators */}
              <circle cx="100" cy="160" r="5" fill="#ff0000" stroke="#fff" strokeWidth="2" />
              <circle cx="300" cy="100" r="5" fill="#ff0000" stroke="#fff" strokeWidth="2" />
              <circle cx="500" cy="60" r="5" fill="#ff0000" stroke="#fff" strokeWidth="2" />
              <circle cx="600" cy="20" r="5" fill="#ff0000" stroke="#fff" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
              <span>শনিবার</span>
              <span>সোমবার</span>
              <span>বুধবার</span>
              <span>শুক্রবার</span>
              <span>আজ</span>
            </div>
          </div>
        </div>

        {/* Device Sessions Distribution Widget */}
        <div className="lg:col-span-4 rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark text-left space-y-6">
          <div className="border-b border-stroke dark:border-stroke-dark pb-4">
            <h3 className="text-sm font-bold text-dark dark:text-white">সেশন ও ট্রাফিক (Sessions Split)</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ডিভাইস ভিত্তিক ইউজার এক্সেস শতকরা হার</p>
          </div>

          <div className="space-y-4 font-bold text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-650 dark:text-slate-350">
                <span className="flex items-center gap-1.5"><Laptop className="w-4 h-4 text-slate-400" /> ডেস্কটপ (Desktop)</span>
                <span>৬৫%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#3c50e0] rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-650 dark:text-slate-350">
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-slate-400" /> মোবাইল (Mobile)</span>
                <span>৩০%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#10b981] rounded-full" style={{ width: "30%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-650 dark:text-slate-350">
                <span className="flex items-center gap-1.5"><Tablet className="w-4 h-4 text-slate-400" /> ট্যাবলেট (Tablet)</span>
                <span>৫%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#ffba00] rounded-full" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark text-left space-y-6 mb-8">
        <div className="flex items-center justify-between border-b border-stroke dark:border-stroke-dark pb-4">
          <div>
            <h3 className="text-sm font-bold text-dark dark:text-white">সবশেষ অর্ডার অ্যাক্টিভিটি (Recent Orders)</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">সবশেষ সাবমিট করা অর্ডার ও ট্রানজেকশন</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#ff0000] hover:underline flex items-center gap-1">সব দেখুন <ExternalLink className="w-3.5 h-3.5" /></Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-stroke-dark text-slate-400 font-bold uppercase">
                <th className="py-3 px-4">গ্রাহক</th>
                <th className="py-3 px-4">কোর্স/প্যাকেজ</th>
                <th className="py-3 px-4">TrxID</th>
                <th className="py-3 px-4">মূল্য</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-stroke-dark font-semibold">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 font-medium">কোনো অর্ডার পাওয়া যায়নি।</td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3.5 px-4 text-slate-900 dark:text-white">{order.user.name || order.user.phone}</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{order.package.title}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-550">{order.trxId || "N/A"}</td>
                    <td className="py-3.5 px-4 text-slate-900 dark:text-white">{order.amount}৳</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "COMPLETED" 
                          ? "bg-green-500/10 text-green-500" 
                          : order.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
