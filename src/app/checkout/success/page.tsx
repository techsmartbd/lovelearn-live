"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Eye, EyeOff, Lock, ChevronRight } from "lucide-react";
import LandingClient from "@/components/landing-client";

export default function CheckoutSuccessPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("phone");
      if (p) setPhone(p);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      setError("পাসওয়ার্ডে অবশ্যই লেটার (a-z) এবং নাম্বার (0-9) থাকতে হবে।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      
      if (data.success) {
        window.location.href = data.redirectUrl || "/dashboard";
      } else {
        setError(data.error || "পাসওয়ার্ড সেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      setError("নেটওয়ার্ক এরর, দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F172A] selection:bg-[#ff0000]/20">
      <div className="fixed inset-0 z-0 hidden md:block overflow-hidden pointer-events-none">
        <LandingClient />
      </div>

      <div className="fixed inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-0 md:p-4 bg-slate-900/60 dark:bg-slate-950/70 md:backdrop-blur-md transition-all">
        <div className="w-full md:w-[420px] bg-white dark:bg-[#1E293B] md:rounded-3xl shadow-2xl md:border border-slate-200 dark:border-slate-700/60 relative h-[100dvh] md:h-auto flex flex-col overflow-y-auto text-slate-900 dark:text-slate-100">
          
          <div className="p-8 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">পেমেন্ট সম্পন্ন হয়েছে!</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">আপনার ট্রানজেকশন সফলভাবে ভেরিফাই হয়েছে।</p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="mb-6 text-center">
                <div className="w-12 h-12 bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-[#ff0000]" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">অ্যাকাউন্টের পাসওয়ার্ড সেট করুন</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  ভবিষ্যতে আপনার অ্যাকাউন্টে লগইন করতে এই পাসওয়ার্ডটি প্রয়োজন হবে।
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/35 text-red-600 rounded-xl text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] text-sm font-bold transition-all"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium px-1 text-center">
                    পাসওয়ার্ডে অবশ্যই লেটার (a-z) এবং নাম্বার (0-9) থাকতে হবে।
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      অপেক্ষা করুন...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      পাসওয়ার্ড সেট করে লগইন করুন <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>

            <div className="text-center pt-2">
               <button 
                onClick={() => window.location.href = "/"}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
               >
                 হোমপেজে ফিরে যান
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
