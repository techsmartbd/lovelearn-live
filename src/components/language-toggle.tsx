"use client";

import { useLanguage } from "@/context/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "bn" ? "en" : "bn");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center gap-2 w-[76px] h-9 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer"
      title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
    >
      {language === "bn" ? (
        // UK Flag Circle
        <svg className="w-4 h-4 rounded-full border border-slate-100 shrink-0" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" fill="#00247D" />
          <path d="M0 0 L20 20 M20 0 L0 20" stroke="#FFF" strokeWidth="2.5" />
          <path d="M0 0 L20 20 M20 0 L0 20" stroke="#CF142B" strokeWidth="1.5" />
          <path d="M10 0 V20 M0 10 H20" stroke="#FFF" strokeWidth="4" />
          <path d="M10 0 V20 M0 10 H20" stroke="#CF142B" strokeWidth="2.5" />
        </svg>
      ) : (
        // Bangladesh Flag Circle
        <svg className="w-4 h-4 rounded-full border border-slate-100 shrink-0" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" fill="#006A4E" />
          <circle cx="9" cy="10" r="4.5" fill="#F42A41" />
        </svg>
      )}
      <span>{language === "bn" ? "EN" : "BN"}</span>
    </button>
  );
}
