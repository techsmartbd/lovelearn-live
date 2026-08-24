"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Save, 
  Loader2, 
  Gift, 
  Play, 
  BookOpen, 
  Award, 
  FileText, 
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  Edit
} from "lucide-react";

export default function MarketingDashboardAdmin() {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hero Section Form State
  const [heroTitle, setHeroTitle] = useState("স্বাগতম ফিরে এসেছেন!");
  const [heroSubtitle, setHeroSubtitle] = useState("আজ কিছু নতুন শিখি, নিজেকে আরও এক ধাপ এগিয়ে নিই!");
  const [continueLearningCourse, setContinueLearningCourse] = useState("React.js বাংলা টিউটোরিয়াল");
  const [continueLearningProgress, setContinueLearningProgress] = useState(65);

  // Quick Access Panel Configs
  const [quickAccessItems, setQuickAccessItems] = useState([
    { id: "1", label: "আমার কোর্স", sublabel: "১টি কোর্স", icon: "Play" },
    { id: "2", label: "আমার ই-বুক", sublabel: "১২টি ই-বুক", icon: "BookOpen" },
    { id: "3", label: "কোর্স প্যাকেজ", sublabel: "৫টি প্যাকেজ", icon: "Gift" },
    { id: "4", label: "সার্টিফিকেট", sublabel: "৪টি সার্টিফিকেট", icon: "Award" },
    { id: "5", label: "আমার লাইব্রেরি", sublabel: "সকল কনটент", icon: "FileText" },
    { id: "6", label: "হেল্প & সাপোর্ট", sublabel: "সাহায্য কেন্দ্র", icon: "HelpCircle" },
  ]);

  // Promotional Banners State
  const [promoBanners, setPromoBanners] = useState([
    {
      id: "1",
      badge: "স্পেশাল অফার",
      title: "প্রিমিয়াম কোর্স আনলিমিটেড অ্যাক্সেস!",
      description: "হাজারো কোর্স, ই-বুক এবং টিউটোরিয়াল এর অ্যাক্সেস",
      buttonText: "এক্সপ্লোর দিন",
      theme: "red"
    },
    {
      id: "2",
      badge: "লাইফটাইম",
      title: "লাইফটাইম অ্যাক্সেস, একবার পেমেন্ট!",
      description: "সবচেয়ে সাশ্রয়ী কনটেন্ট, নিয়মিত আপডেট",
      buttonText: "বিস্তারিত দেখুন",
      theme: "blue"
    },
    {
      id: "3",
      badge: "নতুন স্কিল",
      title: "নতুন স্কিল, নতুন আপনি!",
      description: "প্রতিদিন নতুন কিছু শিখুন এবং ক্যারিয়ার গড়ুন",
      buttonText: "শুরু করুন",
      theme: "emerald"
    }
  ]);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    // Simulate database update sync
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 p-6 text-left">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#ff0000]" /> Marketing Dashboard & User Panel Manager
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            ইউজার ড্যাশবোর্ডের হিরো ব্যানার, দ্রুত অ্যাক্সেস কার্ড এবং প্রমোশনাল ব্যানারসমূহ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-6 py-2.5 bg-[#ff0000] hover:bg-[#d60000] text-white font-extrabold rounded-xl transition-all shadow-md shadow-red-500/20 text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সেটিংস সংরক্ষণ করুন
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 shrink-0" /> ইউজার ড্যাশবোর্ডের সকল মার্কেটিং কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* HERO COVER CONFIGURATION */}
        <div className="bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#ff0000]" /> হিরো কভার ও ওয়েলকাম ব্যানার
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-extrabold">
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400">ওয়েলকাম শিরোনাম (Title)</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400">সাব-টাইটেল (Sub-heading)</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400">ডিফল্ট লার্নিং কোর্স (Default Continued Course)</label>
              <input
                type="text"
                value={continueLearningCourse}
                onChange={(e) => setContinueLearningCourse(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400">ডিফল্ট প্রোগ্রেস শতাংশ (%)</label>
              <input
                type="number"
                value={continueLearningProgress}
                onChange={(e) => setContinueLearningProgress(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#ff0000]"
              />
            </div>
          </div>
        </div>

        {/* QUICK ACCESS PANEL CONFIGURATION */}
        <div className="bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
            <Edit className="w-4 h-4 text-[#ff0000]" /> দ্রুত অ্যাক্সেস কার্ডসমূহ (Quick Access Items)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickAccessItems.map((item, idx) => (
              <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-black text-slate-400">
                  <span>কার্ড #{idx + 1}</span>
                </div>
                <div className="space-y-2 text-xs font-extrabold">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...quickAccessItems];
                      updated[idx].label = e.target.value;
                      setQuickAccessItems(updated);
                    }}
                    placeholder="কার্ড লেবেল"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
                  />
                  <input
                    type="text"
                    value={item.sublabel}
                    onChange={(e) => {
                      const updated = [...quickAccessItems];
                      updated[idx].sublabel = e.target.value;
                      setQuickAccessItems(updated);
                    }}
                    placeholder="সাব-লেবেল"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROMOTIONAL BANNERS CONFIGURATION */}
        <div className="bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#ff0000]" /> প্রমোশনাল ব্যানারসমূহ (Bottom Marketing Banners)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoBanners.map((banner, idx) => (
              <div key={banner.id} className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="text-xs font-black text-[#ff0000]">ব্যানার #{idx + 1} ({banner.badge})</div>
                <div className="space-y-2 text-xs font-extrabold">
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => {
                      const updated = [...promoBanners];
                      updated[idx].title = e.target.value;
                      setPromoBanners(updated);
                    }}
                    placeholder="ব্যানার টাইটেল"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
                  />
                  <input
                    type="text"
                    value={banner.description}
                    onChange={(e) => {
                      const updated = [...promoBanners];
                      updated[idx].description = e.target.value;
                      setPromoBanners(updated);
                    }}
                    placeholder="বিবরণ"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
                  />
                  <input
                    type="text"
                    value={banner.buttonText}
                    onChange={(e) => {
                      const updated = [...promoBanners];
                      updated[idx].buttonText = e.target.value;
                      setPromoBanners(updated);
                    }}
                    placeholder="বাটন টেক্সট"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
}
