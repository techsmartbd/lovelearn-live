"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Video, Package, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white min-h-screen fixed left-0 top-0 hidden md:block border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Admin <span className="text-red-500">Panel</span></h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors focus:bg-slate-800 focus:text-white active:bg-slate-800">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/videos/tutorial" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            <Video className="w-5 h-5" /> Tutorial Videos
          </Link>
          <Link href="/admin/videos/landing" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            <Video className="w-5 h-5" /> Landing Video
          </Link>
          <Link href="/admin/packages" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            <Package className="w-5 h-5" /> Packages
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" /> Orders
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" /> CMS Settings
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <a href="/api/auth/logout?redirect=/admin/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
