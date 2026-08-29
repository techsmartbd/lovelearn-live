"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";
import LandingClient from "@/components/landing-client";
import { 
  Lock, 
  ChevronLeft, 
  Check, 
  HelpCircle, 
  Copy, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  X,
  Smartphone,
  Eye,
  EyeOff,
  User
} from "lucide-react";

// Inline brand logo components for high fidelity
const BkashLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
    <path d="M12.4 12c-2.4 0-4.4 2-4.4 4.4v13.9c0 .7-.6 1.3-1.3 1.3H1.3c-.7 0-1.3-.6-1.3-1.3V1.3C0 .6.6 0 1.3 0h5.4c.7 0 1.3.6 1.3 1.3v9c.9-1.2 2.3-2.1 4.4-2.1 4.5 0 8 3.5 8 8.1v13.9c0 .7-.6 1.3-1.3 1.3H13.7c-.7 0-1.3-.6-1.3-1.3V17.7c0-2.4-2-5.7-5.7-5.7zM24 15.3c0-4.6 3.5-8.1 8-8.1s8 3.5 8 8.1v15c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3V15.7c0-2-1.6-3.6-3.6-3.6s-3.6 1.6-3.6 3.6V30.3c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3V15.3zm21.4 15c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3V1.3c0-.7.6-1.3 1.3-1.3h5.4c.7 0 1.3.6 1.3 1.3v29zm23.6-.8c-1.3 1.3-3.1 2.1-5.1 2.1-4 0-7.2-3.2-7.2-7.2s3.2-7.2 7.2-7.2c2.1 0 3.9.8 5.1 2.1V29.5zm-5.1-16.7c-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2c2.1 0 3.9-.8 5.1-2.1V14.9c-1.2-1.3-3-2.1-5.1-2.1zm12.3-1.4c0-.7.6-1.3 1.3-1.3h17.9c.7 0 1.3.6 1.3 1.3v3.9c0 .7-.6 1.3-1.3 1.3h-17.9c-.7 0-1.3-.6-1.3-1.3v-3.9zm13 8.3c0-2 1.6-3.6 3.6-3.6s3.6 1.6 3.6 3.6c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6zm5 10c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3V16.7c0-2.4-2-5.7-5.7-5.7s-5.7 3.3-5.7 5.7v13.9c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3V1.3c0-.7.6-1.3 1.3-1.3h5.4c.7 0 1.3.6 1.3 1.3v9c.9-1.2 2.3-2.1 4.4-2.1 4.5 0 8 3.5 8 8.1v13.9z" />
  </svg>
);

const NagadLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
    <path d="M10 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm27.2-4.8v13c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3v-13h8zm12.3 8.2c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.2 5 5zm5 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm17 4.8c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3v-1.5c-1 1.2-2.5 2-4.5 2-4 0-7.2-3.2-7.2-7.2s3.2-7.2 7.2-7.2c2 0 3.5.8 4.5 2v-4.8c0-.7.6-1.3 1.3-1.3h5.4c.7 0 1.3.6 1.3 1.3v17.4zm-12.5-4.8c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5zm28.7 4.8c0 .7-.6 1.3-1.3 1.3h-5.4c-.7 0-1.3-.6-1.3-1.3v-1.5c-1 1.2-2.5 2-4.5 2-4 0-7.2-3.2-7.2-7.2s3.2-7.2 7.2-7.2c2 0 3.5.8 4.5 2V1.3c0-.7.6-1.3 1.3-1.3h5.4c.7 0 1.3.6 1.3 1.3v28.2zm-12.5-4.8c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5z" />
  </svg>
);

const RocketLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
    <polygon points="15,5 30,25 22,25 22,35 8,35 8,25 0,25" />
    <text x="35" y="28" fontSize="24" fontWeight="bold">rocket</text>
  </svg>
);

const UpayLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
    <text x="10" y="28" fontSize="28" fontWeight="black" style={{ fontStyle: "italic" }}>upay</text>
  </svg>
);

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  discountPct: number;
}

