"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Search,
  ShieldAlert,
  Target,
  EyeOff,
  Play,
  Check,
  ArrowRight,
  HelpCircle,
  Infinity,
  Map,
  Lock,
  Globe,
  Bell,
  Star,
  Phone,
  Cloud,
  Mail,
  Minus,
  Smartphone,
  LogIn,
  Eye,
  Menu,
  ChevronDown,
  ChevronUp,
  Zap,
  Frown,
  ArrowDown,
  Code,
  Headphones,
  Users,
  Key,
  BookOpen,
  Languages,
  Tv,
  Crown
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import PcloudVideoPlayer from "./PcloudVideoPlayer";

export default function LandingClient() {
  const { t, language } = useLanguage();
  // Theme state
  const [mounted, setMounted] = useState(false);
  const [landingVideo, setLandingVideo] = useState<{ url: string; thumbnail: string; type: string } | null>(null);
  const [reviews, setReviews] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Interactive accordion state (default null = all closed)
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Selected payment method state
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "upay">("bkash");

  // Dynamic WhatsApp Number from Admin Settings
  const [whatsappNumber, setWhatsappNumber] = useState("01748805599");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.WHATSAPP_NUMBER) {
          setWhatsappNumber(data.WHATSAPP_NUMBER);
        }
      })
      .catch(err => console.log("Failed to load whatsapp number setting:", err));
  }, []);

  // Form submission state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Visitor engagement and video tracking states
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [watchTimer, setWatchTimer] = useState(0);
  const [loggedEngagement, setLoggedEngagement] = useState(false);
  const [loggedDwell, setLoggedDwell] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    setMounted(true);
    // Ticking timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    // Log immediate visitor visit
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source") || "direct";
    const utm_medium = params.get("utm_medium") || "none";
    const utm_campaign = params.get("utm_campaign") || "organic";
    const utm_content = params.get("utm_content") || "";

    fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "VISITOR_ENGAGEMENT",
        details: {
          event: "page_visit",
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          timestamp: new Date().toISOString()
        }
      })
    }).catch(err => console.error("Failed to log page visit:", err));

    // Fetch active landing video
    fetch("/api/landing-video")
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setLandingVideo(data);
        }
      })
      .catch(err => console.error("Failed to load active landing video:", err));

    // Fetch review banners
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch(err => console.error("Failed to load reviews:", err));

    return () => clearInterval(interval);
  }, []);

  // Resize listener for mobile slider check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide reviews every 5 seconds
  useEffect(() => {
    const total = reviews.length > 0 ? reviews.length : 5;
    if (total <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  // Handle infinite seamless loop reset
  useEffect(() => {
    const total = reviews.length > 0 ? reviews.length : 5;
    if (currentSlide === total) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 1000); // Wait for transition duration-1000 to complete
      return () => clearTimeout(timeout);
    }
  }, [currentSlide, reviews]);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  // Track video watch time (trigger at 5s)
  useEffect(() => {
    if (!videoPlaying || loggedEngagement) return;

    const interval = setInterval(() => {
      setWatchTimer((prev) => {
        const nextValue = prev + 1;
        if (nextValue >= 5) {
          const params = new URLSearchParams(window.location.search);
          const utm_source = params.get("utm_source") || "direct";
          const utm_medium = params.get("utm_medium") || "none";
          const utm_campaign = params.get("utm_campaign") || "organic";
          const utm_content = params.get("utm_content") || "";

          fetch("/api/analytics/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "VISITOR_ENGAGEMENT",
              details: {
                watchTimeSeconds: nextValue,
                isHotLead: true,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
                screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
                referrer: typeof document !== "undefined" ? document.referrer : "",
                timestamp: new Date().toISOString()
              }
            })
          })
            .then(() => setLoggedEngagement(true))
            .catch((err) => console.error("Failed to log visitor engagement:", err));
          
          clearInterval(interval);
        }
        return nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [videoPlaying, loggedEngagement]);

  // Track page dwell time (trigger at 15s)
  useEffect(() => {
    if (loggedDwell) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const utm_source = params.get("utm_source") || "direct";
      const utm_medium = params.get("utm_medium") || "none";
      const utm_campaign = params.get("utm_campaign") || "organic";
      const utm_content = params.get("utm_content") || "";

      fetch("/api/analytics/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VISITOR_ENGAGEMENT",
          details: {
            dwellTimeSeconds: 15,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
            screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
            referrer: typeof document !== "undefined" ? document.referrer : "",
            timestamp: new Date().toISOString()
          }
        })
      })
        .then(() => setLoggedDwell(true))
        .catch((err) => console.error("Failed to log dwell engagement:", err));
    }, 15000);

    return () => clearTimeout(timeout);
  }, [loggedDwell]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password || !trxId) {
      setError("মোবাইল নম্বর, পাসওয়ার্ড এবং ট্রানজেকশন আইডি আবশ্যক!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, trxId })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        window.location.href = data.redirectUrl || "/checkout/success";
      } else {
        setError(data.error || "অর্ডার সম্পন্ন করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setError("নেটওয়ার্ক এরর! অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordionIndex((prev) => (prev === idx ? null : idx));
  };

  const getEmbedUrl = (videoUrl: string, type: string) => {
    if (type === 'YOUTUBE') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : videoUrl;
    }
    if (type === 'VIMEO') {
      const match = videoUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      const videoId = match ? match[3] : null;
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : videoUrl;
    }
    if (type === 'GOOGLE_DRIVE') {
      return videoUrl.replace(/\/view(\?.*)?$/, '/preview');
    }
    return videoUrl;
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F14] dark:text-slate-100 antialiased font-sans">
      
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 dark:bg-[#0B0F14]/80 backdrop-blur-lg z-50 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="cursor-pointer shrink-0"><Logo /></Link>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-full p-1 backdrop-blur-xs">
            <Link href="#courses" className="w-[90px] h-8 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff0000] rounded-full transition-all hover:bg-white dark:hover:bg-slate-950 hover:shadow-3xs">
              {t("courses")}
            </Link>
            <Link href="#how-it-works" className="w-[130px] h-8 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff0000] rounded-full transition-all hover:bg-white dark:hover:bg-slate-950 hover:shadow-3xs">
              {t("howItWorks")}
            </Link>
            <Link href="#success-stories" className="w-[135px] h-8 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff0000] rounded-full transition-all hover:bg-white dark:hover:bg-slate-950 hover:shadow-3xs">
              {t("successStories")}
            </Link>
            <Link href="#faq" className="w-[90px] h-8 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff0000] rounded-full transition-all hover:bg-white dark:hover:bg-slate-950 hover:shadow-3xs">
              {t("faq")}
            </Link>
            <Link href="#contact" className="w-[90px] h-8 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff0000] rounded-full transition-all hover:bg-white dark:hover:bg-slate-950 hover:shadow-3xs">
              {t("contact")}
            </Link>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            {/* Mobile Notification Bell */}
            <button className="md:hidden relative p-1 text-slate-700 dark:text-slate-300 cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff0000] rounded-full border border-white dark:border-[#0B0F14]"></span>
            </button>
            <Link 
              href="/login"
              className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:w-[140px] h-9 text-xs font-extrabold text-white bg-gradient-to-r from-[#ff0000] via-[#400000] to-black animate-gradient-move rounded-lg transition-all border border-transparent dark:border-white/15 shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-4 h-4 shrink-0 text-white" />
              <span className="text-white hidden md:inline">{language === "bn" ? "লগইন" : "Login"}</span>
              <span className="text-white md:hidden">{language === "bn" ? "লগইন" : "Login"}</span>
            </Link>
          </div>
        </div>

        </nav>

      {/* Mobile Sidebar overlay below Header */}
        <div 
          className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ top: '64px' }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Content */}
          <div 
            className={`absolute top-0 left-0 h-full w-[80%] max-w-[320px] bg-slate-100/90 dark:bg-[#121820]/90 backdrop-blur-2xl shadow-[10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-300 transform overflow-y-auto ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 space-y-3">
              
              {/* Top Toggles Box */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-white dark:bg-[#0B0F14] rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-2 flex items-center justify-center gap-2">
                  <ThemeToggle />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{language === "bn" ? "থিম" : "Theme"}</span>
                </div>
                <div className="flex-1 bg-white dark:bg-[#0B0F14] rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-2 flex items-center justify-center">
                  <LanguageToggle />
                </div>
              </div>

              {/* Profile/Welcome Block */}
              <div className="bg-white dark:bg-[#0B0F14] rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-slate-200/50 dark:border-slate-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff0000] to-[#ff4040] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-black text-xl">U</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 leading-tight">{language === "bn" ? "স্বাগতম!" : "Welcome!"}</h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{language === "bn" ? "গেস্ট ইউজার" : "Guest User"}</p>
                </div>
              </div>
              
              {/* Main Links Box */}
              <div className="bg-white dark:bg-[#0B0F14] rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col">
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#courses" className="flex items-center gap-3 p-3.5 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("courses")}</span>
                </Link>
                
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#how-it-works" className="flex items-center gap-3 p-3.5 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("howItWorks")}</span>
                </Link>
                
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#success-stories" className="flex items-center gap-3 p-3.5 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("successStories")}</span>
                </Link>
                
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#contact" className="flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("contact")}</span>
                </Link>
              </div>
              
              {/* Info Box */}
              <div className="bg-white dark:bg-[#0B0F14] rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col mb-6">
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#faq" className="flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("faq")}</span>
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 space-y-2 text-center">
        {/* Main Title Banner */}
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-1">
          <h1 className="flex flex-col items-center gap-0.5 text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            <span className="flex items-center justify-center gap-3 text-[0.8em]">
              <span className="inline-block bg-[#ff0000] text-white px-5 py-2 rounded-xl shadow-xl shadow-red-500/10 skew-x-[-12deg]">
                <span className="inline-block skew-x-[12deg] font-black italic">
                  বিছানায় স্ত্রীকে
                </span>
              </span>
              <span className="font-black not-italic">
                কি
              </span>
            </span>
            <span className="font-black block">
              তৃপ্তি দিতে পারছেন?
            </span>
          </h1>
          <p className="text-[11px] min-[380px]:text-[13px] sm:text-[15px] md:text-xl text-slate-900 dark:text-slate-100 font-extrabold leading-normal md:leading-relaxed max-w-3xl mx-auto mt-2 md:mt-3 whitespace-nowrap md:whitespace-normal tracking-tighter md:tracking-normal">
            ১০ জনের ৯ জন পুরুষই জানেন না কীভাবে স্ত্রীকে তৃপ্ত করতে হয়। <br />
            আর এই <span className="text-[#ff0000] font-black">না-জানাটাই</span> সংসারে ডেকে আনে{" "}
            <span className="text-[#ffba00]">অশান্তি</span>, <span className="text-[#b85a1c]">দূরত্ব</span>, এমনকি <span className="text-[#ff0000] underline decoration-2 underline-offset-4">ডিভোর্স!</span>
          </p>
        </div>

        {/* Video Player Mockup */}
        <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black border-[5px] border-white dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group mt-2 md:mt-4">
          {videoPlaying ? (
            landingVideo && (landingVideo.type === 'CLOUD' || landingVideo.type === 'PCLOUD') ? (
              <PcloudVideoPlayer 
                url={landingVideo.url} 
                poster={landingVideo.thumbnail || undefined}
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe 
                src={getEmbedUrl(landingVideo?.url || "https://player.vimeo.com/video/1211086551", landingVideo?.type || "VIMEO")} 
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
              />
            )
          ) : (
            <div onClick={() => setVideoPlaying(true)} className="w-full h-full relative cursor-pointer font-bold">
              <img 
                src={(landingVideo?.thumbnail && landingVideo.thumbnail.trim() !== "" && landingVideo.thumbnail !== "null") ? landingVideo.thumbnail : "/images/landing-vide-thamb-1.png"} 
                alt="Course Video Thumbnail" 
                className="w-full h-full object-cover opacity-90 dark:opacity-75" 
                onError={(e) => {
                  e.currentTarget.src = "/images/landing-vide-thamb-1.png";
                }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                <div className="bg-[#ff0000] w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 transform transition-transform group-hover:scale-110">
                  <Play className="w-9 h-9 text-white fill-current ml-1" />
                </div>
              </div>
              {/* Custom Video Controls overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-xs px-6 py-4 flex items-center justify-between text-xs text-white border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-4">
                  <Play className="w-4 h-4 fill-current" />
                  <span>00:00 / Play Video</span>
                </div>
                <div className="w-full mx-6 h-1 bg-white/20 rounded-full relative">
                  <div className="w-0 h-full bg-[#ff0000] rounded-full" />
                </div>
                <div className="flex items-center space-x-4">
                  <span>HD Auto</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Highlight Banner */}
        <div className="relative w-full max-w-4xl mx-auto bg-black rounded-xl py-3 md:py-5 px-3 md:px-8 shadow-lg shadow-red-500/5 text-center text-[17px] md:text-[22px] font-bold leading-snug md:leading-relaxed text-white mt-4 select-none flex flex-col justify-center">
          {/* Tapered Left Border Line */}
          <div className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-gradient-to-b from-transparent via-[#ff0000] to-transparent rounded-full" />
          {/* Tapered Right Border Line */}
          <div className="absolute right-0 top-[10%] bottom-[10%] w-[3px] bg-gradient-to-b from-transparent via-[#ff0000] to-transparent rounded-full" />
          <p>
            চটকদার অ্যাড, দামি সাপ্লিমেন্ট — <span className="text-[#ff0000]">তবু ফল শূন্য।</span> কারণ আসল সমস্যা ওষুধে নয়, <span className="text-[#ff0000]">না-জানায়।</span>
          </p>
          <p className="mt-1 md:mt-0.5">
            <span className="text-[#ffba00]">‘মাস্টার লাভার’</span> কোর্স করে ৩,৭৫০+ স্বামী আজ স্ত্রীকে <span className="text-[#ff0000]">পূর্ণ তৃপ্তি</span> দিতে শিখেছেন।
          </p>
        </div>

        {/* --- ADDED PRICING & CTA FROM REFERENCE --- */}
        <div className="flex flex-col items-center justify-center mt-8 mb-2 space-y-4">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="text-center flex flex-col">
              <span className="text-sm md:text-base text-slate-400 font-semibold mb-1">রেগুলার প্রাইস</span>
              <span className="text-2xl md:text-3xl text-slate-400 line-through font-bold">৩,০০০ টাকা</span>
            </div>
            <div className="text-center flex flex-col">
              <span className="text-sm md:text-base text-[#ff0000] font-semibold mb-1">আজকের অফার</span>
              <span className="text-5xl md:text-6xl font-extrabold text-[#ff0000]">৯৯০ <span className="text-4xl md:text-5xl text-black dark:text-white">টাকা</span></span>
            </div>
          </div>

          <div className="text-center mt-2 mb-0">
            <span className="inline-block bg-[#f8ce22] text-black font-bold px-8 py-2 md:py-2.5 rounded-full text-[13px] md:text-[15px] border border-yellow-400 shadow-sm">
              শুধু ভিডিও সংগ্রহের জন্য সীমিত অফার
            </span>
          </div>
        </div>
        {/* -------------------------------------- */}

        {/* Feature Badges Row */}
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2 md:gap-3 pt-2 pb-0">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-2xs font-bold text-[11px] md:text-xs">
            <Infinity className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>লাইফটাইম অ্যাক্সেস</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-2xs font-bold text-[11px] md:text-xs">
            <Zap className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>ইনস্ট্যান্ট অ্যাক্সেস</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-2xs font-bold text-[11px] md:text-xs">
            <Smartphone className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>মোবাইল ফ্রেন্ডলি</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-2xs font-bold text-[11px] md:text-xs">
            <Globe className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>বাংলা কোর্স</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-2xs font-bold text-[11px] md:text-xs">
            <Cloud className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>আপডেটেড কনটেন্ট</span>
          </div>
        </div>

        {/* CTA order button */}
        <div className="flex flex-col items-center justify-center space-y-2 mt-8 mb-4 w-full">
          <Link prefetch={false} href="/checkout" className="inline-flex items-center justify-center rounded-xl bg-[#ff0000] hover:bg-[#d60000] py-4 px-12 font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-btn-glow btn-shimmer animate-pulse-btn text-lg">
            এখনই কোর্সটি অ্যাক্সেস নিন!
          </Link>
          <span className="text-[12px] md:text-[14px] text-[#ff0000] font-bold tracking-wide mt-2">
            সুযোগটা হারানো মানে নিজের সংসারের সাথেই অবিচার!
          </span>
        </div>
      </section>

      {/* NEW SECTION: Wife Happiness */}
      <section className="bg-white dark:bg-[#0B0F14]/40 border-t border-slate-200 dark:border-slate-850 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              আপনার স্ত্রী কি আপনাকে নিয়ে <span className="text-[#ff0000] underline decoration-[#ff0000] underline-offset-4">সত্যিই খুশি?</span>
            </h2>
            <p className="text-sm md:text-lg font-semibold text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              স্ত্রীকে তৃপ্তি দিতে না পারার এই <span className="text-[#ffba00]">ব্যর্থতা</span>, ধীরে ধীরে তার মনে <span className="text-[#ff0000] underline decoration-2 underline-offset-4 font-bold">অন্য কোনো পুরুষকে মনে জায়গা দিচ্ছে</span> না তো?
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Small red line above grid */}
            <div className="w-16 h-1 bg-[#ff0000] mx-auto mb-8 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white dark:bg-[#121820] rounded-xl py-4 md:py-6 px-5 md:px-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 border-l-[4px] border-r-[4px] border-l-[#ff0000] border-r-[#ff0000] flex items-center gap-4 md:gap-5 group hover:shadow-[0_0_20px_rgba(255,0,0,0.08)] transition-all">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-[#ff0000] shrink-0" />
                <p className="text-[15px] md:text-[18px] font-bold text-slate-800 dark:text-slate-200 text-left leading-snug">
                  স্ত্রী মুখে কিছু বলে না, কিন্তু ভেতরে ভেতরে অতৃপ্তি জমতে থাকে।
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#121820] rounded-xl py-4 md:py-6 px-5 md:px-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 border-l-[4px] border-r-[4px] border-l-[#ff0000] border-r-[#ff0000] flex items-center gap-4 md:gap-5 group hover:shadow-[0_0_20px_rgba(255,0,0,0.08)] transition-all">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-[#ff0000] shrink-0" />
                <p className="text-[15px] md:text-[18px] font-bold text-slate-800 dark:text-slate-200 text-left leading-snug">
                  ছোট ছোট বিষয়ে রোজ ঝগড়া, অথচ আসল কারণটাই জানেন না।
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#121820] rounded-xl py-4 md:py-6 px-5 md:px-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 border-l-[4px] border-r-[4px] border-l-[#ff0000] border-r-[#ff0000] flex items-center gap-4 md:gap-5 group hover:shadow-[0_0_20px_rgba(255,0,0,0.08)] transition-all">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-[#ff0000] shrink-0" />
                <p className="text-[15px] md:text-[18px] font-bold text-slate-800 dark:text-slate-200 text-left leading-snug">
                  এই অশান্তি একদিন সন্দেহ, পরকীয়া বা ডিভোর্স পর্যন্ত গড়ায়।
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#121820] rounded-xl py-4 md:py-6 px-5 md:px-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 border-l-[4px] border-r-[4px] border-l-[#ff0000] border-r-[#ff0000] flex items-center gap-4 md:gap-5 group hover:shadow-[0_0_20px_rgba(255,0,0,0.08)] transition-all">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-[#ff0000] shrink-0" />
                <p className="text-[15px] md:text-[18px] font-bold text-slate-800 dark:text-slate-200 text-left leading-snug">
                  একদিন হঠাৎ শুনবেন — সে অন্য কাউকে চায়!
                </p>
              </div>
            </div>
            
            <div className="bg-black rounded-2xl py-6 md:py-8 px-6 md:px-10 shadow-xl shadow-red-500/10 border-l-[4px] border-r-[4px] border-l-[#ff0000] border-r-[#ff0000] text-center flex items-center justify-center min-h-[80px] mt-8">
              <p className="text-[18px] md:text-[25px] font-black leading-relaxed">
                <span className="text-white">সব সমস্যা একদিনে সমাধান হবে না! কিন্তু </span>
                <span className="text-[#f8ce22]">সঠিক জিনিসটা </span>
                <span className="text-white">জানলে, সমস্যা বুঝে সহজেই </span>
                <span className="text-[#ff0000]">সমাধান করতে পারবেন!</span>
              </p>
            </div>

            <div className="flex flex-col items-center justify-center mt-12 space-y-4">
              <div className="flex items-center gap-6 md:gap-10">
                <div className="text-center flex flex-col">
                  <span className="text-sm md:text-base text-slate-400 font-semibold mb-1">রেগুলার প্রাইস</span>
                  <span className="text-2xl md:text-3xl text-slate-400 line-through font-bold">৩,০০০ টাকা</span>
                </div>
                <div className="text-center flex flex-col">
                  <span className="text-sm md:text-base text-[#ff0000] font-semibold mb-1">আজকের অফার</span>
                  <span className="text-5xl md:text-6xl font-extrabold text-[#ff0000]">৯৯০ <span className="text-4xl md:text-5xl text-black dark:text-white">টাকা</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-2 mt-4 w-full">
                <Link prefetch={false} href="/checkout" className="inline-flex items-center justify-center rounded-xl bg-[#ff0000] hover:bg-[#d60000] py-4 px-12 font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-btn-glow btn-shimmer animate-pulse-btn text-lg">
                  কোর্সটি নিতে চাই! — ৯৯০
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="success-stories" className="bg-slate-50 dark:bg-[#0B0F14]/60 border-t border-b border-slate-200 dark:border-slate-850 py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white">
              <span className="text-[#ff0000]">৩,৭৫০+</span> স্বামী কি বলছে?
            </h2>
            <div className="flex flex-col items-center justify-center pt-2">
              <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-300">
                আমাদের ইনবক্স ও কমেন্ট থেকে <span className="text-[#ff0000]">স্যাটিসফাইড লার্নারদের রিভিউ:</span>
              </p>
              <div className="w-20 h-[3px] bg-[#ff0000] mx-auto mt-3"></div>
            </div>
          </div>

          <div className="relative w-full mx-auto overflow-hidden">
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : 'transition-none'}`}
              style={{
                transform: `translateX(-${currentSlide * (isMobile ? 100 : 25)}%)`
              }}
            >
              {((): string[] => {
                const list = reviews.length > 0 ? reviews : [
                  "/uploads/reviews/1.png",
                  "/uploads/reviews/2.png",
                  "/uploads/reviews/3.png",
                  "/uploads/reviews/4.png",
                  "/uploads/reviews/5.png"
                ];
                // Append first two items to ensure seamless wrapping on desktop
                return [...list, ...list.slice(0, 3)];
              })().map((banner, index) => (
                <div 
                  key={index}
                  className="w-full md:w-1/4 shrink-0 px-3"
                >
                  <div className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.06)] dark:shadow-[0_0_20px_rgba(255,0,0,0.12)] hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] border border-slate-200/40 dark:border-slate-800/40 transition-all duration-300 hover:scale-[1.015]">
                    <img 
                      src={banner} 
                      alt={`Review Banner ${index + 1}`} 
                      className="w-full h-auto object-cover rounded-2xl" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {(reviews.length > 0 ? reviews : [
              "/uploads/reviews/1.png",
              "/uploads/reviews/2.png",
              "/uploads/reviews/3.png",
              "/uploads/reviews/4.png",
              "/uploads/reviews/5.png"
            ]).map((_, index) => {
              const totalReviews = reviews.length > 0 ? reviews.length : 5;
              const isActive = (currentSlide % totalReviews) === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'bg-[#ff0000] scale-125' : 'bg-slate-300 dark:bg-slate-700'}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* OFFER HERO SECTION (New) */}
      <section className="bg-[#050505] relative py-16 md:py-24 px-4 w-full border-b-[8px] border-[#ff0000] overflow-hidden">
        {/* Outer Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,0,0,0.5)_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06] pointer-events-none" />
        
        <div className="max-w-[450px] mx-auto bg-[#0a0c10] border-[3px] border-[#ff0000] rounded-2xl p-5 md:p-7 relative shadow-[0_0_30px_rgba(255,0,0,0.6)] mt-8 z-10">
          {/* Inner Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] pointer-events-none rounded-xl" />
          
          {/* Top Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff0000] text-white text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap tracking-wide border border-red-500 shadow-md z-20 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#ffba00] fill-[#ffba00] shrink-0" />
            <span>প্রো-অফার: আজই রেজিস্ট্রেশন করুন</span>
            <Crown className="w-3.5 h-3.5 text-[#ffba00] fill-[#ffba00] shrink-0" />
          </div>
          
          <div className="relative z-10">
            {/* Heading */}
            <h2 className="text-white text-[28px] md:text-3xl font-black text-center mt-3 mb-6 leading-tight">
              আজকের <span className="text-[#ff0000]">এক্সক্লুসিভ অফার!</span>
            </h2>
            
            {/* Items */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-3 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                <div className="bg-[#ff0000] text-white p-2.5 rounded-lg flex-shrink-0 shadow-lg shadow-red-500/20">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white text-base md:text-lg font-bold">মাস্টার সোর্স কোড</div>
                  <div className="text-gray-500 text-xs line-through mt-0.5">রেগুলার ফি ১৫,০০০ ৳</div>
                </div>
              </div>
              
              {/* Middle Badge */}
              <div className="flex justify-center my-3 relative z-10 -my-1">
                <div className="bg-[#ff0000] text-white text-[10px] md:text-xs font-bold rounded-full px-4 py-1 shadow-md border border-red-400">
                  আর পাচ্ছেন ৪টি স্পেশাল বোনাস!
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-3 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                <div className="bg-[#ff0000] text-white p-2.5 rounded-lg flex-shrink-0 shadow-lg shadow-red-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white text-base md:text-lg font-bold">যা স্মার্ট হবে তোমার - ক্যারিয়ার</div>
                  <div className="text-gray-500 text-xs line-through mt-0.5">মূল্য ৫,০০০ ৳</div>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-3 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                <div className="bg-[#ff0000] text-white p-2.5 rounded-lg flex-shrink-0 shadow-lg shadow-red-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white text-base md:text-lg font-bold">সাপোর্ট পাবেন - লাইফটাইম</div>
                  <div className="text-gray-500 text-xs line-through mt-0.5">মূল্য ৩,০০০ ৳</div>
                </div>
              </div>
              
              {/* Item 4 */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-3 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                <div className="bg-[#ff0000] text-white p-2.5 rounded-lg flex-shrink-0 shadow-lg shadow-red-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white text-base md:text-lg font-bold">VIP কমিউনিটি এক্সেস - লাইফটাইম</div>
                  <div className="text-gray-500 text-xs line-through mt-0.5">মূল্য ২,০০০ ৳</div>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-full h-px bg-gray-800 my-6"></div>
            
            {/* Total Value */}
            <div className="text-center text-gray-500 line-through text-sm md:text-base mb-4 font-medium">
              সর্বমোট ভ্যালু ২৫,০০০ টাকা
            </div>
            
            {/* Price area */}
            <div className="flex justify-center items-center gap-4 md:gap-6 mb-6 bg-[#111] rounded-xl py-3 border border-gray-800">
              <div className="text-right flex flex-col items-end border-r border-gray-700 pr-4 md:pr-6">
                 <div className="text-gray-500 text-[10px] md:text-xs font-medium uppercase tracking-wider">রেগুলার প্রাইস</div>
                 <div className="text-gray-400 text-lg md:text-xl line-through font-bold">৩,০০০ ৳</div>
              </div>
              <div className="text-[#ffba00] text-4xl md:text-5xl font-black">
                ৯৯০<span className="text-xl md:text-2xl font-bold ml-1 text-white">৳</span>
              </div>
            </div>
            
            {/* Timer area */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-[#1a1a1a] border border-[#ff0000]/50 rounded-lg p-2 md:p-3 text-center w-[70px] shadow-inner">
                <div className="text-[#ffba00] font-black text-2xl">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-[10px] md:text-xs mt-0.5 font-medium">ঘণ্টা</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#ff0000]/50 rounded-lg p-2 md:p-3 text-center w-[70px] shadow-inner">
                <div className="text-[#ffba00] font-black text-2xl">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-[10px] md:text-xs mt-0.5 font-medium">মিনিট</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#ff0000]/50 rounded-lg p-2 md:p-3 text-center w-[70px] shadow-inner">
                <div className="text-[#ffba00] font-black text-2xl">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-[10px] md:text-xs mt-0.5 font-medium">সেকেন্ড</div>
              </div>
            </div>
            
            {/* Button */}
            <Link 
              prefetch={false} 
              href="/checkout" 
              className="block w-full bg-[#ff0000] hover:bg-[#d60000] text-white text-lg md:text-xl font-bold py-4 rounded-xl text-center shadow-btn-glow btn-shimmer animate-pulse-btn transition-all transform hover:-translate-y-0.5"
            >
              অফারটি নিতে চাই! - ৳৯৯০
            </Link>
          </div>
        </div>
      </section>

      {/* Course Curriculum Accordion Section */}
      <section id="courses" className="bg-white dark:bg-[#0B0F14]/40 border-t border-slate-200 dark:border-slate-850 py-20 px-3 sm:px-6 lg:px-12">
        <div className="max-w-[1360px] mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              কোর্স <span className="text-[#ff0000]">মডিউল</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-medium text-slate-600 dark:text-slate-300">
              একনজরে দেখে নিই এই কোর্সে কী কী থাকছে...
            </p>
            
            {/* Stats Badges matching Reference Image 1 */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">
                <Play className="w-4 h-4 fill-current text-red-500" /> ৩৩ টি ক্লাস
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">
                <Zap className="w-4 h-4 text-red-500" /> ৫:৩০+ ঘণ্টা ভিডিও
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">
                <Infinity className="w-4 h-4 text-red-500" /> লাইফটাইম অ্যাক্সেস
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-start text-left">
            {[
              {
                q: "চ্যাপ্টার ১: ভুল ধারণা ও মানসিক প্রস্তুতি",
                lessons: [
                  { title: "চলুন একসাথে ডুব দেই ইন্টিমেসির দুনিয়ায়!", unlocked: true },
                  { title: "প্রচলিত ভূল ধারনা, যেগুলো না জানলেই নয়!", unlocked: false },
                  { title: "ইন্টিমেসির জগতের সাথে প্রাথমিক পরিচয়।", unlocked: false },
                  { title: "কেনো সেক্স এতো গুরুত্বপূর্ন?", unlocked: false },
                  { title: "মাইন্ডসেট এবং নিজেদের মধ্যকার কমিউনিকেশন।", unlocked: false }
                ]
              },
              {
                q: "চ্যাপ্টার ২: নারীর মন, অনুভূতি ও শরীরের ভাষা",
                lessons: [
                  { title: "একজন নারীকে কীভাবে বুঝতে পারবেন?", unlocked: false },
                  { title: "নারী আসলে পুরুষদের থেকে কী চায়?", unlocked: false },
                  { title: "নারীরা কেনো সেক্স থেকে নিজেদের দূরে রাখতে চায়?", unlocked: false }
                ]
              },
              {
                q: "চ্যাপ্টার ৩: দ্য আর্ট অফ ফ্লার্টিং, সিডাকশন, ফোরপ্লে ও রোমান্স",
                lessons: [
                  { title: "চুমুর আর্টে আপনি আর্টিস্ট হোন!", unlocked: false },
                  { title: "পার্টনার এর সেক্সচুয়াল ইন্টারেস্ট গুলো বুঝুন!", unlocked: false },
                  { title: "ফ্লার্ট কী? কীভাবে ফ্লার্ট করবেন?", unlocked: false },
                  { title: "প্রেমের ভাষা শিখুন।", unlocked: false },
                  { title: "সিডাকশন বা মোহাচ্ছন্ন কী?", unlocked: false },
                  { title: "কীভাবে পার্টনারকে সিডিউস বা উত্তেজিত করবেন?", unlocked: false }
                ]
              },
              {
                q: "চ্যাপ্টার ৪: মিলনের পূর্বের প্রস্তুতি",
                lessons: [
                  { title: "সেক্সুয়াল কমিউনিকেশন!", unlocked: false },
                  { title: "পার্টনার কখন সেক্স এর জন্য রেডি থাকে বা থাকেনা সেটা কীভাবে বুঝবেন?", unlocked: false },
                  { title: "পার্টনার এর শরীর আপনার জন্য রেডি হওয়ার স্টেপ গুলো জানুন।", unlocked: false },
                  { title: "কীভাবে ভালোবাসার প্রতিটা স্টেপ পার করবেন?", unlocked: false },
                  { title: "পার্টনার উত্তেজিত করার বিভিন্ন পদ্ধতি!", unlocked: false }
                ]
              },
              {
                q: "চ্যাপ্টার ৫: থ্রাস্টিং ও '১০ সেকেন্ড অর্গাজম' টেকনিক",
                highlight: "'১০ সেকেন্ড অর্গাজম'",
                before: "চ্যাপ্টার ৫: থ্রাস্টিং ও ",
                after: " টেকনিক",
                lessons: [
                  { title: "নারীদের শরীরের সাথে পরিচিত হোন!", unlocked: false },
                  { title: "বিভিন্ন রকম অর্গাজম টেকনিক গুলো জানুন!", unlocked: false },
                  { title: "মাত্র ১০ সেকেন্ডে কীভাবে তার অর্গাজম করাবেন?", unlocked: false, highlighted: true },
                  { title: "ম্যাসাজ কীভাবে প্লেজার দিতে পারে?", unlocked: false },
                  { title: "সেক্স এর পজিশন সম্পর্কে জানুন।", unlocked: false },
                  { title: "থ্রাস্টিং টেকনিক্স কী? কিভাবে থ্রাস্টিং করবেন?", unlocked: false }
                ]
              },
              {
                q: "চ্যাপ্টার ৬: এক্সট্রিম ডার্টি ও ওরাল প্লেজার; সেক্স-পরবর্তী রোমান্স",
                lessons: [
                  { title: "সেক্স পরবর্তী সময়ের কেয়ার!", unlocked: false },
                  { title: "পার্টনার কে সেক্স-টয় এর মতো ফিল করাবেন না!", unlocked: false },
                  { title: "শুধু নিজের সুখ নিয়েই ভাববেন না!", unlocked: false },
                  { title: "নিয়মের বাইরে গিয়েও প্লেজার নিন!", unlocked: false },
                  { title: "ফান এবং ডার্টি এক্টিভিটিস!", unlocked: false },
                  { title: "ওরাল সেক্স টেকনিক্স।", unlocked: false },
                  { title: "বাবা মা হওয়ার পরের লাইফের সেক্স।", unlocked: false },
                  { title: "একটা সুন্দর সমাপ্তি!", unlocked: false }
                ]
              }
            ].map((item, idx) => {
              const isOpen = openAccordionIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "border-2 border-[#ff0000] dark:border-[#ff0000] bg-white dark:bg-slate-900 shadow-[0_0_20px_rgba(255,0,0,0.18)]" 
                      : "border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <button 
                    onClick={() => toggleAccordion(idx)}
                    className={`w-full p-6 md:p-7 flex items-center justify-between font-semibold text-lg md:text-xl lg:text-[21px] cursor-pointer focus:outline-none text-left leading-snug transition-all ${
                      isOpen ? "bg-[#ff0000] text-white" : "bg-transparent text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <span>
                      {item.highlight ? (
                        <>
                          {item.before}
                          <span className={isOpen ? "text-yellow-300 font-extrabold" : "text-[#ff0000] font-extrabold"}>
                            {item.highlight}
                          </span>
                          {item.after}
                        </>
                      ) : (
                        item.q
                      )}
                    </span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-white shrink-0 ml-3 transition-transform" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400 shrink-0 ml-3 transition-transform" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-6 md:p-7 border-t border-slate-200 dark:border-slate-800 text-base md:text-lg font-normal text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900">
                      {item.lessons ? (
                        <div className="flex flex-col gap-3">
                          {item.lessons.map((lesson, lIdx) => (
                            <div 
                              key={lIdx} 
                              className="flex items-center gap-3.5 py-1.5 text-slate-700 dark:text-slate-300 hover:text-[#ff0000] transition-colors duration-200 group cursor-pointer"
                            >
                              {lesson.unlocked ? (
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs border border-slate-200 dark:border-slate-700 group-hover:bg-red-500/10 group-hover:border-red-500/30 transition-all duration-200">
                                  <Play className="w-3 h-3 text-slate-600 dark:text-slate-400 fill-current ml-0.5 group-hover:text-[#ff0000] transition-colors duration-200" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#ff0000] group-hover:scale-110 transition-all duration-200" />
                                </div>
                              )}
                              <span className={`text-sm md:text-base font-medium leading-relaxed transition-colors duration-200 ${
                                'highlighted' in lesson && lesson.highlighted ? "text-[#ff0000] dark:text-red-400 font-semibold" : ""
                              }`}>
                                {lesson.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        'a' in item ? (item as { a: string }).a : null
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA below modules */}
          <div className="text-center pt-6">
            <Link prefetch={false} href="/checkout" className="inline-flex items-center justify-center rounded-xl bg-[#ff0000] hover:bg-[#d60000] py-4 px-12 font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-btn-glow btn-shimmer animate-pulse-btn text-lg md:text-xl">
              এখনই কোর্সটি অ্যাক্সেস নিন!
            </Link>
          </div>
        </div>
      </section>
      

      {/* FAQ Section: কোর্স সম্পর্কে তথ্য ও জিজ্ঞাসা */}
      <section id="faq" className="bg-slate-50/80 dark:bg-[#0B0F14]/10 border-t border-slate-200 dark:border-slate-850 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[850px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              কোর্স সম্পর্কে <span className="text-[#ff0000]">তথ্য ও জিজ্ঞাসা</span>
            </h2>
            <div className="w-16 h-1 bg-[#ff0000] mx-auto mt-3"></div>
          </div>

          <div className="space-y-4 text-left">
            {[
              {
                q: "পেমেন্ট করার পর আমি কোর্সের অ্যাক্সেস কীভাবে পাবো?",
                a: "পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই আপনার অ্যাকাউন্টে কোর্সটি সক্রিয় হয়ে যাবে। আপনি আপনার ড্যাশবোর্ড থেকে সরাসরি সব ক্লাস অ্যাক্সেস করতে পারবেন।",
                type: "key"
              },
              {
                q: "আমি কি কোর্সের ভিডিওগুলোর লাইফটাইম অ্যাক্সেস পাবো?",
                a: "হ্যাঁ, একবার কোর্সটি পারচেজ করলে আপনি ভিডিও, ইবুক এবং সকল রিসোর্সের লাইফটাইম অ্যাক্সেস পাবেন এবং যেকোনো সময়ে দেখতে পারবেন।",
                type: "infinity"
              },
              {
                q: "ক্লাসগুলো কি লাইভ হবে, নাকি প্রি-রেকর্ডেড ভিডিও?",
                a: "কোর্সের মূল সিলেবাসের ক্লাসগুলো হাই-কোয়ালিটি প্রি-রেকর্ডেড ভিডিও আকারে দেওয়া আছে, যাতে আপনি আপনার সুবিধাজনক সময়ে শিখতে পারেন। এছাড়া প্রতি মাসে বিশেষ কিউএ সেশন থাকবে।",
                type: "tv"
              },
              {
                q: "সম্পূর্ণ কোর্সটি কি বাংলা ভাষায় করানো হয়েছে?",
                a: "হ্যাঁ, সম্পূর্ণ কোর্সটি খুব সহজ এবং সাবলীল বাংলা ভাষায় প্রফেশনালভাবে রেকর্ডিং ও উপস্থাপন করা হয়েছে।",
                type: "languages"
              },
              {
                q: "ইবুকগুলো কীভাবে পাবো?",
                a: "কোর্সের ভেতরে প্রতিটি চ্যাপ্টারের সাথে সংশ্লিষ্ট ইবুক এবং প্র্যাকটিস ফাইলগুলোর ডাউনলোড লিংক দেওয়া থাকবে। আপনি সরাসরি সেখান থেকে ডাউনলোড করে নিতে পারবেন।",
                type: "book"
              }
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "border-2 border-black dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.1)]" 
                      : "border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-350 dark:hover:border-slate-700"
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(prev => prev === idx ? null : idx)}
                    className={`w-full p-4 flex items-center justify-between font-semibold text-base md:text-lg lg:text-[19px] cursor-pointer focus:outline-none text-left leading-snug transition-all ${
                      isOpen ? "bg-black text-white" : "bg-transparent text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      {/* Render topic-specific icon */}
                      {(() => {
                        const iconBase = `w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs border transition-colors ${
                          isOpen 
                            ? "bg-white/20 border-white/30 text-white" 
                            : "bg-red-500/10 border-red-500/20 text-[#ff0000]"
                        }`;
                        if (item.type === "key") {
                          return <div className={iconBase}><Key className="w-4 h-4" /></div>;
                        }
                        if (item.type === "infinity") {
                          return <div className={iconBase}><Infinity className="w-4 h-4" /></div>;
                        }
                        if (item.type === "tv") {
                          return <div className={iconBase}><Tv className="w-4 h-4" /></div>;
                        }
                        if (item.type === "languages") {
                          return <div className={iconBase}><Languages className="w-4 h-4" /></div>;
                        }
                        if (item.type === "book") {
                          return <div className={iconBase}><BookOpen className="w-4 h-4" /></div>;
                        }
                        return null;
                      })()}
                      <span>{item.q}</span>
                    </div>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-white shrink-0 ml-3 transition-transform" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400 shrink-0 ml-3 transition-transform" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-6 md:p-7 border-t border-slate-200 dark:border-slate-800 text-base font-normal text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Buttons below the accordion */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="https://wa.me/8801700000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-8 py-3.5 font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-green-500/20 text-base md:text-lg cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-white" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              <span>যোগাযোগ করুন</span>
            </a>
            <Link 
              prefetch={false} 
              href="/checkout" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#ff0000] hover:bg-[#d60000] px-10 py-3.5 font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-btn-glow btn-shimmer animate-pulse-btn text-base md:text-lg"
            >
              এখনই জয়েন করতে চাই!
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer id="contact" className="bg-[#04080F] border-t border-slate-900/80 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* DESKTOP FOOTER LAYOUT (Visible on md and up) */}
          <div className="hidden md:grid grid-cols-12 gap-8 items-start pb-8">
            {/* Branding Column */}
            <div className="col-span-5 space-y-4 text-left">
              <Logo />
              <p className="text-[14px] text-slate-400 leading-relaxed font-semibold max-w-sm">
                LoveLearn হলো একটি অনলাইন লার্নিং প্ল্যাটফর্ম, যেখানে আপনি শিখবেন, জানবেন এবং নিজেকে সামর্থ্য ভিতবেন নতুন দিশায়।
              </p>
              {/* Desktop Socials */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                  <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                  <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                  <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                  <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Courses Column */}
            <div className="col-span-3 space-y-4 text-left">
              <div className="relative">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">কোর্স সমূহ</h4>
                <div className="w-8 h-0.5 bg-[#ff0000] mt-1.5"></div>
              </div>
              <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-400">
                <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-slate-500 font-bold">&gt;</span> ডিজিটাল কন্টেন্ট ক্রিয়েশন
                </Link>
                <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-slate-500 font-bold">&gt;</span> ফ্রিল্যান্সিং
                </Link>
                <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-slate-500 font-bold">&gt;</span> ওয়েব ডেভেলপমেন্ট
                </Link>
                <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-slate-500 font-bold">&gt;</span> ডিজিটাল মার্কেটিং
                </Link>
                <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-slate-500 font-bold">&gt;</span> গ্রাফিক ডিজাইন
                </Link>
              </div>
            </div>

            {/* Contact Column */}
            <div className="col-span-4 space-y-4 text-left">
              <div className="relative">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">যোগাযোগ করুন</h4>
                <div className="w-8 h-0.5 bg-[#ff0000] mt-1.5"></div>
              </div>
              <div className="flex flex-col space-y-3.5 text-sm font-semibold text-slate-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>01200-000000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>support@lovelearn.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Map className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>


          {/* MOBILE FOOTER LAYOUT (Visible on mobile screens) */}
          <div className="md:hidden flex flex-col items-center text-center space-y-6 pb-6">
            {/* Logo, text & Socials */}
            <Logo />
            <p className="text-[13px] text-slate-400 leading-relaxed font-semibold max-w-sm px-2">
              LoveLearn হলো একটি অনলাইন লার্নিং প্ল্যাটফর্ম, যেখানে আপনি শিখবেন, জানবেন এবং নিজেকে সামর্থ্য ভিতবেন নতুন দিশায়।
            </p>
            {/* Mobile Socials */}
            <div className="flex items-center gap-3.5 justify-center">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                <svg className="w-4.5 h-4.5 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                <svg className="w-4.5 h-4.5 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                <svg className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                <svg className="w-4.5 h-4.5 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300 group">
                <svg className="w-4.5 h-4.5 fill-current text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-slate-900" />

            {/* Courses section with pipe separator */}
            <div className="space-y-3.5 w-full">
              <div className="flex flex-col items-center">
                <h4 className="text-base font-bold text-white uppercase tracking-wider">কোর্স সমূহ</h4>
                <div className="w-6 h-0.5 bg-[#ff0000] mt-1.5"></div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs font-semibold text-slate-400 px-4 leading-loose">
                <Link href="#" className="flex items-center gap-0.5 hover:text-white transition-colors">
                  <span className="text-slate-600 font-bold">&gt;</span> ডিজিটাল কন্টেন্ট ক্রিয়েশন
                </Link>
                <span className="text-slate-900 font-normal">|</span>
                <Link href="#" className="flex items-center gap-0.5 hover:text-white transition-colors">
                  <span className="text-slate-600 font-bold">&gt;</span> ফ্রিল্যান্সিং
                </Link>
                <span className="text-slate-900 font-normal">|</span>
                <Link href="#" className="flex items-center gap-0.5 hover:text-white transition-colors">
                  <span className="text-slate-600 font-bold">&gt;</span> ওয়েব ডেভেলপমেন্ট
                </Link>
                <span className="text-slate-900 font-normal">|</span>
                <Link href="#" className="flex items-center gap-0.5 hover:text-white transition-colors">
                  <span className="text-slate-600 font-bold">&gt;</span> ডিজিটাল মার্কেটিং
                </Link>
                <span className="text-slate-900 font-normal">|</span>
                <Link href="#" className="flex items-center gap-0.5 hover:text-white transition-colors">
                  <span className="text-slate-600 font-bold">&gt;</span> গ্রাফিক ডিজাইন
                </Link>
              </div>
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-slate-900" />

            {/* Contact section with pipe separator */}
            <div className="space-y-3.5 w-full">
              <div className="flex flex-col items-center">
                <h4 className="text-base font-bold text-white uppercase tracking-wider">যোগাযোগ করুন</h4>
                <div className="w-6 h-0.5 bg-[#ff0000] mt-1.5"></div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-400 px-4 leading-loose">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>01200-000000</span>
                </div>
                <span className="text-slate-900 font-normal">|</span>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>support@lovelearn.com</span>
                </div>
                <span className="text-slate-900 font-normal">|</span>
                <div className="flex items-center gap-1.5 text-center">
                  <Map className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>


          {/* BOTTOM BAR: Common to both views */}
          <div className="border-t border-slate-900/80 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-xs md:text-sm font-semibold text-slate-500 order-3 md:order-1">
              © 2025 <span className="text-[#ff0000]">LoveLearn</span>. All Rights Reserved.
            </div>

            {/* Security Check Badge */}
            <div className="order-2 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 border border-slate-900 text-xs md:text-sm font-semibold text-slate-400">
                <svg className="w-4.5 h-4.5 text-[#25D366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
                <span>100% নিরাপদ ও বিশ্বস্ত প্ল্যাটফর্ম</span>
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 order-1 md:order-3">
              {/* bKash */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center h-9 w-[70px]">
                <img src="/images/mobile-banking/bkash-flat.svg" alt="bKash" className="h-5 w-auto object-contain" />
              </div>
              {/* Nagad */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center h-9 w-[70px]">
                <img src="/images/mobile-banking/nagad-flat.svg" alt="Nagad" className="h-5 w-auto object-contain" />
              </div>
              {/* Rocket */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center h-9 w-[70px]">
                <img src="/images/mobile-banking/rocket-flat.svg" alt="Rocket" className="h-5 w-auto object-contain" />
              </div>
              {/* Upay */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center h-9 w-[70px]">
                <img src="/images/mobile-banking/upay-flat.svg" alt="Upay" className="h-5 w-auto object-contain" />
              </div>
              {/* Bank Icon Card */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 flex flex-col items-center justify-center h-9 w-[70px] gap-0.5">
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3L2 10h20L12 3z" />
                </svg>
                <span className="text-slate-500 font-bold text-[6.5px] uppercase tracking-wider">Bank</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp helper button */}
      <a 
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "").startsWith("01") ? `88${whatsappNumber.replace(/[^0-9]/g, "")}` : whatsappNumber.replace(/[^0-9]/g, "")}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all z-50 flex items-center justify-center cursor-pointer"
        aria-label="Contact support on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

    </div>
  );
}
