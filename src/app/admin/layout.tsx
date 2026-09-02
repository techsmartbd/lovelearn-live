"use client";

import "@/css/satoshi.css";
import "@/css/style.css";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Providers } from "@/app/providers";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <Providers>{children}</Providers>;
  }

  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#070A0F] dark:text-slate-100">
          <Header />

          {(() => {
            const isWidePage = pathname === "/admin/videos/tutorial" || pathname === "/admin/videos/landing" || pathname === "/admin/ebooks" || pathname === "/admin/packages" || pathname === "/admin/visitor-info" || pathname === "/admin/user-access";
            return (
              <main className={`isolate w-full overflow-hidden p-4 md:p-6 2xl:p-10 ${isWidePage ? "max-w-none px-4 md:px-8" : "mx-auto max-w-[1200px]"}`}>
                {children}
              </main>
            );
          })()}
        </div>
      </div>
    </Providers>
  );
}
