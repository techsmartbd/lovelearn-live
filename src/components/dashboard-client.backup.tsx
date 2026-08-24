"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Home, 
  Play, 
  ArrowRight,
  Star,
  BookOpen, 
  Gift, 
  Menu, 
  Bell, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Search, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  HelpCircle, 
  FileText, 
  Award, 
  Info, 
  Lock, 
  X,
  Plus,
  Minus,
  CheckCircle,
  Check,
  TrendingUp,
  Share2,
  Loader2,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ShieldCheck,
  Crown
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { DeviceWarningModal } from "@/components/DeviceWarningModal";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  packages: any[];
  videos: any[];
  ownedPackageIds: string[];
}

export default function DashboardClient({ user, packages, videos, ownedPackageIds }: DashboardClientProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutorials" | "ebooks" | "combo" | "more" | "settings">("dashboard");

  // Collapsed Sidebar State (Desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Avatar Theme Selector (Gender Cover) State inside Hero
  const [coverGender, setCoverGender] = useState<"male" | "female">("male");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  // Profile settings form states
  const [profileName, setProfileName] = useState(user.name || "");
  const [profileEmail, setProfileEmail] = useState(user.email || "");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Mobile sidebar navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Profile Settings dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Locked item checkout modal
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; title: string; price: number } | null>(null);
  
  // Checkout inputs
  const [phoneInput, setPhoneInput] = useState(user.phone || "");
  const [trxIdInput, setTrxIdInput] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Active playing video state
  const [activePlayingVideo, setActivePlayingVideo] = useState<{ title: string; url: string; type: string } | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Filters and views states for Tutorials tab
  const [filterType, setFilterType] = useState<"all" | "my" | "progress" | "completed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Filters and views states for eBooks tab
  const [ebookFilter, setEbookFilter] = useState<"all" | "my" | "free" | "premium">("all");
  const [ebookViewMode, setEbookViewMode] = useState<"grid" | "list">("grid");
  const [ebookSort, setEbookSort] = useState("newest");

  // Filters and views states for Combo tab
  const [comboFilter, setComboFilter] = useState<"all" | "popular" | "new" | "offer" | "limited" | "bestvalue">("all");
  const [comboViewMode, setComboViewMode] = useState<"grid" | "list">("grid");
  const [comboSort, setComboSort] = useState("newest");

  // Carousel Scroll Refs
  const tutorialCarouselRef = useRef<HTMLDivElement>(null);
  const ebookCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const firstDbPackageId = packages[0]?.id || "pkg-ml";

  // Mock list of 8 Tutorials/Courses matching mockup image
  const mockTutorials = [
    {
      id: "tut-react",
      title: "React.js বাংলা টিউটোরিয়াল",
      instructor: "সাকিব হাসান",
      duration: "০২ ঘণ্টা ১৫ মিনিট",
      videos: "১২টি ভিডিও",
      badge: "লড়িয়ে যান",
      packageId: "pkg-react",
      isPremium: false, // Free/purchased course
      progress: 65,
      logoColor: "from-cyan-500 to-blue-600",
      logoName: "React"
    },
    {
      id: "tut-python",
      title: "Python Mastery Course",
      instructor: "সাকিব হাসান",
      duration: "১২ ঘণ্টা ৩০ মিনিট",
      videos: "১৬টি ভিডিও",
      badge: "অনলাইন",
      packageId: firstDbPackageId,
      isPremium: true,
      progress: 0,
      logoColor: "from-yellow-400 via-blue-500 to-blue-700",
      logoName: "Python"
    },
    {
      id: "tut-node",
      title: "Node.js সম্পূর্ণ গাইড",
      instructor: "আব্দুল্লাহ আল মামুন",
      duration: "১০ ঘণ্টা ৩০ মিনিট",
      videos: "১১টি ভিডিও",
      badge: "নতুন",
      packageId: "pkg-node",
      isPremium: true,
      progress: 0,
      logoColor: "from-green-500 to-emerald-700",
      logoName: "Node.js"
    },
    {
      id: "tut-laravel",
      title: "Laravel Zero to Hero",
      instructor: "তানজীর আহমেদ",
      duration: "০৯ ঘণ্টা ১৫ মিনিট",
      videos: "৯টি ভিডিও",
      badge: "জনপ্রিয়",
      packageId: "pkg-laravel",
      isPremium: true,
      progress: 0,
      logoColor: "from-red-500 to-rose-700",
      logoName: "Laravel"
    },
    {
      id: "tut-nextjs",
      title: "Next.js The Complete Course",
      instructor: "সাকিব হাসান",
      duration: "০৭ ঘণ্টা ২০ মিনিট",
      videos: "১০টি ভিডিও",
      badge: "নতুন",
      packageId: "pkg-nextjs",
      isPremium: true,
      progress: 0,
      logoColor: "from-slate-800 to-black",
      logoName: "Next.js"
    },
    {
      id: "tut-typescript",
      title: "TypeScript Masterclass",
      instructor: "সজীব রহমান",
      duration: "০৫ ঘণ্টা ৩০ মিনিট",
      videos: "৭টি ভিডিও",
      badge: "এডভান্স",
      packageId: "pkg-typescript",
      isPremium: true,
      progress: 0,
      logoColor: "from-blue-500 to-sky-700",
      logoName: "TypeScript"
    },
    {
      id: "tut-mongodb",
      title: "MongoDB সম্পূর্ণ কোর্স",
      instructor: "রায়হান চৌধুরী",
      duration: "০৫ ঘণ্টা ৪৫ মিনিট",
      videos: "৮টি ভিডিও",
      badge: "নতুন",
      packageId: "pkg-mongodb",
      isPremium: true,
      progress: 0,
      logoColor: "from-green-400 to-emerald-600",
      logoName: "MongoDB"
    }
  ];

  // Mock list of eBooks matching mockup image
  const mockEbooks = [
    {
      id: "ebook-read-rich",
      title: "রিচ ড্যাড পুওর ড্যাড",
      author: "রবার্ট কিয়োসাকি",
      pages: "৩৯৬ পৃষ্ঠা",
      category: "অর্থনীতি",
      isPremium: false,
      progress: 65,
      packageId: "pkg-ebook-react",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "বেস্ট সেলার"
    },
    {
      id: "ebook-atomic",
      title: "Atomic Habits",
      author: "James Clear",
      pages: "৩২০ পৃষ্ঠা",
      category: "আত্মউন্নয়ন",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-atomic",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "জনপ্রিয়"
    },
    {
      id: "ebook-think-rich",
      title: "Think & Grow Rich",
      author: "Napoleon Hill",
      pages: "২৮০ পৃষ্ঠা",
      category: "সফলতা",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-think",
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "নতুন"
    },
    {
      id: "ebook-5am",
      title: "The 5 AM Club",
      author: "Robin Sharma",
      pages: "৩১০ পৃষ্ঠা",
      category: "উৎপাদনশীলতা",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-5am",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "জনপ্রিয়"
    },
    {
      id: "ebook-mkt",
      title: "Digital Marketing Guide",
      author: "শাহনেওয়াজ ইমরান",
      pages: "২৪০ পৃষ্ঠা",
      category: "মার্কেটিং",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-mkt",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "নতুন"
    },
    {
      id: "ebook-habit",
      title: "The Power of Habit",
      author: "Charles Duhigg",
      pages: "৩৭৫ পৃষ্ঠা",
      category: "মনস্তত্ত্ব",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-habit",
      coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "জনপ্রিয়"
    },
    {
      id: "ebook-deep-work",
      title: "Deep Work",
      author: "Cal Newport",
      pages: "৩০০ পৃষ্ঠা",
      category: "উৎপাদনশীলতা",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-deepwork",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "জনপ্রিয়"
    },
    {
      id: "ebook-clean-code",
      title: "Clean Code",
      author: "Robert C. Martin",
      pages: "৪৬৪ পৃষ্ঠা",
      category: "প্রোগ্রামিং",
      isPremium: true,
      progress: 0,
      packageId: "pkg-ebook-cleancode",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      badge: "এডভান্স"
    }
  ];

  const handleOpenUnlock = (product: { id: string; title: string; price: number }) => {
    setSelectedProduct(product);
    setCheckoutSuccess(false);
    setCheckoutError("");
    setTrxIdInput("");
    setCheckoutModalOpen(true);
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !trxIdInput) {
      setCheckoutError("মোবাইল নম্বর এবং ট্রানজেকশন আইডি আবশ্যক!");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phoneInput, 
          password: "dashboard_unlock",
          trxId: trxIdInput 
        })
      });
      if (res.ok) {
        setCheckoutSuccess(true);
      } else {
        const data = await res.json();
        setCheckoutError(data.error || "পেমেন্ট সাবমিট করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setCheckoutError("নেটওয়ার্ক এরর! অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const activeVideos = videos && videos.length > 0 ? videos.map((v) => ({
    id: v.id,
    title: v.title,
    instructor: v.instructor || "সাকিব হাসান",
    duration: v.duration || "০২ ঘণ্টা ১৫ মিনিট",
    videos: v.videosCount || "১০টি ভিডিও",
    badge: v.badge || "নতুন",
    packageId: v.packageId || firstDbPackageId,
    isPremium: v.isPremium !== undefined ? v.isPremium : true,
    progress: v.id === "tut-react" ? 65 : 0,
    logoColor: v.logoColor || "from-cyan-500 to-blue-600",
    logoName: v.logoName || "React",
    url: v.url,
    type: v.type
  })) : mockTutorials.map(t => ({
    ...t,
    url: t.id === "tut-react" ? "1050230423" : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: t.id === "tut-react" ? "VIMEO" : "YOUTUBE"
  }));

  const filteredTutorials = activeVideos.filter((tut) => {
    const isUnlocked = !tut.isPremium || ownedPackageIds.includes(tut.packageId);
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === "my") return isUnlocked;
    if (filterType === "progress") return isUnlocked && (tut.progress || 0) > 0 && (tut.progress || 0) < 100;
    if (filterType === "completed") return isUnlocked && (tut.progress || 0) === 100;
    return true;
  });

  const sidebarMenuItems = [
    { id: "dashboard", label: t("Dashboard") || "ড্যাশবোর্ড", icon: Home },
    { id: "tutorials", label: t("Tutorials") || "টিউটোরিয়াল", icon: Play },
    { id: "ebooks", label: t("eBooks") || "ই-বুক", icon: BookOpen },
    { id: "combo", label: "কোর্স", icon: FolderKanban },
    { id: "packages", label: "কোর্স প্যাকেজ", icon: Gift },
    { id: "library", label: "আমার লাইব্রেরি", icon: FileText },
    { id: "certificates", label: "সার্টিফিকেট", icon: Award },
    { id: "support", label: "হেল্প & সাপোর্ট", icon: HelpCircle },
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#070A0F] dark:text-slate-100 antialiased font-sans flex flex-col md:flex-row select-none">
      
      {/* Device Warning Modal */}
      <DeviceWarningModal />

      {/* Desktop Left Sidebar (Collapsible) */}
      <aside 
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-[#0B0F17] border-r border-slate-200/80 dark:border-slate-800/80 z-40 p-4 justify-between transition-all duration-300 ease-in-out shadow-xs ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="space-y-6">
          {/* Logo Section */}
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "px-2"}`}>
            {isSidebarCollapsed ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff0000] to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/20">
                L
              </div>
            ) : (
              <Logo />
            )}
          </div>
          
          {/* Menu Items List */}
          <nav className="space-y-1">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === "dashboard" && activeTab === "dashboard");
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-extrabold text-sm transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-[#ff0000]/10 text-[#ff0000] border-l-4 border-[#ff0000]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#ff0000]" : ""}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Tooltip on Collapsed Hover */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Collapse Toggle */}
        <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab("settings")}
            title={isSidebarCollapsed ? t("Settings") || "সেটিংস" : undefined}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-extrabold text-sm cursor-pointer transition-all ${
              activeTab === "settings"
                ? "bg-[#ff0000]/10 text-[#ff0000]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-850"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>{t("Settings") || "সেটিংস"}</span>}
          </button>

          {/* Collapse Sidebar Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-extrabold text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer justify-center"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-slate-500" />
            ) : (
              <>
                <PanelLeftClose className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="truncate">« সাইডবার বন্ধ করুন</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        
        {/* Desktop Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#070A0F]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-16 px-4 md:px-8 flex items-center justify-between shadow-2xs">
          {/* Search Input Box */}
          <div className="w-full max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="কোর্স, ই-বুক বা টিউটোরিয়াল সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:border-[#ff0000] focus:ring-2 focus:ring-red-500/10 font-extrabold text-xs"
            />
          </div>

          {/* Right Utilities */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 md:space-x-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-700 dark:text-slate-200 p-2 cursor-pointer">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="md:hidden flex items-center shrink-0">
              <Logo />
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <LanguageToggle />
              
              {/* Notification Bell */}
              <button className="p-2.5 bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl relative hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff0000] text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-xs">
                  ৩
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-lg object-cover border border-red-500/20" 
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">{user.name || "সাকিব হাসান"}</div>
                    <div className="text-[9px] text-[#ff0000] font-extrabold leading-none mt-0.5">প্রিমিয়াম মেম্বার</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block mr-1" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 text-left text-xs font-extrabold space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl cursor-pointer text-left font-bold"
                    >
                      <Settings className="w-4 h-4 text-slate-500" /> অ্যাকাউন্ট সেটিংস
                    </button>
                    <a href="/api/auth/logout" className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-500/10 text-red-600 rounded-xl border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2">
                      <LogOut className="w-4 h-4 text-red-500" /> লগআউট
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Screen Area */}
        <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto pb-24 md:pb-12">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              
              {/* TOP SECTION: Hero Cover (Left) + Quick Access Panel (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* HERO COVER SECTION (lg:col-span-8) */}
                <div className="lg:col-span-8 bg-gradient-to-r from-[#3B0205] via-[#7F0712] to-[#200103] rounded-3xl overflow-hidden shadow-xl p-6 md:p-8 relative flex flex-col justify-between border border-red-500/20 text-left min-h-[220px] md:min-h-[260px] group">
                  {/* Luxury soft radial background glow & dynamic particle grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,0,0,0.35),transparent_70%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

                  {/* Top Row inside Hero: Welcome Title + Avatar Theme Selector */}
                  <div className="relative flex items-start justify-between gap-4 z-10">
                    <div className="space-y-1.5 max-w-md">
                      <h2 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                        স্বাগতম ফিরে এসেছেন, {user.name || "সাকিব"}! 👋
                      </h2>
                      <p className="text-red-100/80 text-xs md:text-sm font-extrabold leading-relaxed">
                        আজ কিছু নতুন শিখি, নিজেকে আরও এক ধাপ এগিয়ে নিই!
                      </p>
                    </div>

                    {/* Avatar Gender Selector (Top-Right inside Hero) */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                        className="px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <span>চেঞ্জ করুন</span>
                        <ChevronDown className="w-3.5 h-3.5 text-white" />
                      </button>

                      {genderDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-50 p-1.5 text-xs font-black text-white space-y-1">
                          <button
                            onClick={() => {
                              setCoverGender("male");
                              setGenderDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                              coverGender === "male" ? "bg-[#ff0000] text-white" : "hover:bg-white/10"
                            }`}
                          >
                            <span>পুরুষ 👨</span>
                            {coverGender === "male" && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setCoverGender("female");
                              setGenderDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                              coverGender === "female" ? "bg-[#ff0000] text-white" : "hover:bg-white/10"
                            }`}
                          >
                            <span>মহিলা 👩</span>
                            {coverGender === "female" && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Character Illustration / Graphic */}
                  <div className="absolute right-4 bottom-2 md:right-8 md:bottom-4 pointer-events-none opacity-90 hidden sm:block">
                    <img 
                      src={coverGender === "male" 
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=260&h=260&q=80"
                        : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=260&h=260&q=80"
                      }
                      alt="Cover Character"
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl border-2 border-white/20 shadow-2xl transform rotate-2"
                    />
                  </div>

                  {/* Bottom Row inside Hero: Continue Learning Card */}
                  <div className="relative z-10 mt-6 max-w-sm">
                    <div className="bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 shadow-2xl flex flex-col space-y-2.5 text-left text-slate-900 dark:text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">চালিয়ে যান</span>
                        <span className="text-[10px] font-black text-[#ff0000]">65%</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* React icon box */}
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white truncate">React.js বাংলা টিউটোরিয়াল</h4>
                          <p className="text-[10px] font-extrabold text-slate-500 truncate">অধ্যায় ১২ - React Router</p>
                        </div>
                      </div>

                      {/* Red Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff0000] rounded-full" style={{ width: "65%" }} />
                      </div>

                      <button 
                        onClick={() => setActiveTab("tutorials")}
                        className="w-full py-1.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-red-500/20"
                      >
                        চালিয়ে যান <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* QUICK ACCESS PANEL (lg:col-span-4) */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0B0F17] rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between text-left space-y-4">
                  <h3 className="font-black text-sm text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                    <Sparkles className="w-4 h-4 text-[#ff0000]" /> দ্রুত অ্যাক্সেস
                  </h3>

                  {/* 6 Grid Cards (2 columns x 3 rows) */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* Card 1: My Courses */}
                    <button 
                      onClick={() => { setActiveTab("tutorials"); setFilterType("my"); }}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">আমার কোর্স</div>
                      <div className="text-[9px] font-bold text-slate-400">১টি কোর্স</div>
                    </button>

                    {/* Card 2: My eBooks */}
                    <button 
                      onClick={() => { setActiveTab("ebooks"); setEbookFilter("my"); }}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">আমার ই-বুক</div>
                      <div className="text-[9px] font-bold text-slate-400">১২টি ই-বুক</div>
                    </button>

                    {/* Card 3: Course Packages */}
                    <button 
                      onClick={() => setActiveTab("combo")}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">কোর্স প্যাকেজ</div>
                      <div className="text-[9px] font-bold text-slate-400">৫টি প্যাকেজ</div>
                    </button>

                    {/* Card 4: Certificates */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">সার্টিফিকেট</div>
                      <div className="text-[9px] font-bold text-slate-400">৪টি সার্টিফিকেট</div>
                    </button>

                    {/* Card 5: My Library */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">আমার লাইব্রেরি</div>
                      <div className="text-[9px] font-bold text-slate-400">সকল কনটেন্ট</div>
                    </button>

                    {/* Card 6: Help & Support */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-900 dark:text-white">হেল্প & সাপোর্ট</div>
                      <div className="text-[9px] font-bold text-slate-400">সাহায্য কেন্দ্র</div>
                    </button>
                  </div>
                </div>

              </div>

              {/* TUTORIAL CAROUSEL SECTION */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">টিউটোরিয়াল</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTab("tutorials")} 
                      className="text-xs font-black text-[#ff0000] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => scrollCarousel(tutorialCarouselRef, "left")}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => scrollCarousel(tutorialCarouselRef, "right")}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Scrolling Cards Container */}
                <div 
                  ref={tutorialCarouselRef}
                  className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
                >
                  {filteredTutorials.map((tut) => {
                    const isUnlocked = !tut.isPremium || ownedPackageIds.includes(tut.packageId);
                    return (
                      <div 
                        key={tut.id} 
                        className="w-[240px] md:w-[260px] shrink-0 bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group"
                      >
                        <div className="space-y-3">
                          {/* Thumbnail with overlay & badge */}
                          <div className="aspect-video relative rounded-xl overflow-hidden shadow-xs select-none">
                            <div className={`w-full h-full bg-gradient-to-br ${tut.logoColor} flex items-center justify-center relative`}>
                              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
                              <span className="text-white text-base font-black tracking-wider uppercase drop-shadow-md">{tut.logoName}</span>
                            </div>

                            {/* Badge at top left */}
                            <div className="absolute top-2 left-2 bg-[#ff0000] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow-xs">
                              {tut.badge}
                            </div>

                            {/* Locked Semi-Transparent Overlay with Centered Lock Icon */}
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                                  <Lock className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-snug group-hover:text-[#ff0000] transition-colors truncate">
                            {tut.title}
                          </h4>
                        </div>

                        {/* Button Rules based on specification */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2">
                          {isUnlocked ? (
                            <>
                              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                <span>{tut.progress}% সম্পন্ন</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ff0000] rounded-full" style={{ width: `${tut.progress}%` }} />
                              </div>
                              <button 
                                onClick={() => setActivePlayingVideo({ title: tut.title, url: tut.url, type: tut.type })}
                                className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-xl transition-all text-xs cursor-pointer mt-1"
                              >
                                চালিয়ে যান
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleOpenUnlock({ id: tut.packageId, title: tut.title, price: 990 })}
                              className="w-full py-2.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20"
                            >
                              আনলক করুন
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EBOOK CAROUSEL SECTION */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">ই-বুক</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTab("ebooks")} 
                      className="text-xs font-black text-[#ff0000] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => scrollCarousel(ebookCarouselRef, "left")}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => scrollCarousel(ebookCarouselRef, "right")}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Carousel */}
                <div 
                  ref={ebookCarouselRef}
                  className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
                >
                  {mockEbooks.map((book) => {
                    const isUnlocked = !book.isPremium || ownedPackageIds.includes(book.packageId);
                    return (
                      <div 
                        key={book.id} 
                        className="w-[180px] md:w-[200px] shrink-0 bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group"
                      >
                        <div className="space-y-2.5">
                          {/* Book cover aspect ratio */}
                          <div className="aspect-[3/4] bg-slate-900 rounded-xl relative overflow-hidden shadow-xs flex items-center justify-center">
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                            
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                                  <Lock className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-tight truncate">{book.title}</h4>
                            <p className="text-[10px] font-extrabold text-slate-400 truncate mt-0.5">{book.author}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-850 mt-3">
                          {isUnlocked ? (
                            <button className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-xl transition-all text-xs cursor-pointer">
                              পড়ুন
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenUnlock({ id: book.packageId, title: book.title, price: 990 })}
                              className="w-full py-2 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
                            >
                              আনলক করুন
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROMOTIONAL BANNERS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Banner 1 */}
                <div className="bg-gradient-to-br from-red-950/80 via-red-900/60 to-slate-950 border border-red-500/20 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
                  <div className="space-y-1.5 relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-red-500/20 text-red-300 border border-red-500/30">স্পেশাল অফার</span>
                    <h4 className="font-black text-sm text-white">প্রিমিয়াম কোর্স আনলিমিটেড অ্যাক্সেস!</h4>
                    <p className="text-xs text-red-100/70 font-bold">হাজারো কোর্স, ই-বুক এবং টিউটোরিয়াল এর অ্যাক্সেস</p>
                  </div>
                  <button onClick={() => setActiveTab("combo")} className="w-fit px-4 py-2 bg-white text-red-700 font-extrabold rounded-xl text-xs hover:bg-red-50 transition-all cursor-pointer shadow-md">
                    এক্সপ্লোর দিন
                  </button>
                </div>

                {/* Banner 2 */}
                <div className="bg-gradient-to-br from-blue-950/80 via-indigo-900/60 to-slate-950 border border-blue-500/20 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
                  <div className="space-y-1.5 relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">লাইফটাইম</span>
                    <h4 className="font-black text-sm text-white">লাইফটাইম অ্যাক্সেস, একবার পেমেন্ট!</h4>
                    <p className="text-xs text-blue-100/70 font-bold">সবচেয়ে সাশ্রয়ী কনটেন্ট, নিয়মিত আপডেট</p>
                  </div>
                  <button onClick={() => setActiveTab("combo")} className="w-fit px-4 py-2 bg-white text-blue-700 font-extrabold rounded-xl text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-md">
                    বিস্তারিত দেখুন
                  </button>
                </div>

                {/* Banner 3 */}
                <div className="bg-gradient-to-br from-emerald-950/80 via-teal-900/60 to-slate-950 border border-emerald-500/20 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
                  <div className="space-y-1.5 relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">নতুন স্কিল</span>
                    <h4 className="font-black text-sm text-white">নতুন স্কিল, নতুন আপনি!</h4>
                    <p className="text-xs text-emerald-100/70 font-bold">প্রতিদিন নতুন কিছু শিখুন এবং ক্যারিয়ার গড়ুন</p>
                  </div>
                  <button onClick={() => setActiveTab("tutorials")} className="w-fit px-4 py-2 bg-white text-emerald-700 font-extrabold rounded-xl text-xs hover:bg-emerald-50 transition-all cursor-pointer shadow-md">
                    শুরু করুন
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TUTORIALS FULL TAB */}
          {activeTab === "tutorials" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">টিউটোরিয়াল</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">আপনার শেখার যাত্রা চালিয়ে যান</p>
                </div>
              </div>

              {/* Grid of Tutorials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTutorials.map((tut) => {
                  const isUnlocked = !tut.isPremium || ownedPackageIds.includes(tut.packageId);
                  return (
                    <div key={tut.id} className="bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group text-left">
                      <div className="space-y-3">
                        <div className="aspect-video relative rounded-xl overflow-hidden shadow-xs select-none">
                          <div className={`w-full h-full bg-gradient-to-br ${tut.logoColor} flex items-center justify-center relative`}>
                            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
                            <span className="text-white text-base font-black tracking-wider uppercase drop-shadow-md">{tut.logoName}</span>
                          </div>

                          <div className="absolute top-2 left-2 bg-[#ff0000] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                            {tut.badge}
                          </div>

                          {!isUnlocked ? (
                            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => setActivePlayingVideo({ title: tut.title, url: tut.url, type: tut.type })}
                              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-snug group-hover:text-[#ff0000] transition-colors">{tut.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">ইন্সট্রাক্টর: {tut.instructor}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2">
                        {isUnlocked ? (
                          <button 
                            onClick={() => setActivePlayingVideo({ title: tut.title, url: tut.url, type: tut.type })}
                            className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-xl transition-all text-xs cursor-pointer"
                          >
                            চালিয়ে যান
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenUnlock({ id: tut.packageId, title: tut.title, price: 990 })}
                            className="w-full py-2.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
                          >
                            আনলক করুন
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EBOOKS FULL TAB */}
          {activeTab === "ebooks" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">ই-বুক</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">আপনার পছন্দের বই সিলেক্ট করুন</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockEbooks.map((book) => {
                  const isUnlocked = !book.isPremium || ownedPackageIds.includes(book.packageId);
                  return (
                    <div key={book.id} className="bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group text-left">
                      <div className="space-y-2">
                        <div className="aspect-[3/4] bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-tight truncate">{book.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">{book.author}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-850 mt-3">
                        {isUnlocked ? (
                          <button className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-xl transition-all text-xs cursor-pointer">
                            পড়ুন
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenUnlock({ id: book.packageId, title: book.title, price: 990 })}
                            className="w-full py-2 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
                          >
                            আনলক করুন
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OTHER TABS (SETTINGS, MORE, ETC.) */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xs">
              <h2 className="text-xl font-black text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                অ্যাকাউন্ট সেটিংস
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); alert("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!"); }} className="space-y-4 text-xs font-extrabold">
                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400">আপনার নাম</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400">নতুন পাসওয়ার্ড (ঐচ্ছিক)</label>
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড পরিবর্তন না করতে চাইলে ফাঁকা রাখুন"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all shadow-md shadow-red-500/20 text-xs cursor-pointer mt-4"
                >
                  সেভ করুন
                </button>
              </form>
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#070A0F]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around py-2 px-1 shadow-2xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${
              activeTab === "dashboard" ? "text-[#ff0000]" : "text-slate-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab("tutorials")}
            className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${
              activeTab === "tutorials" ? "text-[#ff0000]" : "text-slate-400"
            }`}
          >
            <Play className="w-5 h-5" />
            <span>টিউটোরিয়াল</span>
          </button>

          <button
            onClick={() => setActiveTab("ebooks")}
            className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${
              activeTab === "ebooks" ? "text-[#ff0000]" : "text-slate-400"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>ই-বুক</span>
          </button>

          <button
            onClick={() => setActiveTab("combo")}
            className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${
              activeTab === "combo" ? "text-[#ff0000]" : "text-slate-400"
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>কোর্স</span>
          </button>

          <button
            onClick={() => setActiveTab("more")}
            className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${
              activeTab === "more" ? "text-[#ff0000]" : "text-slate-400"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>আরও</span>
          </button>
        </nav>

      </div>

      {/* Active Playing Video Modal */}
      {activePlayingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white truncate">{activePlayingVideo.title}</h3>
              <button 
                onClick={() => setActivePlayingVideo(null)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={
                  activePlayingVideo.url.includes("vimeo") || activePlayingVideo.type === "VIMEO"
                    ? `https://player.vimeo.com/video/${activePlayingVideo.url.replace(/[^0-9]/g, '') || "1211086551"}`
                    : activePlayingVideo.url.includes("embed")
                    ? activePlayingVideo.url
                    : `https://www.youtube.com/embed/${activePlayingVideo.url.split("v=")[1] || "dQw4w9WgXcQ"}`
                }
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Locked Course Checkout Modal */}
      {checkoutModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden w-full max-w-md shadow-2xl relative text-left p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-950 dark:text-white">কোর্স আনলক করুন</h3>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">অনুরোধ সফলভাবে গৃহীত হয়েছে!</h4>
                <p className="text-xs text-slate-500 font-bold">পেমেন্ট ভেরিফাই হওয়ার পর ২-৫ মিনিটের মধ্যে আপনার আইটেমটি আনলক হয়ে যাবে।</p>
                <button 
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full py-2.5 bg-[#ff0000] text-white font-extrabold rounded-xl text-xs cursor-pointer mt-2"
                >
                  বন্ধ করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleUnlockSubmit} className="space-y-4 text-xs font-extrabold">
                <div className="bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-black">আইটেম</div>
                  <div className="text-slate-900 dark:text-white font-black truncate">{selectedProduct.title}</div>
                  <div className="text-[#ff0000] font-black">মূল্য: ৳{selectedProduct.price}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400">আপনার মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400">ট্রানজেকশন আইডি (bKash / Nagad TrxID)</label>
                  <input
                    type="text"
                    value={trxIdInput}
                    onChange={(e) => setTrxIdInput(e.target.value)}
                    placeholder="যেমন: B7X9K2L1P0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                  />
                </div>

                {checkoutError && (
                  <div className="text-red-500 text-xs font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                    {checkoutError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full py-3 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all shadow-md shadow-red-500/20 text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  সাবমিট করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
