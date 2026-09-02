"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";
import LandingClient from "@/components/landing-client";
import { 
  ChevronLeft, 
  Check, 
  Copy, 
  Clock, 
  X,
  Smartphone,
  User,
  CreditCard
} from "lucide-react";

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

export default function CheckoutPage() {
  const { language } = useLanguage();

  // Unified Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // View State: 'form' | 'verifying' | 'extended' | 'timeout' | 'success'
  const [viewState, setViewState] = useState<"form" | "verifying" | "extended" | "timeout" | "success">("form");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "upay">("bkash");
  const [amount, setAmount] = useState<number>(990);
  const [trxId, setTrxId] = useState("");
  
  // Timer States
  const [verifyingCountdown, setVerifyingCountdown] = useState(3);
  const [extendedCountdown, setExtendedCountdown] = useState(29);
  const [verifyingStartedAt, setVerifyingStartedAt] = useState<number | null>(null);
  const [alreadyUsedOpen, setAlreadyUsedOpen] = useState(false);

  // Settings
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

  // Fetch settings on mount
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
      .catch(() => console.log("Failed to load settings."));
      
      const params = new URLSearchParams(window.location.search);
      const phoneParam = params.get("phone");
      const priceParam = params.get("price");
      if (phoneParam) setPhone(phoneParam);
      if (priceParam) setAmount(Number(priceParam));
  }, []);

  // Timer logic for verifying state (3 seconds)
  useEffect(() => {
    if (viewState !== "verifying") return;
    const interval = setInterval(() => {
      setVerifyingCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setViewState("extended");
          setExtendedCountdown(29);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [viewState]);

  // Timer logic for extended state (29 seconds)
  useEffect(() => {
    if (viewState !== "extended") return;
    const interval = setInterval(() => {
      setExtendedCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setViewState("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [viewState]);

  // Submission handler
  useEffect(() => {
    if (viewState !== "verifying") return;

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
            password: "TMP_" + Math.random().toString(36).substring(7), // Password removed, generate a temp one, they'll set real one on success
            trxId,
            amount,
            paymentMethod,
            promoCode: ""
          })
        });
        const data = await res.json();
        
        if (data.success) {
          localOrderId = data.orderId;
          
          if (data.status === 'COMPLETED') {
            setViewState("success");
          } else {
            // Start polling order status
            pollInterval = setInterval(async () => {
              try {
                const statusRes = await fetch(`/api/checkout?orderId=${localOrderId}`);
                const statusData = await statusRes.json();
                if (statusData.status === 'COMPLETED') {
                  clearInterval(pollInterval);
                  setViewState("success");
                }
              } catch (err) {
                console.error("Polling error:", err);
              }
            }, 2500);
          }
        } else {
          // Failure - Show error and return to form
          const msg = data.error || "";
          if (msg.toLowerCase().includes("already") || msg.includes("ব্যবহার") || msg.includes("used")) {
            setAlreadyUsedOpen(true);
            setTimeout(() => setAlreadyUsedOpen(false), 4000);
            setViewState("form");
          } else {
            setError(data.error || "ট্রানজেকশন ভেরিফিকেশন ব্যর্থ হয়েছে।");
            setViewState("form");
          }
        }
      } catch (err) {
        setError("নেটওয়ার্ক এরর! অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিয়ে আবার চেষ্টা করুন।");
        setViewState("form");
      }
    };

    handleServerSubmit();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [viewState]);

  // Handle Form Submit
  const handleSubmit = () => {
    const cleanedPhone = phone.trim().replace(/[^0-9]/g, "");
    if (!cleanedPhone || cleanedPhone.length !== 11) {
      alert("মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!");
      return;
    }
    const prefix = cleanedPhone.substring(0, 3);
    const validPrefixes = ["013", "014", "015", "016", "017", "018", "019"];
    if (!validPrefixes.includes(prefix)) {
      alert("সঠিক মোবাইল অপারেটর নম্বর দিন!");
      return;
    }
    if (!trxId) {
      alert("মোবাইল নাম্বার অথবা ট্রানজেকশন আইডি দিন!");
      return;
    }

    setVerifyingStartedAt(Date.now());
    setVerifyingCountdown(3);
    setViewState("verifying");
    setError("");
    
    fetch("/api/visitor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || undefined,
        phone: cleanedPhone,
        password: "TMP_PASSWORD"
      })
    }).catch(() => {});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("নম্বর কপি করা হয়েছে: " + text);
  };

  const getBrandTheme = () => {
    switch (paymentMethod) {
      case "bkash":
        return {
          bgHeader: "bg-gradient-to-r from-pink-500 via-white to-pink-500",
          logoFlat: "/images/mobile-banking/bkash-flat.svg",
          logoRound: "/images/mobile-banking/bkash-round.svg",
          name: "bKash"
        };
      case "rocket":
        return {
          bgHeader: "bg-gradient-to-r from-purple-600 via-white to-purple-600",
          logoFlat: "/images/mobile-banking/rocket-flat.svg",
          logoRound: "/images/mobile-banking/rocket-round.svg",
          name: "Rocket"
        };
      case "upay":
        return {
          bgHeader: "bg-gradient-to-r from-gray-500 via-white to-gray-500",
          logoFlat: "/images/mobile-banking/upay-flat.svg",
          logoRound: "/images/mobile-banking/upay-round.svg",
          name: "Upay"
        };
      case "nagad":
      default:
        return {
          bgHeader: "bg-gradient-to-r from-orange-500 via-white to-red-500",
          logoFlat: "/images/mobile-banking/nagad-flat.svg",
          logoRound: "/images/mobile-banking/nagad-round.svg",
          name: "Nagad"
        };
    }
  };

  const brand = getBrandTheme();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F172A] selection:bg-[#ff0000]/20">
      <div className="fixed inset-0 z-0 hidden md:block overflow-hidden pointer-events-none">
        <LandingClient />
      </div>

      <div className="fixed inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-0 md:p-4 bg-slate-900/60 dark:bg-slate-950/70 md:backdrop-blur-md transition-all overflow-hidden overscroll-none">
        <div className="w-full md:w-[420px] bg-white dark:bg-[#1E293B] md:rounded-3xl shadow-2xl md:border border-slate-200 dark:border-slate-700/60 relative h-[100dvh] md:h-[760px] flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-slate-900 dark:text-slate-100">
          
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 sticky top-0 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm z-20">
            <button 
              onClick={() => window.location.href = '/'} 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer text-slate-500 relative z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#ff0000]" />
            </div>

            <button 
              onClick={() => window.location.href = '/'} 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer text-slate-500 relative z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form State */}
          {viewState === "form" && (
            <div className="px-5 md:px-7 pb-4 flex flex-col flex-1 relative mt-0">
              <div className="text-center pt-4 mb-3 shrink-0">
                <h2 className="text-[16px] md:text-lg font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                  অর্ডার করতে নিচের ধাপগুলো পূরণ করুন।
                </h2>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/35 text-red-600 rounded-xl text-xs font-bold shrink-0">
                  {error}
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">আপনার নাম (ঐচ্ছিক)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">মোবাইল নম্বর *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] text-sm font-extrabold"
                      required 
                    />
                  </div>
                </div>

                {/* Payment Gateways */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {["bkash", "nagad", "rocket", "upay"].map((method) => (
                      <button 
                        key={method}
                        onClick={() => setPaymentMethod(method as any)}
                        className={`p-2 rounded-xl border-2 flex items-center justify-center transition-all ${
                          paymentMethod === method 
                          ? (method === 'bkash' ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20" : 
                             method === 'rocket' ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : 
                             method === 'upay' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : 
                             "border-orange-500 bg-orange-50 dark:bg-orange-900/20")
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        }`}
                      >
                        <img src={`/images/mobile-banking/${method}-flat.svg`} alt={method} className="h-7 md:h-8 object-contain" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Amount & Number */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold pb-2">
                    <span className="text-slate-600 dark:text-slate-400">পরিশোধের পরিমাণ:</span>
                    <span className="text-lg font-black text-red-600">{amount} BDT</span>
                  </div>
                  
                  <div className="text-sm font-bold text-slate-800 dark:text-white mb-2 text-center mt-1">
                    নীচের নম্বরটিতে {amount} টাকা Send Money করুন।
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {gatewayNumbers[paymentMethod]}
                      </span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(gatewayNumbers[paymentMethod])}
                      className="bg-green-700 text-white p-2.5 rounded-lg shadow-sm"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* TrxID Input */}
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    আপনার মোবাইল নাম্বার অথবা ট্রানজেকশন আইডি লিখুন
                  </label>
                  <input 
                    type="text" 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Transaction ID / Phone No."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#ff0000] font-mono text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900"
                    required
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-1">
                    অনুগ্রহ করে Send Money করার পর আপনার মোবাইল নম্বর অথবা ট্রানজেকশন আইডিটি বক্সে দিয়ে সাবমিট করুন।
                  </p>
                </div>

                </div>

                <div className="pt-4 pb-2 mt-auto">
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-3.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-md text-sm btn-shimmer"
                  >
                    কন্টিনিউ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verification States */}
          {viewState !== "form" && (
             <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
               <div className={`${brand.bgHeader} py-8 px-6 flex flex-col items-center justify-center relative shadow-md`}>
                 <div className="w-24 h-24 rounded-full relative flex items-center justify-center shadow-2xl mt-2 mb-4 bg-white">
                   {viewState === "verifying" && <div className="absolute -inset-1 rounded-full animate-[spin_3s_linear_infinite]" style={{ background: 'conic-gradient(#ff0000, #ff8c00, #ffd700, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)' }}></div>}
                   <div className="absolute inset-0 rounded-full bg-white"></div>
                   <img src={brand.logoRound} alt={brand.name} className="w-20 h-20 object-contain relative z-10 rounded-full" />
                 </div>
               </div>
               
               <div className="p-5 flex-1 flex flex-col justify-center items-center text-center">
                  {viewState === "verifying" && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white">সফল ভাবে সাবমিট হয়েছে</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-bold animate-pulse">আপনার পেমেন্টটি ভেরিফাই করা হচ্ছে...</p>
                      <p className="text-xs text-slate-500 font-semibold">{formatTime(verifyingCountdown)}</p>
                    </div>
                  )}

                  {viewState === "extended" && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white">ট্রানজেকশনটি প্রত্যাশিত সময়ের চেয়ে বেশি সময় নিচ্ছে</h3>
                      <p className="text-xs text-slate-500 font-semibold">আপনার ডিপোজিট এপ্রুভ হলে ব্যালেন্সে প্রদর্শিত হবে।</p>
                      <div className="w-full max-w-[200px] mx-auto bg-slate-200 rounded-full h-2 overflow-hidden mt-4">
                        <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${((29 - extendedCountdown)/29)*100}%` }}></div>
                      </div>
                      <p className="text-xs font-bold text-slate-600 mt-2">{extendedCountdown} সেকেন্ড</p>
                      
                      <div className="mt-8 pt-8 w-full">
                        <button 
                          onClick={() => setViewState("form")}
                          className="w-full py-3 bg-slate-800 text-white font-extrabold rounded-xl"
                        >
                          হোমপেজে ফিরে যান
                        </button>
                      </div>
                    </div>
                  )}

                  {viewState === "timeout" && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <X className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white">সময় শেষ!</h3>
                      <p className="text-slate-500 font-bold text-sm">দুঃখিত, আপনার পেমেন্ট ভেরিফাই করা সম্ভব হয়নি।</p>
                      <div className="mt-8 w-full">
                        <button onClick={() => setViewState("form")} className="w-full py-3 bg-slate-800 text-white font-extrabold rounded-xl">পুনরায় চেষ্টা করুন</button>
                      </div>
                    </div>
                  )}

                  {viewState === "success" && (
                    <div className="space-y-4 w-full px-2">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white">Payment Successful</h3>
                      <p className="text-slate-500 font-bold text-sm">Thank you for your purchase!</p>
                      
                      <div className="mt-8 pt-6 w-full space-y-4">
                        <button 
                          onClick={() => window.location.href = `/checkout/success?phone=${phone}`}
                          className="w-full py-4 bg-[#ff0000] text-white font-extrabold rounded-xl text-lg shadow-md hover:bg-[#d60000] cursor-pointer"
                        >
                          পাসওয়ার্ড সেট করুন
                        </button>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-left border border-slate-200 dark:border-slate-700">
                          <span className="font-bold">প্রিয় গ্রাহক,</span> একটি পাসওয়ার্ড সেট করুন যেন ভবিষ্যতে আপনি এই পাসওয়ার্ডটি দিয়ে আপনার অ্যাকাউন্টে লগইন করতে পারেন। পাসওয়ার্ড সেট করতে অবশ্যই লেটার এবং নাম্বার দুটি ব্যবহার করুন (সর্বনিম্ন ৬ অক্ষর)।
                        </p>
                      </div>
                    </div>
                  )}
               </div>
             </div>
          )}

          {alreadyUsedOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"><X className="w-6 h-6 text-amber-600" /></div>
                <h3 className="font-bold text-slate-900 dark:text-white">অলরেডি ব্যবহার হয়েছে</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">এই মোবাইল নাম্বার অথবা ট্রানজেকশন আইডি অলরেডি ব্যবহার হয়ে গেছে।</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
