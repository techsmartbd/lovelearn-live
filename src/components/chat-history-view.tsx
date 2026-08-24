"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  User, 
  Bot, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  FileText, 
  Terminal, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface Message {
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  conversationId: string;
  title: string;
  startedAt: string;
  lastAt: string;
  messages: Message[];
}

export default function ChatHistoryView() {
  const [data, setData] = useState<{
    updatedAt: string;
    totalMessages: number;
    totalSessions: number;
    conversations: Conversation[];
    markdownContent: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"interactive" | "markdown">("interactive");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/chat-history");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        if (json.data.conversations?.length > 0 && !selectedSessionId) {
          setSelectedSessionId(json.data.conversations[0].conversationId);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredConversations = data?.conversations?.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.conversationId.toLowerCase().includes(q) ||
      c.messages.some(m => m.content.toLowerCase().includes(q))
    );
  }) || [];

  const activeConversation = data?.conversations?.find(c => c.conversationId === selectedSessionId) || filteredConversations[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-center bg-white dark:bg-[#0B0F17] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <RefreshCw className="w-10 h-10 text-[#ff0000] animate-spin mb-4" />
        <h3 className="text-lg font-black text-slate-900 dark:text-white">চ্যাট হিস্ট্রি লোড হচ্ছে...</h3>
        <p className="text-xs text-slate-500 mt-1">Antigravity Brain transcripts স্ক্যান করে পূর্ববর্তী সমস্ত সেশন লোড করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-red-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0000]/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-black mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Antigravity Persistent Brain History
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              স্বয়ংক্রিয় চ্যাট হিস্ট্রি ও সেশন লগ
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl font-medium">
              পিসি রিস্টার্ট বা সেশন রিসেট হলেও Antigravity-এর সমস্ত কথোপকথন ও কোডিং হিস্ট্রি ড্যাশবোর্ডে সুরক্ষিত আছে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchHistory(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "সিঙ্ক হচ্ছে..." : "হিস্ট্রি সিঙ্ক করুন"}
            </button>

            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode("interactive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === "interactive" ? "bg-[#ff0000] text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                সেশন চ্যাট
              </button>
              <button
                onClick={() => setViewMode("markdown")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === "markdown" ? "bg-[#ff0000] text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Markdown History
              </button>
            </div>
          </div>
        </div>

        {/* Analytics stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-left">
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">মোট মেসেজ</div>
            <div className="text-xl font-black text-white mt-0.5">{data?.totalMessages || 0}টি</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">মোট সেশন</div>
            <div className="text-xl font-black text-white mt-0.5">{data?.totalSessions || 0}টি</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">সর্বশেষ আপডেট</div>
            <div className="text-xs font-black text-emerald-400 mt-1">
              {data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "এখনই"}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">স্ট্যাটাস</div>
            <div className="text-xs font-black text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ১০০% সুরক্ষিত
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "interactive" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sessions List */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0B0F17] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xl space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="সেশন বা মেসেজ ফিল্টার করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff0000]"
              />
            </div>

            <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-2">
              পূর্ববর্তী সেশনসমূহ ({filteredConversations.length})
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredConversations.map((conv) => {
                const isSelected = activeConversation?.conversationId === conv.conversationId;
                const dt = new Date(conv.startedAt);
                const dateFormatted = dt.getTime() > 0 ? dt.toLocaleDateString("bn-BD", { month: "short", day: "numeric" }) : "পূর্ববর্তী";
                const timeFormatted = dt.getTime() > 0 ? dt.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }) : "";

                return (
                  <button
                    key={conv.conversationId}
                    onClick={() => setSelectedSessionId(conv.conversationId)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#ff0000]/10 border-[#ff0000] text-[#ff0000] shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        ID: {conv.conversationId.substring(0, 8)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {dateFormatted} {timeFormatted}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mt-2 leading-relaxed">
                      {conv.title || "নতুন কথোপকথন"}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-red-500" /> {conv.messages.length}টি বার্তা
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 font-bold">
                  কোনো মিল পাওয়া সেশন নেই।
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation Viewer */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0B0F17] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
            {activeConversation ? (
              <>
                {/* Active Session Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        সেশন: <span className="font-mono text-red-500">{activeConversation.conversationId}</span>
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-500 rounded-md">
                        {activeConversation.messages.length} মেসেজ
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      শুরু: {new Date(activeConversation.startedAt).toLocaleString("bn-BD")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(JSON.stringify(activeConversation, null, 2), "session-json")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 shrink-0"
                  >
                    {copiedId === "session-json" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === "session-json" ? "কপি হয়েছে!" : "JSON কপি করুন"}
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
                  {activeConversation.messages.map((msg, idx) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex gap-3 text-left ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                          isUser 
                            ? "bg-red-500 text-white" 
                            : "bg-slate-900 dark:bg-slate-800 text-cyan-400 border border-slate-700"
                        }`}>
                          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                          isUser
                            ? "bg-gradient-to-br from-red-600 to-red-700 text-white rounded-tr-none shadow-md"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-800"
                        }`}>
                          <div className="flex items-center justify-between text-[10px] opacity-75 font-bold pb-1 border-b border-white/10 dark:border-slate-800">
                            <span>{isUser ? "আপনি (User)" : "Antigravity (AI Assistant)"}</span>
                            <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                          </div>

                          <div className="whitespace-pre-wrap font-sans break-words text-[13px]">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 font-bold">
                কোনো সেশন সিলেক্ট করা হয়নি।
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Markdown Raw File View */
        <div className="bg-white dark:bg-[#0B0F17] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ff0000]" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                C:\laragon\www\landing\chat_history\history.md (সম্পূর্ণ ডকুমেন্ট)
              </h3>
            </div>

            <button
              onClick={() => handleCopy(data?.markdownContent || "", "full-md")}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold bg-[#ff0000] text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
            >
              {copiedId === "full-md" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === "full-md" ? "কপি হয়েছে!" : "সম্পূর্ণ Markdown কপি করুন"}
            </button>
          </div>

          <pre className="w-full p-5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto max-h-[650px] leading-relaxed border border-slate-800 whitespace-pre-wrap break-words">
            {data?.markdownContent || "কোনো মার্কডাউন ডেটা পাওয়া যায়নি।"}
          </pre>
        </div>
      )}
    </div>
  );
}