export default function CheckoutPage() {
  const { language } = useLanguage();

  // Stepper State (1 to 5)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 states
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "upay">("nagad");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0); // 0 or calculated discount amount
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  // Step 3 states
  const [amount, setAmount] = useState<number>(990);
  const [reminderExpanded, setReminderExpanded] = useState(true);

  // Step 4 states
  const [trxId, setTrxId] = useState("");
  const [countdownTen, setCountdownTen] = useState(600); // 10 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "timeout">("idle");
  const [redirectCountdown, setRedirectCountdown] = useState(10); // 10 seconds redirect timer
  const [orderId, setOrderId] = useState("");

  // Promotion Drawer Modal State
  const [promoDrawerOpen, setPromoDrawerOpen] = useState(false);
  const [promoTab, setPromoTab] = useState<"valid" | "invalid">("valid");

  // Read URL params on mount + restore from localStorage (refresh persistence)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const skip = params.get("skipStep1");
      const phoneParam = params.get("phone");
      const priceParam = params.get("price");
      try {
        const saved = localStorage.getItem("lovelearn_checkout_state");
        if (saved) {
          const s = JSON.parse(saved);
          if (s.step && s.step >= 1 && s.step <= 4) setStep(s.step);
          if (s.name) setName(s.name);
          if (s.phone) setPhone(s.phone);
          if (s.password) setPassword(s.password);
          if (s.paymentMethod) setPaymentMethod(s.paymentMethod);
          if (s.promoCode) setPromoCode(s.promoCode);
          if (s.selectedPromo) setSelectedPromo(s.selectedPromo);
          if (s.amount) setAmount(s.amount);
          if (s.trxId) setTrxId(s.trxId);
          if (s.orderId) setOrderId(s.orderId);
          if (s.paymentStatus) setPaymentStatus(s.paymentStatus);
        }
      } catch (e) {}
      if (skip === "true") {
        setStep(2);
        setPassword("dashboard_unlock");
      }
      if (phoneParam) {
        setPhone(phoneParam);
      }
      if (priceParam) {
        setAmount(Number(priceParam));
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const state = { step, name, phone, password, paymentMethod, promoCode, selectedPromo, amount, trxId, orderId, paymentStatus };
      localStorage.setItem("lovelearn_checkout_state", JSON.stringify(state));
    } catch (e) {}
  }, [step, name, phone, password, paymentMethod, promoCode, selectedPromo, amount, trxId, orderId, paymentStatus]);
  useEffect(() => {
    if (paymentStatus === "success" || paymentStatus === "timeout") {
      const t = setTimeout(() => { try { localStorage.removeItem("lovelearn_checkout_state"); } catch (e) {} }, 15000);
      return () => clearTimeout(t);
    }
  }, [paymentStatus]);

  // Gateway Numbers dynamically loaded
  const [gatewayNumbers, setGatewayNumbers] = useState({
    bkash: "01700000000",
    nagad: "01800000000",
    rocket: "01900000000",
    upay: "01500000000"
  });

  const [gatewayTypes, setGatewayTypes] = useState<{ [key: string]: string }>({
    bkash: "PERSONAL",
    nagad: "PERSONAL",
    rocket: "PERSONAL",
    upay: "PERSONAL"
  });

  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: "normal", title: "Normal", subtitle: "Normal Deposit", discountPct: 0 }
  ]);

  // Load gateway numbers & dynamic promotions
  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setGatewayNumbers({
          bkash: data.BKASH_NUMBER || "01700000000",
          nagad: data.NAGAD_NUMBER || "01800000000",
          rocket: data.ROCKET_NUMBER || "01900000000",
          upay: data.UPAY_NUMBER || "01500000000"
        });
        setGatewayTypes({
          bkash: data.BKASH_TYPE || "PERSONAL",
          nagad: data.NAGAD_TYPE || "PERSONAL",
          rocket: data.ROCKET_TYPE || "PERSONAL",
          upay: data.UPAY_TYPE || "PERSONAL"
        });
      })
      .catch(() => console.log("Failed to load backend gateway numbers."));

    fetch("/api/promotions")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.offers && data.offers.length > 0) {
          setPromotions(data.offers);
        }
      })
      .catch(err => console.log("Failed to load dynamic promotions:", err));
  }, []);

  // Timer simulation for Step 4 (10 minutes)
  useEffect(() => {
    if (step !== 4 || paymentStatus !== "idle") return;
    const interval = setInterval(() => {
      setCountdownTen(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStatus("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, paymentStatus]);

  // Redirect Timer for Success or Timeout
  useEffect(() => {
    if (step !== 4 || (paymentStatus !== "success" && paymentStatus !== "timeout")) return;
    const interval = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, paymentStatus]);

  // Lock browser back button when verifying or success
  useEffect(() => {
    if (step !== 4 || paymentStatus === "idle" || paymentStatus === "timeout") return;
    
    // Push a dummy state to block the first back press
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (paymentStatus === "verifying") {
        alert("পেমেন্ট যাচাইকরণ চলছে, অনুগ্রহ করে অপেক্ষা করুন...");
        window.history.pushState(null, "", window.location.href);
      } else if (paymentStatus === "success") {
        // Just let them go back? No, keep locked until redirect
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step, paymentStatus]);

  // Trigger submission to server when paymentStatus becomes 'verifying'
  useEffect(() => {
    if (step !== 4 || paymentStatus !== "verifying") return;

    let pollInterval: NodeJS.Timeout;
    let localOrderId = "";

    const handleServerSubmit = async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || undefined,
            phone: phone.trim().replace(/[^0-9]/g, ""),
            password,
            trxId,
            amount,
            paymentMethod,
            promoCode: selectedPromo?.id || promoCode || ""
          })
        });
        const data = await res.json();
        if (data.success) {
          localOrderId = data.orderId;
          setOrderId(data.orderId);

          if (data.status === 'COMPLETED') {
            // Already completed (race-condition matched!)
            setPaymentStatus("success");
            setRedirectCountdown(10);
          } else {
            // Start polling order status
            pollInterval = setInterval(async () => {
              try {
                const statusRes = await fetch(`/api/checkout?orderId=${localOrderId}`);
                const statusData = await statusRes.json();
                if (statusData.status === 'COMPLETED') {
                  clearInterval(pollInterval);
                  setPaymentStatus("success");
                  setRedirectCountdown(10);
                }
              } catch (err) {
                console.error("Polling error:", err);
              }
            }, 2500);
          }
        } else {
          // Failure - Show error and return to idle
          setError(data.error || "ট্রানজেকশন ভেরিফিকেশন ব্যর্থ হয়েছে।");
          setPaymentStatus("idle");
        }
      } catch (err) {
        setError("নেটওয়ার্ক এরর! অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিয়ে আবার চেষ্টা করুন।");
        setPaymentStatus("idle");
      }
    };

    handleServerSubmit();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [step, paymentStatus]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Click Copy Helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("নম্বর কপি করা হয়েছে: " + text);
  };

  // Promotion handlers
  const handleSelectPromo = (promo: Promotion) => {
    setSelectedPromo(promo);
    setPromoDrawerOpen(false);
    // Recalculate amount if discount applies
    const basePrice = 990;
    const discount = (basePrice * promo.discountPct) / 100;
    setAmount(basePrice - discount);
  };

  // Manual Promo Code Handler (Dynamic API)
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      alert(language === "bn" ? "প্রমো কোড লিখুন!" : "Please enter a promo code!");
      return;
    }
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, baseAmount: 990 })
      });
      const data = await res.json();
      if (data.success) {
        setIsPromoApplied(true);
        setPromoDiscount(data.discountAmount);
        setAmount(data.finalAmount);
        alert(data.message);
      } else {
        alert(data.error || "ভুল প্রমো কোড!");
      }
    } catch (err) {
      console.error("Promo code apply error:", err);
      alert("প্রমো কোড প্রয়োগের সময় ত্রুটি ঘটেছে, আবার চেষ্টা করুন।");
    }
  };

  // Step Validations
  const validateStep1 = () => {
    const cleanedPhone = phone.trim().replace(/[^0-9]/g, "");

    // 1. Mobile number 11 digits check
    if (!cleanedPhone || cleanedPhone.length !== 11) {
      alert(language === "bn" ? "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে! (যেমন: 01712345678)" : "Please enter a valid 11-digit mobile number!");
      return;
    }

    // 2. Valid Bangladesh Mobile Operator Prefix check
    const prefix = cleanedPhone.substring(0, 3);
    const validPrefixes = ["013", "014", "015", "016", "017", "018", "019"];
    if (!validPrefixes.includes(prefix)) {
      alert(language === "bn" ? "সঠিক মোবাইল অপারেটর নম্বর দিন! (যেমন: 017, 018, 019, 013, 014, 015, 016)" : "Invalid mobile operator prefix! Must start with 013, 014, 015, 016, 017, 018, or 019.");
      return;
    }

    // 3. Password length check
    if (!password || password.length < 6) {
      alert(language === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!" : "Password must be at least 6 characters!");
      return;
    }

    // 4. Password mix of letters and numbers check
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    // 5. Save visitor lead to DB in background
    fetch("/api/visitor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || undefined,
        phone: cleanedPhone,
        password: password
      })
    }).catch(err => console.error("Visitor lead tracking error:", err));

    setStep(2);
  };

  // Brand UI Theme Configurations
  const getBrandTheme = () => {
    switch (paymentMethod) {
      case "bkash":
        return {
          bgHeader: "bg-gradient-to-r from-pink-500 via-white to-pink-500 dark:via-slate-900",
          logoFlat: "/images/mobile-banking/bkash-flat.svg",
          logoRound: "/images/mobile-banking/bkash-round.svg",
          logo: <BkashLogo />,
          name: "bKash"
        };
      case "rocket":
        return {
          bgHeader: "bg-gradient-to-r from-purple-600 via-white to-purple-600 dark:via-slate-900",
          logoFlat: "/images/mobile-banking/rocket-flat.svg",
          logoRound: "/images/mobile-banking/rocket-round.svg",
          logo: <RocketLogo />,
          name: "Rocket"
        };
      case "upay":
        return {
          bgHeader: "bg-gradient-to-r from-gray-500 via-white to-gray-500 dark:via-slate-900",
          logoFlat: "/images/mobile-banking/upay-flat.svg",
          logoRound: "/images/mobile-banking/upay-round.svg",
          logo: <UpayLogo />,
          name: "Upay"
        };
      case "nagad":
      default:
        return {
          bgHeader: "bg-gradient-to-r from-orange-500 via-white to-red-500 dark:via-slate-900",
          logoFlat: "/images/mobile-banking/nagad-flat.svg",
          logoRound: "/images/mobile-banking/nagad-round.svg",
          logo: <NagadLogo />,
          name: "Nagad"
        };
    }
  };

  const brand = getBrandTheme();

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F172A] selection:bg-[#ff0000]/20">
      
      {/* Background Landing Page (Desktop Only) */}
      <div className="fixed inset-0 z-0 hidden md:block overflow-hidden pointer-events-none">
        <LandingClient />
      </div>

      {/* Modal Overlay and Container */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-0 md:p-4 bg-slate-900/60 dark:bg-slate-950/70 md:backdrop-blur-md transition-all overflow-hidden overscroll-none">
        
        {/* Container simulating a sleek mobile layout box */}
        <div className="w-full md:w-[420px] bg-white dark:bg-[#1E293B] md:rounded-3xl overflow-hidden md:shadow-2xl md:border border-slate-200 dark:border-slate-700/60 relative h-[100dvh] md:h-[760px] flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
        
        {/* Dynamic Theme Header for Steps 2, 3 */}
        {(step === 2 || step === 3) && (
          <div className={`${brand.bgHeader} py-4 px-4 flex items-center justify-between text-white transition-all shadow-md`}>
            <button 
              onClick={() => {
                setError("");
                const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
                const skipStep1 = searchParams?.get("skipStep1") === "true";
                if (step === 2 && skipStep1) {
                  const pkgId = searchParams?.get("packageId") || "";
                  const price = searchParams?.get("price") || "";
                  const title = searchParams?.get("title") || "";
                  window.location.href = `/dashboard?action=unlock&packageId=${pkgId}&price=${price}&title=${encodeURIComponent(title)}`;
                } else {
                  setStep(prev => prev - 1);
                }
              }} 
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center gap-2 flex-1">
              <img 
                src={brand.logoFlat} 
                alt={brand.name} 
                className={`${paymentMethod === 'bkash' || paymentMethod === 'rocket' ? 'h-11' : 'h-8'} w-auto object-contain`} 
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 h-8 flex items-center justify-center text-xs font-bold bg-white/20 rounded-full">
                {step}/4
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Registration (nameless) */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            {/* Header for Step 1 */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
              <button 
                onClick={() => window.location.href = '/'} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="text-center pt-2 md:pt-0">
                <div className="w-16 h-16 bg-[#ff0000]/10 border border-[#ff0000]/20 dark:border-[#ff0000]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm shadow-red-500/10">
                  <Lock className="w-8 h-8 text-[#ff0000]" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === "bn" ? "অর্ডারের প্রথম ধাপ" : "First step of the order"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === "bn" ? "পেমেন্ট শুরু করার আগে মোবাইল নম্বর ও পাসওয়ার্ড সেট করুন" : "Set mobile number & password before payment"}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/35 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Optional Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    {language === "bn" ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === "bn" ? "আপনার নাম লিখুন" : "Enter your name"}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/15 text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    {language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"} *
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/15 text-slate-900 dark:text-white font-extrabold text-sm transition-all"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    {language === "bn" ? "পাসওয়ার্ড সেট করুন" : "Set Password"} *
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === "bn" ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/15 text-slate-900 dark:text-white font-bold text-sm transition-all"
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {language === "bn" ? "পাসওয়ার্ডে অবশ্যই লেটার (a-z) এবং নাম্বার (0-9) থাকতে হবে।" : "Password must contain letters and numbers."}
                  </p>
                </div>
                
                {/* Note for credentials */}
                <div className="pt-2 text-center text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {language === "bn" ? "প্রিয় গ্রাহক," : "Dear Customer,"}
                  </span>{" "}
                  {language === "bn" 
                    ? "অনুগ্রহ করে আপনার মোবাইল নম্বর ও পাসওয়ার্ডটি খুব গুরুত্বসহকারে মনে রাখুন। ভবিষ্যতে আপনার অ্যাকাউন্টে লগইন করার জন্য এই ক্রেডেনশিয়ালটি প্রয়োজন হবে।"
                    : "please remember this mobile number and password carefully. They are your login credentials and will be needed to access your account in the future."}
                </div>
              </div>
            </div>

              <div className="sticky bottom-0 bg-white dark:bg-[#1E293B] pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] -mx-6 px-6 mb-0 mt-6 border-t border-slate-100 dark:border-slate-800 md:static md:bg-transparent md:border-0 md:pt-0 md:pb-0 md:px-0 md:mx-0 md:mb-0 md:mt-8">
                <button 
                  onClick={validateStep1}
                  className="w-full py-4 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-btn-glow btn-shimmer cursor-pointer text-sm"
                >
                  {language === "bn" ? "কন্টিনিউ করুন" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: E-Wallet and Promo Selection */}
        {step === 2 && (
          <div className="flex-1 p-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-900">
            <div className="space-y-6">
              {/* Select Promotion */}
              <div className="relative">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                  {language === "bn" ? "প্রমোশন নির্বাচন করুন" : "Select Promotion"}
                </h3>
                <button 
                  onClick={() => setPromoDrawerOpen(!promoDrawerOpen)}
                  className="w-full p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {selectedPromo ? selectedPromo.title : "Normal"}
                    </span>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    {selectedPromo && selectedPromo.discountPct > 0 && (
                      <span className="text-xs font-bold mr-1 text-red-600">-{selectedPromo.discountPct}%</span>
                    )}
                    <ChevronRight className={`w-5 h-5 transition-transform ${promoDrawerOpen ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Inline Promo Dropdown */}
                {promoDrawerOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-slide-up">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {language === "bn" ? "প্রমোশন নির্বাচন করুন" : "Select promotion"}
                      </h3>
                      <button 
                        onClick={() => setPromoDrawerOpen(false)}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-[250px] overflow-y-auto p-2 space-y-1">
                      {promotions.map((promo) => (
                        <button 
                          key={promo.id}
                          onClick={() => {
                            handleSelectPromo(promo);
                            setPromoDrawerOpen(false);
                          }}
                          className={`w-full p-3 bg-slate-50 dark:bg-slate-900 border text-left rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                            selectedPromo?.id === promo.id ? "border-red-500 ring-1 ring-red-500/20" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{promo.title}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{promo.subtitle}</p>
                          </div>
                          {promo.discountPct > 0 ? (
                            <span className="bg-red-500/10 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                              -{promo.discountPct}% OFF
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">No discount</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Select Payment cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                  {language === "bn" ? "পেমেন্ট মেথড নির্বাচন করুন" : "Select Payment"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-[100px] cursor-pointer shadow-sm relative ${
                      paymentMethod === "nagad" 
                        ? "border-orange-500 bg-[#fef1e5] dark:bg-orange-500/10" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-center items-center h-full mb-1">
                      <img src="/images/mobile-banking/nagad-flat.svg" alt="nagad" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex justify-center w-full mt-auto relative">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold text-center w-full border-t border-slate-100 dark:border-slate-700/50 pt-1">
                        {gatewayTypes.nagad === 'AGENT' ? 'Agent Wallet' : gatewayTypes.nagad === 'PAYMENT' ? 'Payment Wallet' : 'Personal Wallet'}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-[100px] cursor-pointer shadow-sm relative ${
                      paymentMethod === "bkash" 
                        ? "border-pink-500 bg-[#fce5ee] dark:bg-pink-500/10" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-center items-center h-full mb-1">
                      <img src="/images/mobile-banking/bkash-flat.svg" alt="bkash" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex justify-center w-full mt-auto relative">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold text-center w-full border-t border-slate-100 dark:border-slate-700/50 pt-1">
                        {gatewayTypes.bkash === 'AGENT' ? 'Agent Wallet' : gatewayTypes.bkash === 'PAYMENT' ? 'Payment Wallet' : 'Personal Wallet'}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("rocket")}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-[100px] cursor-pointer shadow-sm relative ${
                      paymentMethod === "rocket" 
                        ? "border-purple-500 bg-[#f4e5fa] dark:bg-purple-500/10" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-center items-center h-full mb-1">
                      <img src="/images/mobile-banking/rocket-flat.svg" alt="rocket" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex justify-center w-full mt-auto relative">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold text-center w-full border-t border-slate-100 dark:border-slate-700/50 pt-1">
                        {gatewayTypes.rocket === 'AGENT' ? 'Agent Wallet' : gatewayTypes.rocket === 'PAYMENT' ? 'Payment Wallet' : 'Personal Wallet'}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("upay")}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-[100px] cursor-pointer shadow-sm relative ${
                      paymentMethod === "upay" 
                        ? "border-blue-500 bg-[#e5effa] dark:bg-blue-500/10" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-center items-center h-full mb-1">
                      <img src="/images/mobile-banking/upay-flat.svg" alt="upay" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex justify-center w-full mt-auto relative">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold text-center w-full border-t border-slate-100 dark:border-slate-700/50 pt-1">
                        {gatewayTypes.upay === 'AGENT' ? 'Agent Wallet' : gatewayTypes.upay === 'PAYMENT' ? 'Payment Wallet' : 'Personal Wallet'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Select Channel */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === "bn" ? "চ্যানেল নির্বাচন করুন" : "Select channel"}
                </h3>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-sm text-slate-800 dark:text-white shadow-sm">
                  <span>
                    {brand.name} {gatewayTypes[paymentMethod] === 'AGENT' ? 'Agent - Cash Out' : gatewayTypes[paymentMethod] === 'PAYMENT' ? 'Payment - Make Payment' : 'Personal - Send Money'}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white"><Check className="w-3 h-3 stroke-[3]" /></div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === "bn" ? "প্রমো কোড" : "Promo Code"}
                </h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={language === "bn" ? "ডিসকাউন্ট কোড লিখুন" : "enter your code..."}
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-400 text-sm font-bold text-slate-800 dark:text-white transition-all shadow-sm"
                  />
                  <button 
                    onClick={handleApplyPromoCode}
                    className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    {language === "bn" ? "প্রয়োগ করুন" : "Apply"}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] -mx-6 px-6 mb-0 mt-6 border-t border-slate-100 dark:border-slate-800 md:static md:bg-transparent md:border-0 md:pt-0 md:pb-0 md:px-0 md:mx-0 md:mb-0 md:mt-8">
              <button 
                onClick={() => setStep(3)}
                className="w-full py-4 bg-red-700 hover:bg-red-800 text-white font-extrabold rounded-xl transition-all shadow-md btn-shimmer cursor-pointer text-sm"
              >
                {language === "bn" ? "কন্টিনিউ করুন" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Enter the Amount */}
        {step === 3 && (
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5">Course price (BDT)</h3>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-extrabold text-lg">
                    BDT
                  </div>
                  <input 
                    type="number" 
                    value={amount}
                    readOnly
                    className="w-full pl-16 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-right text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-transparent opacity-80 cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Selected Payment Gateway details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                <div className="flex items-center justify-center gap-3">
                  <img src={brand.logoFlat} alt={brand.name} className="h-8 w-auto object-contain" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">via {brand.name} Wallet</span>
                </div>
                {selectedPromo && selectedPromo.discountPct > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className={`${brand.bgHeader} text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>
                      -{selectedPromo.discountPct}% PROMO
                    </span>
                  </div>
                )}
              </div>

              {/* Collapsible Reminder / Guidelines */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setReminderExpanded(!reminderExpanded)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-[#ff0000]" /> {language === "bn" ? "পেমেন্ট নির্দেশিকা" : "Payment Guidelines"}</span>
                  {reminderExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                
                {reminderExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
                    {language === "bn" ? (
                      <>
                        <p>১. পেমেন্ট পেজে দেয়া পার্সোনাল নম্বরে সঠিক পরিমাণ টাকা <strong>সেন্ড মানি</strong> করুন।</p>
                        <p>২. টাকা পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডিটি কপি করে পরবর্তী বক্সে পেস্ট করতে হবে।</p>
                        <p>৩. যেকোনো কাস্টম প্রমোশন অ্যাড করতে সঠিক প্রমো কোড প্রয়োগ করুন।</p>
                      </>
                    ) : (
                      <>
                        <p>1. <strong>Send Money</strong> to the personal number provided on the payment page.</p>
                        <p>2. Copy the Transaction ID and paste it in the next step.</p>
                        <p>3. Apply a valid promo code for custom discounts.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1E293B] pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] -mx-6 px-6 mb-0 mt-6 border-t border-slate-100 dark:border-slate-800 md:static md:bg-transparent md:border-0 md:pt-0 md:pb-0 md:px-0 md:mx-0 md:mb-0 md:mt-8">
              <button 
                onClick={() => setStep(4)}
                className="w-full py-4 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-btn-glow btn-shimmer cursor-pointer text-sm"
              >
                {language === "bn" ? "কন্টিনিউ করুন" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Brand Specific App UI & TrxID Submission */}
        {step === 4 && (
          <div className="flex-1 p-0 flex flex-col justify-between bg-white text-slate-900">
            <div className="flex-1 flex flex-col">
              
              {/* App UI Simulated Header Banner */}
              <div className={`${brand.bgHeader} text-white py-8 px-6 flex flex-col items-center justify-center relative shadow-md`}>
                <button 
                  onClick={() => {
                    if (paymentStatus === "idle") setStep(3);
                  }} 
                  className="absolute top-4 left-4 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  style={{ display: paymentStatus === "idle" ? "block" : "none" }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="absolute top-4 right-4 px-3 h-8 flex items-center justify-center text-xs font-bold bg-white/20 rounded-full">
                  {step}/4
                </div>

                <div className="w-24 h-24 rounded-full relative flex items-center justify-center shadow-2xl mt-2 mb-4">
                  <div className="absolute -inset-1 rounded-full animate-[spin_3s_linear_infinite]" style={{ background: 'conic-gradient(#ff0000, #ff8c00, #ffd700, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)' }}></div>
                  <div className="absolute inset-0 rounded-full bg-white"></div>
                  <img src={brand.logoRound} alt={brand.name} className="w-20 h-20 object-contain relative z-10 rounded-full" />
                </div>
                
                <div className="bg-black/10 px-4 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border border-black/10 text-slate-700">
                  {paymentStatus === "idle" && (
                    <>
                      <span className="text-slate-600">{language === "bn" ? "সময় বাকি :" : "Time remaining :"}</span> 
                      <span>{formatTime(countdownTen)}</span>
                      <Clock className="w-3.5 h-3.5 ml-1" /> 
                    </>
                  )}
                  {paymentStatus === "verifying" && (
                    <>
                      <span className="text-slate-600">{language === "bn" ? "ভেরিফাই করা হচ্ছে..." : "Verifying..."}</span> 
                      <Clock className="w-3.5 h-3.5 ml-1 animate-pulse" /> 
                    </>
                  )}
                  {(paymentStatus === "success" || paymentStatus === "timeout") && (
                    <>
                      <span className="text-slate-600">{language === "bn" ? "রিডাইরেক্ট করা হচ্ছে :" : "Redirecting :"}</span> 
                      <span>{formatTime(redirectCountdown)}</span>
                      <Clock className="w-3.5 h-3.5 ml-1" /> 
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Content based on Status */}
              <div className="p-5 space-y-5 flex-1 flex flex-col justify-center">
                {paymentStatus === "verifying" && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-bold animate-pulse">
                      {language === "bn" ? "আপনার পেমেন্ট ভেরিফাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." : "Verifying your payment, please wait..."}
                    </p>
                  </div>
                )}

                {paymentStatus === "timeout" && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{language === "bn" ? "সময় শেষ!" : "Time Expired!"}</h3>
                    <p className="text-slate-500 font-bold text-sm">
                      {language === "bn" ? "দুঃখিত, আপনার পেমেন্ট করার সময় সীমা শেষ হয়ে গিয়েছে। অনুগ্রহ করে নতুন করে আবার ট্রাই করুন।" : "Sorry, your time has expired. Please try again."}
                    </p>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{language === "bn" ? "পেমেন্ট সফল!" : "Payment Successful!"}</h3>
                    <p className="text-slate-500 font-bold text-sm">
                      {language === "bn" ? "আপনার পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে। অনুগ্রহ করে হোম পেজে ফিরে যান।" : "Your payment has been successfully processed. Please return to the home page."}
                    </p>
                  </div>
                )}

                {paymentStatus === "idle" && (
                  <>
                    {/* Limit display */}
                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-3">
                      <span className="text-slate-500">পরিমাণ সীমা:</span>
                      <span className="text-slate-850">Min 200.00 - Max 25,000.00</span>
                    </div>

                    {/* Amount to pay */}
                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-3">
                      <span className="text-slate-500">পরিশোধের পরিমাণ:</span>
                      <span className="text-base font-black text-red-600">{amount} BDT</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                      <div>
                        <span className="block text-[10px] text-slate-450 font-extrabold uppercase tracking-wide">
                          {gatewayTypes[paymentMethod] === 'AGENT' ? 'ক্যাশআউট নম্বর' : gatewayTypes[paymentMethod] === 'PAYMENT' ? 'পেমেন্ট নম্বর' : 'সেন্ডমানি নম্বর'}
                        </span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">
                          {gatewayNumbers[paymentMethod]}
                        </span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(gatewayNumbers[paymentMethod])}
                        className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>

                    {/* TrxID Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-600">
                        ট্রানজেকশন আইডি (Transaction ID)
                      </label>
                      <input 
                        type="text" 
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={language === "bn" ? "ট্রানজেকশন আইডি লিখুন" : "Enter Transaction ID"}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-[#ff0000] font-mono text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>

                    {/* Warnings / Guidelines */}
                    <div className="border-l-4 border-red-500 bg-red-50/50 p-3.5 rounded-r-xl text-xs text-red-600 font-semibold leading-relaxed space-y-1.5">
                      <p>⚠️ অনুগ্রহ করে নিশ্চিত করুন, যে নাম্বারটি উপরে দেয়া আছে সেই নম্বরেই আপনার ওয়ালেট থেকে সফলভাবে টাকা পাঠানো হয়েছে।</p>
                      <p>⚠️ ট্রানজেকশন আইডিটি অবশ্যই সঠিকভাবে দিতে হবে, অন্যথায় আপনার ডিপোজিটটি অ্যাক্টিভ হবে না।</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 sticky bottom-0 mb-0 md:static md:mb-0" style={{paddingBottom: "calc(1rem + env(safe-area-inset-bottom))"}}>
              {paymentStatus === "idle" && (
                <button 
                  onClick={() => {
                    if (!trxId) {
                      alert("ট্রানজেকশন আইডি দিন!");
                      return;
                    }
                    setPaymentStatus("verifying");
                  }}
                  className="w-full py-4 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl shadow-btn-glow btn-shimmer transition-all cursor-pointer text-sm"
                >
                  {language === "bn" ? "সাবমিট করুন" : "Submit"}
                </button>
              )}
              {(paymentStatus === "timeout" || paymentStatus === "success") && (
                <button 
                  onClick={() => window.location.href = "/"}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl transition-all cursor-pointer text-sm"
                >
                  {language === "bn" ? "হোম পেজে ফিরে যান" : "Return to Home Page"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

    </div>
  );
}
