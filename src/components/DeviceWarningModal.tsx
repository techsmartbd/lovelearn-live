"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Check, Bot, User, Lock, Sparkles } from "lucide-react";

export function DeviceWarningModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("device_warning_seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("device_warning_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div suppressHydrationWarning className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />
        
        <div className="relative space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-[#ff0000] border border-red-500/20 shadow-sm animate-pulse">
            <Bot className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20 tracking-wider">
            <Sparkles className="w-3 h-3" /> ECOM SENTRIX ANALYTIC V-1
          </span>

          <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
            হ্যালো ও স্বাগতম! 👋
          </h3>
          
          <p className="text-[11.5px] font-bold text-slate-500 dark:text-slate-400 leading-normal max-w-sm mx-auto">
            আমাদের লার্নিং কমিউনিটিতে আপনাকে স্বাগতম! আপনার সিকিউরিটি এবং অ্যাকাউন্ট সেফটির স্বার্থে অনুগ্রহ করে নিচের বিষয়গুলো খেয়াল রাখুন:
          </p>

          <div className="space-y-2.5 pt-2">
            {/* Rule 1 */}
            <div className="flex items-start gap-3 text-left bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/60">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/10">
                <User className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">পাসওয়ার্ড শেয়ারিং নীতি</h4>
                <p className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 leading-normal">আপনার অ্যাকাউন্টের পাসওয়ার্ড বা অ্যাক্সেস তথ্য অন্য কারো সাথে শেয়ার করবেন না।</p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="flex items-start gap-3 text-left bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/60">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/10">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">ডিভাইস লগইন লিমিট</h4>
                <p className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 leading-normal">একই সাথে ২টির বেশি ডিভাইসে লগইন করা থেকে বিরত থাকুন (অন্যথায় অ্যাকাউন্টটি সাময়িকভাবে লক হয়ে যেতে পারে)।</p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="flex items-start gap-3 text-left bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/60">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#ff0000] flex items-center justify-center shrink-0 border border-red-500/10">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">কনটেন্ট ও আইডি পলিসি</h4>
                <p className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 leading-normal">কনটেন্ট কপি করার চেষ্টা বা অনৈতিক কোনো কার্যক্রম সনাক্ত করা হলে অ্যাকাউন্ট সাসপেন্ড হতে পারে।</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-3 leading-normal">
            আমাদের সাথে থাকার জন্য ধন্যবাদ এবং আপনার লার্নিং জার্নির জন্য শুভকামনা!
          </p>

          <button
            onClick={handleDismiss}
            className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-[#ff0000] hover:bg-[#d60000] py-3.5 px-5 text-xs font-extrabold text-white transition-all shadow-md shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer"
          >
            <Check className="w-4 h-4" /> ঠিক আছে, আমি সম্মত
          </button>
        </div>
      </div>
    </div>
  );
}
