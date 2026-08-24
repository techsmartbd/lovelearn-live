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
  Crown,
  Camera,
  MessageSquare
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { DeviceWarningModal } from "@/components/DeviceWarningModal";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import ChatHistoryView from "@/components/chat-history-view";
import PcloudVideoPlayer from "./PcloudVideoPlayer";
import SecurePdfViewer from "./SecurePdfViewer";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    accountStatus?: string;
  };
  packages: any[];
  videos: any[];
  ebooks?: any[];
  ownedPackageIds: string[];
}

export default function DashboardClient({ user, packages, videos, ebooks = [], ownedPackageIds }: DashboardClientProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if returning from checkout back button
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("action") === "unlock" && searchParams.get("packageId")) {
      const pkgId = searchParams.get("packageId") || "";
      const priceStr = searchParams.get("price");
      const title = searchParams.get("title") || "";
      
      setSelectedProduct({
        id: pkgId,
        title: title,
        price: priceStr ? Number(priceStr) : 990
      });
      setCheckoutStep(1);
      setCheckoutModalOpen(true);
      
      // Clean up URL without reloading
      window.history.replaceState(null, "", "/dashboard");
    }
  }, []);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutorials" | "ebooks" | "combo" | "history" | "more" | "settings">("dashboard");

  // Collapsed Sidebar State (Desktop) - Default closed as requested
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isExpanded = !isSidebarCollapsed || isSidebarHovered;

  // User custom covers list
  const coversList = [
    "/images/covers/mail-1.png",
    "/images/covers/mail-2.png",
    "/images/covers/mail-3.png",
    "/images/covers/female-1.png",
    "/images/covers/female-2.png",
    "/images/covers/female-3.png"
  ];

  // Cover Image index state with auto-saving to localStorage
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    const savedIndex = localStorage.getItem("lovelearn_user_cover_index");
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex, 10);
      if (idx >= 0 && idx < coversList.length) {
        setCoverIndex(idx);
      }
    }
  }, []);

  // Profile settings form states
  const [profileName, setProfileName] = useState(user.name || "");
  const [profileEmail, setProfileEmail] = useState(user.email || "");
  const [profileCurrentPassword, setProfileCurrentPassword] = useState("");
  const [profileNewPassword, setProfileNewPassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Mobile sidebar navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Profile Settings dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Notification dropdown
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Locked item checkout modal
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; title: string; price: number; description?: string } | null>(null);
  
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

  const firstDbPackageId = packages[0]?.id || "pkg-ml";

  const [activeReadingEbook, setActiveReadingEbook] = useState<any | null>(null);

  const handlePlayVideo = (title: string, url: string, type: string) => {
    if (user.accountStatus === "HOLD") {
      alert("আপনার অ্যাকাউন্টের ভিডিও এক্সেস সাময়িকভাবে বন্ধ আছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।");
      return;
    }
    setActivePlayingVideo({ title, url, type });
  };

  const handleReadEbook = async (book: any) => {
    if (user.accountStatus === "HOLD") {
      alert("আপনার অ্যাকাউন্টের বই এক্সেস সাময়িকভাবে বন্ধ আছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।");
      return;
    }
    if (!book.pdfUrl) {
      alert("বইটির লিংক পাওয়া যায়নি।");
      return;
    }
    setActiveReadingEbook(book);
  };

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

  const handleOpenUnlock = (product: { id: string; title: string; price: number; description?: string }) => {
    setSelectedProduct(product);
    setCheckoutSuccess(false);
    setCheckoutError("");
    setTrxIdInput("");
    setCheckoutStep(1);
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

  // Auto-scroll effect for carousels
  useEffect(() => {
    if (activeTab !== "dashboard") return;
    
    const scrollInterval = setInterval(() => {
      [tutorialCarouselRef, ebookCarouselRef].forEach((ref) => {
        if (ref.current) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            ref.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      });
    }, 3500);

    return () => clearInterval(scrollInterval);
  }, [activeTab]);

  const activeVideos = videos && videos.length > 0 ? videos.map((v) => ({
    id: v.id,
    title: v.title,
    instructor: v.instructor || "সাকিব হাসান",
    duration: v.duration || "০২ ঘণ্টা ১৫ মিনিট",
    videos: v.videosCount || "১০টি ভিডিও",
    badge: v.badge || "নতুন",
    packageId: v.packageId,
    isPremium: v.isPremium !== undefined ? v.isPremium : true,
    progress: 0,
    thumbnail: v.thumbnail || "/images/landing-vide-thamb-1.png",
    url: v.url,
    type: v.type
  })) : [];

  const filteredTutorials = activeVideos.filter((tut) => {
    const isUnlocked = !tut.isPremium || ownedPackageIds.includes(tut.packageId);
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === "my") return isUnlocked;
    if (filterType === "progress") return isUnlocked && (tut.progress || 0) > 0 && (tut.progress || 0) < 100;
    if (filterType === "completed") return isUnlocked && (tut.progress || 0) === 100;
    return true;
  });

  const activeEbooks = ebooks && ebooks.length > 0 ? ebooks.map((e) => ({
    id: e.id,
    title: e.title,
    author: e.description || "Unknown",
    pages: "৩০০ পৃষ্ঠা", // Default
    category: "সাধারণ",
    isPremium: e.isPremium !== undefined ? e.isPremium : true,
    progress: 0,
    packageId: e.packageId,
    coverImage: e.thumbnail || "/images/landing-vide-thamb-1.png",
    pdfUrl: e.pdfUrl
  })) : [];

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500/20 border-t-[#ff0000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#070A0F] dark:text-slate-100 antialiased font-sans flex flex-col md:flex-row select-none">
      
      {/* Device Warning Modal */}
      <DeviceWarningModal />

      {/* Desktop Left Sidebar (Collapsible & Hover-Expandable) */}
      <aside 
        onMouseEnter={() => {
          if (isSidebarCollapsed) setIsSidebarHovered(true);
        }}
        onMouseLeave={() => {
          setIsSidebarHovered(false);
        }}
        onClick={() => {
          // If sidebar is expanded via hover, clicking anywhere inside pins it open
          if (isSidebarCollapsed) {
            setIsSidebarCollapsed(false);
          }
        }}
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-[#0B0F17] border-r border-slate-200/80 dark:border-slate-800/80 z-40 p-4 justify-between transition-all duration-300 ease-in-out ${
          isExpanded 
            ? "w-64 shadow-2xl md:shadow-lg dark:shadow-slate-950/80 cursor-default" 
            : "w-20 shadow-xs cursor-pointer"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Top Header Toggle Section */}
          <div className={`flex items-center min-h-[42px] ${isExpanded ? "justify-between px-1" : "justify-center"}`}>
            {isExpanded ? (
              <>
                <div className="flex items-center overflow-hidden">
                  <Logo variant="full" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents aside onClick from re-opening
                    setIsSidebarCollapsed(true);
                    setIsSidebarHovered(false);
                  }}
                  title="সাইডবার বন্ধ করুন"
                  className="p-2 rounded-xl text-slate-500 hover:text-[#ff0000] dark:hover:text-[#ff0000] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 group/btn"
                >
                  <PanelLeftClose className="w-5 h-5 text-slate-500 group-hover/btn:text-[#ff0000] transition-colors" />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarCollapsed(false);
                  setIsSidebarHovered(false);
                }}
                className="p-1 rounded-xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
                title="সাইডবার খুলুন"
              >
                <Logo variant="half" />
              </button>
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
                  title={!isExpanded ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-[#ff0000]/10 text-[#ff0000] border-l-4 border-[#ff0000]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  } ${!isExpanded ? "justify-center px-0" : ""}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#ff0000]" : ""}`} />
                  {isExpanded && <span className="truncate">{item.label}</span>}

                  {/* Tooltip on Collapsed Hover */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab("settings")}
            title={!isExpanded ? t("Settings") || "সেটিংস" : undefined}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all ${
              activeTab === "settings"
                ? "bg-[#ff0000]/10 text-[#ff0000]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800"
            } ${!isExpanded ? "justify-center px-0" : ""}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isExpanded && <span>{t("Settings") || "সেটিংস"}</span>}
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
              
              {/* Notification Bell & Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2.5 bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl relative hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff0000] text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-xs">
                    ৩
                  </span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col text-left">
                    <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">নোটিফিকেশন</h4>
                      <button className="text-[10px] font-bold text-[#ff0000] hover:underline cursor-pointer">সবগুলো পড়া হয়েছে</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {/* Notification 1 */}
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 relative">
                        <div className="w-2 h-2 rounded-full bg-[#ff0000] absolute top-5 left-2 shrink-0"></div>
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 ml-2">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">নতুন অফার!</p>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">ঈদ উপলক্ষে সকল প্রিমিয়াম কোর্সে ৫০% ছাড়! আজই এনরোল করুন।</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">২ ঘণ্টা আগে</p>
                        </div>
                      </div>
                      
                      {/* Notification 2 */}
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 relative">
                        <div className="w-2 h-2 rounded-full bg-[#ff0000] absolute top-5 left-2 shrink-0"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 ml-2">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">পেমেন্ট সফল হয়েছে</p>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">আপনার React.js কোর্সটির সাবস্ক্রিপশন সফলভাবে সম্পন্ন হয়েছে।</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">১ দিন আগে</p>
                        </div>
                      </div>

                      {/* Notification 3 */}
                      <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 relative">
                        <div className="w-2 h-2 rounded-full bg-[#ff0000] absolute top-5 left-2 shrink-0"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 ml-2">
                          <Play className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">নতুন ভিডিও আপলোড</p>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">Node.js কোর্সে নতুন ৩টি ভিডিও যুক্ত করা হয়েছে।</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">২ দিন আগে</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 text-center bg-slate-50 dark:bg-slate-900/80">
                      <button className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#ff0000] dark:hover:text-[#ff0000] transition-colors cursor-pointer">
                        সকল নোটিফিকেশন দেখুন
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-left font-bold"
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
                <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-2xl p-5 md:p-6 relative flex flex-col justify-between border border-white/15 dark:border-white/10 text-left min-h-[190px] md:min-h-[220px] group transition-all duration-300">
                  {/* Slow Breathing Motion Animation Stylesheet */}
                  <style>{`
                    @keyframes premiumSlowBreathing {
                      0% {
                        transform: scale(1.02) translate(0px, 0px);
                      }
                      50% {
                        transform: scale(1.08) translate(-1%, -0.5%);
                      }
                      100% {
                        transform: scale(1.02) translate(0px, 0px);
                      }
                    }
                    .animate-cover-slow {
                      animation: premiumSlowBreathing 36s ease-in-out infinite;
                    }
                  `}</style>

                  {/* Premium High Quality Custom Cover Image Background */}
                  <img
                    src={coversList[coverIndex]}
                    alt="User Cover"
                    className="absolute inset-0 w-full h-full object-cover bg-right select-none pointer-events-none transition-all duration-700 ease-in-out scale-100 group-hover:scale-[1.02] animate-cover-slow"
                  />

                  {/* Luxury soft radial background glaze overlays for premium visual depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                  
                  {/* Extra-ordinary Glassmorphism Glaze Sweep Effect */}
                  <div className="absolute inset-0 opacity-15 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                  {/* Top Row inside Hero: Welcome Title + Avatar Theme Selector */}
                  <div className="relative flex items-start justify-between gap-4 z-10">
                    <div className="space-y-1 max-w-md">
                      <h2 className="text-lg md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        স্বাগতম ফিরে এসেছেন, {user.name || "সাকিব"}! 👋
                      </h2>
                      <p className="text-slate-100/90 text-xs md:text-xs font-extrabold leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        আজ কিছু নতুন শিখি, নিজেকে আরও এক ধাপ এগিয়ে নিই!
                      </p>
                    </div>

                    {/* Auto-Saving Cover Cycle Trigger Button (Top-Right inside Hero) */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() => {
                          const nextIndex = (coverIndex + 1) % coversList.length;
                          setCoverIndex(nextIndex);
                          localStorage.setItem("lovelearn_user_cover_index", nextIndex.toString());
                        }}
                        title="কভার পরিবর্তন করুন"
                        className="p-2.5 bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md border border-white/20 hover:border-white/40 text-white rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center group/btn shrink-0"
                      >
                        <Camera className="w-4 h-4 text-white group-hover/btn:rotate-12 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>


                  {/* Bottom Row inside Hero: Continue Learning Card */}
                  <div className="relative z-10 mt-4 max-w-sm">
                    <div className="bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 md:p-3 border border-white/20 shadow-2xl flex flex-col space-y-2 text-left text-slate-900 dark:text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">চালিয়ে যান</span>
                        <span className="text-[10px] font-black text-[#ff0000]">65%</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* React icon box */}
                        <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white truncate">React.js বাংলা টিউটোরিয়াল</h4>
                          <p className="text-[9.5px] font-extrabold text-slate-500 truncate">অধ্যায় ১২ - React Router</p>
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
                <div className="lg:col-span-4 bg-white dark:bg-[#0B0F17] rounded-3xl p-4 md:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between text-left space-y-3">
                  <h3 className="font-black text-xs md:text-[15px] text-slate-950 dark:text-white flex items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 w-full">
                    <Sparkles className="w-4 h-4 text-[#ff0000]" /> দ্রুত অ্যাক্সেস
                  </h3>

                  {/* 6 Grid Cards (2 columns x 3 rows) */}
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    {/* Card 1: My Courses */}
                    <button 
                      onClick={() => { setActiveTab("tutorials"); setFilterType("my"); }}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="font-black text-[11px] md:text-xs text-slate-900 dark:text-white">আমার কোর্স</div>
                      <div className="text-[9px] font-bold text-slate-400">১টি কোর্স</div>
                    </button>

                    {/* Card 2: My eBooks */}
                    <button 
                      onClick={() => { setActiveTab("ebooks"); setEbookFilter("my"); }}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-black text-[11px] md:text-xs text-slate-900 dark:text-white">আমার ই-বুক</div>
                      <div className="text-[9px] font-bold text-slate-400">১২টি ই-বুক</div>
                    </button>

                    {/* Card 3: Course Packages */}
                    <button 
                      onClick={() => setActiveTab("combo")}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Gift className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-black text-[11px] md:text-xs text-slate-900 dark:text-white">কোর্স প্যাকেজ</div>
                      <div className="text-[9px] font-bold text-slate-400">৫টি প্যাকেজ</div>
                    </button>

                    {/* Card 4: Certificates */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-black text-[11px] md:text-xs text-slate-900 dark:text-white">সার্টিফিকেট</div>
                      <div className="text-[9px] font-bold text-slate-400">৪টি সার্টিফিকেট</div>
                    </button>

                    {/* Card 5: My Library */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-black text-[11px] md:text-xs text-slate-900 dark:text-white">আমার লাইব্রেরি</div>
                      <div className="text-[9px] font-bold text-slate-400">সকল কনটেন্ট</div>
                    </button>

                    {/* Card 6: Help & Support */}
                    <button 
                      onClick={() => setActiveTab("more")}
                      className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                        className="w-[240px] md:w-[260px] shrink-0 bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 md:p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group"
                      >
                        <div className="space-y-2">
                          {/* Thumbnail with overlay & badge */}
                          <div className="aspect-[16/10] relative rounded-xl overflow-hidden shadow-xs select-none">
                            <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover" />

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

                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-snug group-hover:text-[#ff0000] transition-colors truncate mt-1">
                            {tut.title}
                          </h4>
                        </div>

                        {/* Button Rules based on specification */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-850 space-y-1.5">
                          {isUnlocked ? (
                            <>
                              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                <span>{tut.progress}% সম্পন্ন</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ff0000] rounded-full" style={{ width: `${tut.progress}%` }} />
                              </div>
                              <button 
                                onClick={() => handlePlayVideo(tut.title, tut.url, tut.type)}
                                className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-lg transition-all text-xs cursor-pointer mt-1"
                              >
                                চালিয়ে যান
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleOpenUnlock({ id: tut.packageId, title: tut.title, price: 990 })}
                              className="w-full py-2 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20"
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
                  {activeEbooks.map((book) => {
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
                            <button 
                              onClick={() => setActiveReadingEbook(book)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" /> 
                              পড়ুন
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenUnlock({ id: book.packageId, title: book.title, price: 990 })}
                              className="w-full py-2 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-lg transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
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
                  <button onClick={() => setActiveTab("combo")} className="w-fit px-4 py-2 bg-white text-red-700 font-extrabold rounded-lg text-xs hover:bg-red-50 transition-all cursor-pointer shadow-md">
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
                  <button onClick={() => setActiveTab("combo")} className="w-fit px-4 py-2 bg-white text-blue-700 font-extrabold rounded-lg text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-md">
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
                  <button onClick={() => setActiveTab("tutorials")} className="w-fit px-4 py-2 bg-white text-emerald-700 font-extrabold rounded-lg text-xs hover:bg-emerald-50 transition-all cursor-pointer shadow-md">
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
                    <div key={tut.id} className="bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 md:p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group text-left">
                      <div className="space-y-2">
                        <div className="aspect-[16/10] relative rounded-xl overflow-hidden shadow-xs select-none">
                          <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover" />

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
                              onClick={() => handlePlayVideo(tut.title, tut.url, tut.type)}
                              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-xs text-slate-950 dark:text-white leading-snug group-hover:text-[#ff0000] transition-colors mt-1">{tut.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">ইন্সট্রাক্টর: {tut.instructor}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-850 space-y-1.5">
                        {isUnlocked ? (
                          <button 
                            onClick={() => handlePlayVideo(tut.title, tut.url, tut.type)}
                            className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-lg transition-all text-xs cursor-pointer"
                          >
                            চালিয়ে যান
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenUnlock({ id: tut.packageId, title: tut.title, price: 990 })}
                            className="w-full py-2.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-lg transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
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
                {activeEbooks.map((book) => {
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
                            <button 
                              onClick={() => handleReadEbook(book)}
                              className="w-full py-2 bg-white text-[#ff0000] border-2 border-[#ff0000] hover:bg-red-50 font-black rounded-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                            >
                              পড়ুন
                            </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenUnlock({ id: book.packageId, title: book.title, price: 990 })}
                            className="w-full py-2 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-lg transition-all text-xs cursor-pointer shadow-md shadow-red-500/20"
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

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="max-w-7xl mx-auto h-[calc(100vh-140px)]">
              <ChatHistoryView />
            </div>
          )}

          {/* OTHER TABS (SETTINGS, MORE, ETC.) */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xs">
              <h2 className="text-xl font-black text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                অ্যাকাউন্ট সেটিংস
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); alert("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!"); }} className="space-y-5 text-xs font-extrabold">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <img 
                      src={profileAvatarUrl} 
                      alt="Profile Avatar" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-[#ff0000] text-white rounded-full shadow-lg hover:bg-[#d60000] transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (e) => setProfileAvatarUrl(e.target?.result as string);
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">প্রোফাইল ছবি পরিবর্তন করুন</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 dark:text-slate-400">বর্তমান পাসওয়ার্ড</label>
                      <input
                        type="password"
                        placeholder="আপনার বর্তমান পাসওয়ার্ড দিন"
                        value={profileCurrentPassword}
                        onChange={(e) => setProfileCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-600 dark:text-slate-400">নতুন পাসওয়ার্ড</label>
                        <input
                          type="password"
                          placeholder="নতুন পাসওয়ার্ড দিন"
                          value={profileNewPassword}
                          onChange={(e) => setProfileNewPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-slate-600 dark:text-slate-400">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                        <input
                          type="password"
                          placeholder="নতুন পাসওয়ার্ডটি পুনরায় দিন"
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-black rounded-xl transition-all shadow-md shadow-red-500/20 text-xs cursor-pointer mt-6"
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
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 md:p-12">
          <div className="w-full max-w-5xl aspect-video bg-black relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {/* Close Button floating over video */}
            <button 
              onClick={() => setActivePlayingVideo(null)} 
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/80 text-white/70 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {activePlayingVideo.type === "CLOUD" || activePlayingVideo.type === "PCLOUD" ? (
              <PcloudVideoPlayer 
                url={activePlayingVideo.url} 
                className="w-full h-full object-contain"
              />
              ) : (
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
              )}
          </div>
        </div>
      )}

      {/* Locked Course Checkout Modal */}
      {checkoutModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 transition-all">
          <div className="w-full md:w-[420px] bg-white dark:bg-[#1E293B] md:rounded-3xl overflow-hidden md:shadow-2xl md:border border-slate-200 dark:border-slate-700/60 relative min-h-screen md:min-h-0 md:h-[760px] flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
              <h3 className="font-black text-sm text-slate-950 dark:text-white">কোর্স আনলক করুন</h3>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4 text-xs font-extrabold">
                <div className="bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="text-[10px] text-slate-400 uppercase font-black">প্যাকেজ বিবরণ</div>
                  <div className="text-slate-900 dark:text-white font-black text-xl">{selectedProduct.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {selectedProduct.description || "এই প্যাকেজে আপনি প্রিমিয়াম কোর্স ভিডিও এবং প্রয়োজনীয় স্টাডি ম্যাটেরিয়াল পাবেন, যা আপনার স্কিল ডেভেলপমেন্টে সাহায্য করবে।"}
                  </div>
                  <div className="text-[#ff0000] font-black text-lg mt-2">মূল্য: ৳{selectedProduct.price}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `/checkout?skipStep1=true&phone=${encodeURIComponent(user.phone || "")}&price=${selectedProduct.price}&title=${encodeURIComponent(selectedProduct.title || "")}&packageId=${selectedProduct.id}`;
                }}
                className="w-full py-4 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-btn-glow btn-shimmer cursor-pointer text-sm mt-8"
              >
                কন্টিনিউ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Active Reading Ebook Modal */}
      {activeReadingEbook && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-12 transition-colors">
          <div className="w-full h-[100dvh] md:h-[90vh] max-w-5xl bg-white dark:bg-slate-900 relative md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 flex flex-col transition-colors">
            <SecurePdfViewer 
              url={
                activeReadingEbook.pdfUrl.includes("code=") 
                  ? `/api/proxy-pdf?code=${activeReadingEbook.pdfUrl.match(/code=([^&]+)/)?.[1]}` 
                  : `/api/proxy-pdf?direct=${encodeURIComponent(activeReadingEbook.pdfUrl)}`
              }
              title={activeReadingEbook.title}
              onClose={() => setActiveReadingEbook(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
