"use client";

import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">অর্ডারটি গ্রহণ করা হয়েছে!</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-4 text-left mb-6">
          <Clock className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">পেমেন্ট ভেরিফিকেশন চলছে...</h3>
            <p className="text-sm text-yellow-700">
              আপনার দেওয়া Transaction ID টি আমাদের টিম ম্যানুয়ালি যাচাই করবে। পেমেন্ট কনফার্ম হতে সাধারণত <strong>১০-৩০ মিনিট</strong> সময় লাগতে পারে।
            </p>
          </div>
        </div>

        <p className="text-slate-600 mb-8 leading-relaxed">
          পেমেন্ট কনফার্ম হওয়ার সাথে সাথেই আপনি আপনার দেওয়া ইমেইল বা ফোন নাম্বার দিয়ে লগইন করে কোর্সের ফুল অ্যাক্সেস পেয়ে যাবেন।
        </p>
        
        <Link 
          href="/login" 
          className="inline-block bg-[#ff0000] text-white font-bold py-3 px-8 rounded-md hover:bg-[#cc0000] transition-colors w-full"
        >
          লগইন পেজে যান
        </Link>
      </div>
    </div>
  );
}
