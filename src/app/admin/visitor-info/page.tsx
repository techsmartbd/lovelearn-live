"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Calendar, RefreshCw, Trash2, User, Phone, Lock, Clock, ShieldAlert } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  phone: string;
  password: string;
  createdAt: string;
}

export default function VisitorInfoPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("ALL");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visitor-lead");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to load visitor leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper: "20-Aug-2026 | Thursday"
  const formatDateKey = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const weekday = d.toLocaleString('en-US', { weekday: 'long' });
    return `${day}-${month}-${year} | ${weekday}`;
  };

  // Format visiting time helper: "20-Aug-2026 | 09:53:00 PM"
  const formatVisitingTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${day}-${month}-${year} | ${time}`;
  };

  // Group unique dates for left sidebar filter
  const uniqueDates = useMemo(() => {
    const datesMap = new Map<string, number>();
    leads.forEach((item) => {
      const key = formatDateKey(item.createdAt);
      datesMap.set(key, (datesMap.get(key) || 0) + 1);
    });
    return Array.from(datesMap.entries()).map(([dateKey, count]) => ({ dateKey, count }));
  }, [leads]);

  // Filter leads based on selected date and search query
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Date filter
      if (selectedDate !== "ALL") {
        const itemDateKey = formatDateKey(item.createdAt);
        if (itemDateKey !== selectedDate) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (item.name || "").toLowerCase().includes(q);
        const matchPhone = item.phone.includes(q);
        return matchName || matchPhone;
      }

      return true;
    });
  }, [leads, selectedDate, searchQuery]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Visitor Activities & Information
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            চেকআউটের ১ম ধাপে তথ্য পূরণকারী সকল ভিজিটরদের ফোন নম্বর, নাম ও পাসওয়ার্ডের তালিকা।
          </p>
        </div>

        <button 
          onClick={fetchLeads}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-sm w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR: Find Visitor by Date */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#ff0000]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Find Visitor by Date
            </h3>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            <button
              onClick={() => setSelectedDate("ALL")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                selectedDate === "ALL"
                  ? "bg-[#ff0000] text-white shadow-md shadow-red-500/20"
                  : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>সকল তারিখ (All Dates)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-slate-700/50">
                {leads.length}
              </span>
            </button>

            {uniqueDates.map(({ dateKey, count }) => (
              <button
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedDate === dateKey
                    ? "bg-[#ff0000] text-white shadow-md shadow-red-500/20 font-bold"
                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="truncate">{dateKey}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 ml-1">
                  {count}
                </span>
              </button>
            ))}

            {uniqueDates.length === 0 && !loading && (
              <div className="text-center py-6 text-xs text-slate-400">
                কোনো তারিখ পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN AREA: Visitor List Table */}
        <div className="lg:col-span-9 bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-5">
          
          {/* Search Bar & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম অথবা মোবাইল নম্বর দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#ff0000] transition-all"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              মোট ভিজিটর: <span className="text-[#ff0000] font-black">{filteredLeads.length}</span> জন
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <th className="py-3.5 px-6">Visitor Name</th>
                  <th className="py-3.5 px-6 text-center">Mobile Number</th>
                  <th className="py-3.5 px-6 text-center">Password</th>
                  <th className="py-3.5 px-6 text-right">Visiting Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredLeads.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Visitor Name */}
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {item.name || "ইউজার"}
                    </td>

                    {/* Mobile Number */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                        {item.phone}
                      </span>
                    </td>

                    {/* Password */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                        {item.password}
                      </span>
                    </td>

                    {/* Visiting Time */}
                    <td className="py-4 px-6 text-right font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatVisitingTime(item.createdAt)}
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold">
                      কোনো ভিজিটর তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold">
                      তথ্য লোড হচ্ছে...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
