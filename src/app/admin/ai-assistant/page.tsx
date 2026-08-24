"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, Loader2, ShieldAlert, UserCheck, Activity, PhoneCall, Save, Mic, MicOff, Volume2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantPage() {
  // Tabs: 'chat' | 'voice'
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "স্বাগতম! আমি আপনার অ্যাডমিন এআই অ্যাসিস্ট্যান্ট। আপনার সাইটের সেলস, ইউজার অ্যাক্টিভিটি, ডিভাইস সেশন এবং প্যাকেজ সংক্রান্ত যেকোনো লাইভ ডেটা বা অ্যানালিটিক্যাল হিসেব জানতে আমাকে জিজ্ঞেস করুন।",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<any>(null);

  // Vapi Voice Call Agent Config States
  const [configLoading, setConfigLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testCallLoading, setTestCallLoading] = useState(false);

  // Vapi Web Call States
  const vapiRef = useRef<any>(null);
  const [webCallActive, setWebCallActive] = useState(false);
  const [webCallStatus, setWebCallStatus] = useState<'idle' | 'connecting' | 'active'>('idle');

  useEffect(() => {
    fetch("/api/admin/ai-assistant")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (activeTab !== 'voice') {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {}
        vapiRef.current = null;
      }
      setWebCallStatus("idle");
      setWebCallActive(false);
      return;
    }

    // Initialize Vapi client only when the voice tab is active
    if (typeof window !== "undefined") {
      try {
        const Vapi = require("@vapi-ai/web").default;
        vapiRef.current = new Vapi("8cc305ef-d078-40b6-82db-c3886b0a1873");

        vapiRef.current.on("call-start", () => {
          setWebCallStatus("active");
          setWebCallActive(true);
        });

        vapiRef.current.on("call-end", () => {
          setWebCallStatus("idle");
          setWebCallActive(false);
        });

        vapiRef.current.on("error", (err: any) => {
          console.error("Vapi Web Call Error:", err);
          setWebCallStatus("idle");
          setWebCallActive(false);
          alert("ভয়েস চ্যাট সংযোগ করতে সমস্যা হয়েছে। অনুগ্রহ করে মাইক্রোফোন পারমিশন চেক করুন।");
        });
      } catch (e) {
        console.error("Failed to load Vapi SDK:", e);
      }
    }

    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {}
        vapiRef.current = null;
      }
    };
  }, [activeTab]);

  const handleToggleWebCall = () => {
    if (!vapiRef.current) {
      alert("ভয়েস ক্লায়েন্ট লোড হতে ব্যর্থ হয়েছে।");
      return;
    }

    if (webCallActive) {
      vapiRef.current.stop();
    } else {
      setWebCallStatus("connecting");
      try {
        vapiRef.current.start("571801db-1dda-479a-b763-b9588fef3d69");
      } catch (e: any) {
        console.error(e);
        setWebCallStatus("idle");
        alert("কল শুরু করতে ব্যর্থ হয়েছে: " + (e.message || e));
      }
    }
  };

  // Fetch Vapi Config when Tab switches to voice
  useEffect(() => {
    if (activeTab === 'voice') {
      fetchVapiConfig();
    }
  }, [activeTab]);

  const fetchVapiConfig = async () => {
    setConfigLoading(true);
    try {
      const res = await fetch('/api/admin/calls/config');
      if (res.ok) {
        const data = await res.json();
        setFirstMessage(data.firstMessage || "");
        setSystemPrompt(data.systemPrompt || "");
      } else {
        const data = await res.json();
        setError(data.error || "ভ্যাপি কনফিগারেশন লোড করতে ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      setError("সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে।");
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/calls/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstMessage, systemPrompt })
      });
      if (res.ok) {
        alert("ভয়েস এজেন্টের প্রম্পট ও সেটিংস সফলভাবে আপডেট করা হয়েছে!");
      } else {
        const data = await res.json();
        setError(data.error || "সেটিংস আপডেট করতে ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      setError("সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTriggerTestCall = async () => {
    if (!testPhone.trim()) {
      alert("অনুগ্রহ করে একটি মোবাইল নম্বর দিন!");
      return;
    }
    setTestCallLoading(true);
    try {
      const res = await fetch('/api/admin/calls/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone, customerName: "Test Admin" })
      });
      if (res.ok) {
        alert(`টেস্ট কল সফলভাবে শুরু হয়েছে! আপনার ফোন (${testPhone}) চেক করুন।`);
      } else {
        const data = await res.json();
        alert(`কল ট্রিগার ব্যর্থ: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`ত্রুটি: ${err.message || err}`);
    } finally {
      setTestCallLoading(false);
    }
  };

  const quickQuestions = [
    "গত ৭ দিনে কয়টি অর্ডার সম্পন্ন হয়েছে?",
    "মোট কত টাকা আয় হয়েছে এবং পেন্ডিং পেমেন্ট কত?",
    "সবচেয়ে বেশি জনপ্রিয় লার্নিং প্যাকেজ কোনটি?",
    "অ্যাকাউন্টে কোনো একাধিক ডিভাইস সেশন ওভারল্যাপ আছে কি?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/admin/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error("অ্যাসিস্ট্যান্ট রেসপন্স করতে ব্যর্থ হয়েছে।");
      }

      const data = await res.json();
      const assistantText = data.choices?.[0]?.message?.content || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err: any) {
      setError(err.message || "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="mb-4 text-left">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          AI Intelligence Center
        </h2>
        <p className="font-medium text-slate-500">অ্যাডমিন চ্যাট অ্যাসিস্ট্যান্ট এবং এআই ভয়েস কল এজেন্টের গ্লোবাল সেটিংস কন্ট্রোল প্যানেল।</p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "chat"
              ? "bg-[#ff0000] text-white shadow-md shadow-red-500/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50"
          }`}
        >
          চ্যাট অ্যানালিটিক্স (Chat Assistant)
        </button>
        <button
          onClick={() => setActiveTab("voice")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "voice"
              ? "bg-[#ff0000] text-white shadow-md shadow-red-500/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50"
          }`}
        >
          ভয়েস কল এজেন্ট (Voice Call Agent)
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="space-y-4">
          {/* System Intelligence Dashboard - Event Stream Panel */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-3.5 px-5 shadow-xs relative overflow-visible">
            <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:24px_24px] opacity-3" />
            <div className="relative space-y-5">
              <div className="flex flex-col items-center text-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-2.5">
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2 justify-center">
                    <Activity className="w-5 h-5 text-[#ff0000] animate-pulse" /> System Intelligence Dashboard
                  </h2>
                  <p className="text-[11px] text-slate-555 dark:text-slate-400 font-bold mt-0.5">
                    লাইভ ডাটাবেজ সেশন স্ক্যানিং ও সিকিউরিটি অ্যানালিটিক্স অ্যাক্টিভিটি রিপোর্ট
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-green-500/10 text-green-500 border border-green-500/25 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Real-time System Scanner Active
                </span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Today's Sales */}
                <div className="rounded-2xl border border-slate-150/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-3xs hover:shadow-2xs transition-all flex items-center justify-between gap-4 h-24">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-[#ff0000] shrink-0 border border-red-500/10">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">Today's Sales</span>
                      <h4 className="text-base font-black text-[#ff0000] dark:text-red-500">
                        {alerts?.todayOrdersCount || 0} Orders
                      </h4>
                      <p className="text-[9px] font-bold text-green-500">
                        Active today
                      </p>
                    </div>
                  </div>
                  <svg className="w-16 h-8 shrink-0" viewBox="0 0 100 40" fill="none">
                    <path d="M0 30 C 20 20, 40 40, 60 10 C 80 20, 100 5, 100 5" stroke="#ff0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Card 2: Security Overlaps */}
                <div className="rounded-2xl border border-slate-150/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-3xs hover:shadow-2xs transition-all flex items-center justify-between gap-4 h-24">
                  <div className="flex items-center gap-3 max-w-[70%] text-left">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/10">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">Security Alerts</span>
                      <h4 className="text-xs font-black text-slate-950 dark:text-white truncate">
                        {alerts?.overlappingUser ? `${alerts.overlappingUser.name}` : "No threats"}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-550 truncate">
                        {alerts?.overlappingUser ? `Overlap: ${alerts.overlappingUser.sessionCount} devices` : "All sessions safe"}
                      </p>
                    </div>
                  </div>
                  <svg className="w-16 h-8 shrink-0" viewBox="0 0 100 40" fill="none">
                    <path d="M0 25 C 20 15, 40 35, 60 5 C 80 15, 100 20, 100 20" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Card 3: New Registrants */}
                <div className="rounded-2xl border border-slate-150/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-3xs hover:shadow-2xs transition-all flex items-center justify-between gap-4 h-24">
                  <div className="flex items-center gap-3 max-w-[70%] text-left">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/10">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">New Member</span>
                      <h4 className="text-xs font-black text-slate-950 dark:text-white truncate">
                        {alerts?.lastUser ? `${alerts.lastUser.name}` : "No new register"}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-550 truncate">
                        {alerts?.lastUser ? `Phone: ${alerts.lastUser.phone}` : "Waiting for next user..."}
                      </p>
                    </div>
                  </div>
                  <svg className="w-16 h-8 shrink-0" viewBox="0 0 100 40" fill="none">
                    <path d="M0 20 C 20 30, 40 10, 60 25 C 80 5, 100 15, 100 15" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Column - Chat Box */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs flex flex-col h-[450px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/20">
                    <Bot className="w-5 h-5 text-[#ff0000]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white leading-tight">Admin AI Analytics</h3>
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Online & Connected to Live DB
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-left">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      m.role === "user" 
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
                        : "bg-[#ff0000]/10 border-[#ff0000]/20"
                    }`}>
                      {m.role === "user" ? (
                        <User className="w-4 h-4 text-slate-600 dark:text-slate-350" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#ff0000]" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-3xs font-semibold text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#ff0000] text-white"
                        : "bg-slate-50 dark:bg-slate-855 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800/80"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-4 flex-row">
                    <div className="w-9 h-9 rounded-xl bg-[#ff0000]/10 flex items-center justify-center shrink-0 border border-[#ff0000]/20">
                      <Loader2 className="w-4 h-4 text-[#ff0000] animate-spin" />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-855 text-slate-550 dark:text-slate-400 text-xs font-bold rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 flex items-center gap-2">
                      ডেটাবেজ অ্যানালাইসিস করা হচ্ছে... অনুগ্রহ করে একটু অপেক্ষা করুন
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex gap-2 items-center text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Footer Input */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(input);
                  }}
                  className="flex gap-3"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="এখানে আপনার প্রশ্নটি লিখুন... (যেমন: গত ৭ দিনের সেলস কত?)"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#ff0000] transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-5 py-3.5 bg-[#ff0000] hover:bg-[#d60000] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-extrabold rounded-2xl transition-all shadow-md shadow-red-500/10 flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Suggestion & Info Sidebar */}
            <div className="lg:col-span-4 space-y-4 text-left">
              {/* Quick Suggestions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-2xs">
                <h3 className="font-black text-sm text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff0000]" /> দ্রুত প্রশ্নসমূহ
                </h3>
                <div className="flex flex-col gap-2.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="w-full text-left py-2 px-3.5 rounded-xl bg-slate-50 hover:bg-[#ff0000]/5 dark:bg-slate-955 dark:hover:bg-[#ff0000]/5 border border-slate-100 dark:border-slate-850 hover:border-[#ff0000]/20 text-xs font-semibold text-slate-700 dark:text-slate-355 hover:text-[#ff0000] dark:hover:text-[#ff0000] transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Helper Info Card */}
              <div className="bg-gradient-to-br from-red-50 to-white dark:from-slate-900 dark:to-slate-850 border border-red-500/10 dark:border-slate-800 rounded-3xl p-4 text-slate-700 dark:text-slate-200 relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
                <div className="relative space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/10 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#ff0000]" />
                    </div>
                    <div className="px-3 py-1.5 bg-[#ff0000]/10 border border-[#ff0000]/15 rounded-xl">
                      <h4 className="font-black text-xs text-[#ff0000] tracking-wide">Ecom Sentrix Analytic V-1</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-555 dark:text-slate-400 leading-relaxed font-bold">
                    Ecom Sentrix Analytics V-1 একটি প্রিমিয়াম কাস্টম এআই যা লাইভ ডেটাবেজ বিশ্লেষণ ও ডিভাইস সেশন স্ক্যান করে সিদ্ধান্ত গ্রহণে সাহায্য করে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-left">
          {/* Left Column - Vapi Settings Form */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
              <h3 className="text-sm font-bold text-dark dark:text-white">এআই ভয়েস কল এজেন্ট সেটিংস (Voice Call Agent)</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">এখানে আপনার ভ্যাপী ভয়েস এজেন্টের শুভেচ্ছা বার্তা ও কলিং প্রম্পট কাস্টমাইজ করুন।</p>
            </div>

            {configLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> ভ্যাপি থেকে কনফিগারেশন লোড হচ্ছে...
              </div>
            ) : (
              <form onSubmit={handleSaveConfig} className="space-y-5">
                {error && (
                  <div className="flex gap-2 items-center text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">প্রথম শুভেচ্ছা বার্তা (First Message)</label>
                  <input
                    type="text"
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="যেমন: হ্যালো, আমি Ecom Sentrix থেকে বলছি। আপনার কি একটু সময় হবে?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 outline-none text-xs font-semibold focus:border-red-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">কল কানেক্ট হওয়ার সাথে সাথে এআই এজেন্টটি এই বার্তা দিয়ে কাস্টমারের সাথে কথা বলা শুরু করবে।</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">সিস্টেম প্রম্পট / কলিং গাইডলাইন (System Prompt)</label>
                  <textarea
                    rows={12}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="এখানে ভয়েস এজেন্টের আচরণ, উদ্দেশ্য ও কথা বলার নিয়ম উল্লেখ করুন..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 outline-none text-xs font-semibold focus:border-red-500 transition-colors custom-scrollbar"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">কলের উদ্দেশ্য (অর্ডার কনফার্ম, ক্যাম্পেইন মার্কেটিং বা কাস্টমার সাপোর্ট) ও এআই-এর ভূমিকা এখানে বিস্তারিত লিখুন।</p>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2.5 bg-[#ff0000] hover:bg-[#d60000] text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  পরিবর্তনগুলো সেভ করুন
                </button>
              </form>
            )}
          </div>

          {/* Right Column - Test Dialer Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
            <h3 className="font-black text-sm text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#ff0000]" /> ভয়েস কল টেস্ট করুন
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              আপনার ফোন নম্বর লিখে এআই ভয়েস কলটি সরাসরি ফোনে টেস্ট করুন। কাস্টম প্রম্পট কীভাবে রিয়্যাক্ট করছে তা তাৎক্ষণিকভাবে যাচাই করা যাবে।
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="মোবাইল নম্বর (যেমন: 01712345678)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 outline-none text-xs font-semibold focus:border-red-500 transition-colors"
              />
              <button
                onClick={handleTriggerTestCall}
                disabled={testCallLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                {testCallLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
                টেস্ট কল করুন
              </button>

              {/* Direct Web Voice Chat */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">ওয়েবে সরাসরি ভয়েস চ্যাট (Free Web Call)</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  কোনো ফোন নম্বর বা ক্রেডিট কার্ড ছাড়াই সরাসরি আপনার ব্রাউজার ও মাইক্রোফোন ব্যবহার করে এআই এজেন্টের সাথে লাইভ কথা বলুন।
                </p>
                
                <button
                  type="button"
                  onClick={handleToggleWebCall}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    webCallStatus === "connecting"
                      ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                      : webCallStatus === "active"
                      ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-xs"
                  }`}
                >
                  {webCallStatus === "connecting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      সংযোগ করা হচ্ছে...
                    </>
                  ) : webCallStatus === "active" ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      ভয়েস চ্যাট বন্ধ করুন (লাইভ)
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      মাইক্রোফোনে কথা বলুন
                    </>
                  )}
                </button>

                {webCallStatus === "active" && (
                  <div className="flex items-center justify-center gap-1.5 py-1 text-[10px] text-green-500 font-extrabold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    এআই শুনছে... কথা বলা শুরু করুন
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
