"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { useSidebarContext } from "./sidebar-context";
import { useLanguage } from "@/context/language-context";
import { PanelLeftClose, Settings } from "lucide-react";

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isOpen || isHovered;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items?.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
            return true;
          }
        });
      });
    });
  }, [pathname]);

  // Extract settings from NAV_DATA to put at bottom
  let allItems: any[] = [];
  NAV_DATA.forEach(section => {
    allItems = [...allItems, ...section.items];
  });
  
  const settingsItem = allItems.find(i => i.title === "Settings");
  const mainItems = allItems.filter(i => i.title !== "Settings");

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop spacer to push flex content */}
      <div className={cn(
        "hidden md:block shrink-0 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )} />

      <aside
        onMouseEnter={() => {
          if (!isOpen && !isMobile) setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onClick={() => {
          if (!isOpen && !isMobile) {
            setIsOpen(true);
          }
        }}
        className={cn(
          "flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-[#0B0F17] border-r border-slate-200/80 dark:border-slate-800/80 z-50 p-4 justify-between transition-all duration-300 ease-in-out",
          isExpanded && !isMobile ? "w-64 shadow-2xl md:shadow-lg dark:shadow-slate-950/80 cursor-default" : 
          (!isExpanded && !isMobile ? "w-20 shadow-xs cursor-pointer" : ""),
          isMobile ? (isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full") : ""
        )}
      >
        <div className="space-y-6 overflow-hidden flex-1 flex flex-col">
          {/* Logo & Top Header Toggle Section */}
          <div className={cn("flex items-center min-h-[42px]", isExpanded ? "justify-between px-1" : "justify-center")}>
            {isExpanded ? (
              <>
                <div className="flex items-center overflow-hidden">
                  <Logo variant="full" />
                </div>
                {!isMobile ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      setIsHovered(false);
                    }}
                    title="সাইডবার বন্ধ করুন"
                    className="p-2 rounded-xl text-slate-500 hover:text-[#ff0000] dark:hover:text-[#ff0000] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 group/btn"
                  >
                    <PanelLeftClose className="w-5 h-5 text-slate-500 group-hover/btn:text-[#ff0000] transition-colors" />
                  </button>
                ) : (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#ff0000] dark:hover:text-[#ff0000] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                  >
                    <ArrowLeftIcon className="size-5" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                  setIsHovered(false);
                }}
                className="p-1 rounded-xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
                title="সাইডবার খুলুন"
              >
                <Logo variant="half" />
              </button>
            )}
          </div>

          {/* Menu Items List */}
          <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.items && item.items.length > 0;
              const isActive = item.url === pathname || (hasSubItems && item.items.some((sub: any) => sub.url === pathname));
              const isItemExpanded = expandedItems.includes(item.title);

              return (
                <div key={item.title} className="w-full">
                  {hasSubItems ? (
                    <button
                      onClick={() => {
                        if (!isExpanded) {
                          setIsOpen(true);
                          setExpandedItems([item.title]);
                        } else {
                          toggleExpanded(item.title);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer relative group",
                        isActive
                          ? "bg-[#ff0000]/10 text-[#ff0000]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                        !isExpanded ? "justify-center px-0" : ""
                      )}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#ff0000]" : "text-current")} />
                      {isExpanded && <span className="truncate">{t(item.title)}</span>}
                      {isExpanded && (
                        <ChevronUp
                          className={cn("ml-auto w-4 h-4 rotate-180 transition-transform duration-200", isItemExpanded && "rotate-0")}
                        />
                      )}
                      
                      {/* Tooltip */}
                      {!isExpanded && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                          {t(item.title)}
                        </div>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.url || "#"}
                      onClick={() => isMobile && toggleSidebar()}
                      className={cn(
                        "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer relative group",
                        isActive
                          ? "bg-[#ff0000]/10 text-[#ff0000] border-l-4 border-[#ff0000]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                        !isExpanded ? "justify-center px-0 border-l-0" : ""
                      )}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#ff0000]" : "text-current")} />
                      {isExpanded && <span className="truncate">{t(item.title)}</span>}
                      
                      {/* Tooltip */}
                      {!isExpanded && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                          {t(item.title)}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Sub items */}
                  {hasSubItems && isExpanded && isItemExpanded && (
                    <ul className="ml-[46px] mr-0 space-y-1.5 pb-2 pr-0 pt-1.5">
                      {item.items.map((subItem: any) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <li key={subItem.title}>
                            <Link
                              href={subItem.url}
                              onClick={() => isMobile && toggleSidebar()}
                              className={cn(
                                "block py-2 px-3 rounded-lg text-[13px] font-medium transition-colors",
                                isSubActive
                                  ? "text-[#ff0000] bg-red-50/50 dark:bg-red-500/10"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              )}
                            >
                              {t(subItem.title)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions - Settings */}
        {settingsItem && (
          <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
            <Link
              href={settingsItem.url || "/admin/general-settings"}
              onClick={() => isMobile && toggleSidebar()}
              className={cn(
                "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all relative group",
                pathname === settingsItem.url
                  ? "bg-[#ff0000]/10 text-[#ff0000] border-l-4 border-[#ff0000]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800",
                !isExpanded ? "justify-center px-0 border-l-0" : ""
              )}
            >
              <Settings className={cn("w-5 h-5 shrink-0", pathname === settingsItem.url ? "text-[#ff0000]" : "text-current")} />
              {isExpanded && <span>{t(settingsItem.title)}</span>}
              
              {!isExpanded && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                  {t(settingsItem.title)}
                </div>
              )}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
