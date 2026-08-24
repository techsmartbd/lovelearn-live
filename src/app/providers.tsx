"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "@/components/custom-theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  let section = "public";
  if (pathname?.startsWith("/admin")) {
    section = "admin";
  } else if (pathname?.startsWith("/dashboard")) {
    section = "dashboard";
  }

  const themeKey = `theme-${section}`;
  const langKey = `language-${section}`;

  return (
    <ThemeProvider defaultTheme="light" storageKey={themeKey}>
      <LanguageProvider storageKey={langKey}>
        <SidebarProvider>{children}</SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
