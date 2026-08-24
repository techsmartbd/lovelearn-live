"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "bn" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Navbar
    courses: "কোর্সসমূহ",
    howItWorks: "কিভাবে কাজ করে",
    successStories: "সফলতার গল্প",
    faq: "প্রশ্নোত্তর",
    contact: "যোগাযোগ",
    userLogin: "ইউজার লগইন",
    adminDashboard: "অ্যাডমিন ড্যাশবোর্ড",
    userDashboard: "ইউজার ড্যাশবোর্ড",
    logout: "লগআউট",
    
    // Login Page
    loginTitle: "অ্যাকাউন্টে লগইন করুন",
    phoneLabel: "মোবাইল নম্বর",
    passwordLabel: "পাসওয়ার্ড",
    loginBtn: "লগইন করুন",
    noAccount: "কোনো অ্যাকাউন্ট নেই?",
    registerNow: "এখনই ভর্তি হোন!",
    
    // Sidebar / Dashboard
    dashboard: "ড্যাশবোর্ড",
    videos: "ভিডিওসমূহ",
    ebooks: "ই-বুকস",
    packages: "প্যাকেজসমূহ",
    orders: "অর্ডারসমূহ",
    users: "ইউজারসমূহ",
    tracking: "ট্র্যাকিং",
    aiAssistant: "এআই অ্যাসিস্ট্যান্ট",
    settings: "সেটিংস",
    landingPageCms: "ল্যান্ডিং পেজ সিএমএস",
    generalSettings: "জেনারেল সেটিংস",
    tutorialVideos: "টিউটোরিয়াল ভিডিও",
    landingVideos: "ল্যান্ডিং ভিডিও",
    pageContent: "পেজ কন্টেন্ট",
    
    // Direct matches for NAV_DATA sidebar menu items
    "ADMIN MENU": "অ্যাডমিন মেনু",
    "Dashboard": "ড্যাশবোর্ড",
    "Tutorial Management": "টিউটোরিয়াল ম্যানেজমেন্ট",
    "Tutorial Videos": "টিউটোরিয়াল ভিডিও",
    "E-Books": "ই-বুকস",
    "Packages": "প্যাকেজসমূহ",
    "Orders": "অর্ডারসমূহ",
    "User Management": "ইউজার ম্যানেজমেন্ট",
    "Premium Users": "প্রিমিয়াম ইউজার",
    "Pending Users": "পেন্ডিং ইউজার",
    "Visitor Info": "ভিজিটর ইনফো",
    "Tracking System": "ট্র্যাকিং সিস্টেম",
    "AI Assistant": "এআই অ্যাসিস্ট্যান্ট",
    "Marketing Dashboard": "মার্কেটিং ড্যাশবোর্ড",
    "Settings": "সেটিংস",
    "Landing Page CMS": "ল্যান্ডিং পেজ সিএমএস",
    "Page Content": "পেজ কন্টেন্ট",
    "Landing Videos": "ল্যান্ডিং ভিডিও",

    // Student Dashboard Tabs
    "Tutorials": "টিউটোরিয়াল",
    "eBooks": "ই-বুকস",
    "Combo": "কম্বো অফার",
    "More": "আরো কন্টেন্ট",
    "Logout": "লগআউট",
  },
  en: {
    // Navbar
    courses: "Courses",
    howItWorks: "How It Works",
    successStories: "Success Stories",
    faq: "FAQ",
    contact: "Contact",
    userLogin: "User Login",
    adminDashboard: "Admin Dashboard",
    userDashboard: "User Dashboard",
    logout: "Logout",
    
    // Login Page
    loginTitle: "Login to your account",
    phoneLabel: "Mobile Number",
    passwordLabel: "Password",
    loginBtn: "Login Now",
    noAccount: "Don't have an account?",
    registerNow: "Enroll now!",
    
    // Sidebar / Dashboard
    dashboard: "Dashboard",
    videos: "Videos",
    ebooks: "E-Books",
    packages: "Packages",
    orders: "Orders",
    users: "Users",
    tracking: "Tracking",
    aiAssistant: "AI Assistant",
    "Marketing Dashboard": "Marketing Dashboard",
    "Pending Users": "Pending Users",
    settings: "Settings",
    landingPageCms: "Landing Page CMS",
    generalSettings: "General Settings",
    tutorialVideos: "Tutorial Videos",
    landingVideos: "Landing Videos",
    pageContent: "Page Content",
  }
};

export function LanguageProvider({ children, storageKey = "language" }: { children: React.ReactNode, storageKey?: string }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as Language;
    if (saved === "bn" || saved === "en") {
      setLanguageState(saved);
    }
  }, [storageKey]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(storageKey, lang);
    document.cookie = `${storageKey}=${lang}; path=/; max-age=31536000`;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
