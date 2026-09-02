"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}

interface Course {
  id: string;
  title: string;
  packageId: string | null;
}

interface Ebook {
  id: string;
  title: string;
  courseId: string | null;
  packageId: string | null;
  isPremium: boolean;
}

interface AccessOverride {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  action: string;
}

export default function UserAccessPage() {
  const [searchPhone, setSearchPhone] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [overrides, setOverrides] = useState<AccessOverride[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  // Fetch all courses and ebooks on mount
  useEffect(() => {
    fetch("/api/admin/courses").then(r => r.json()).then(setCourses).catch(() => {});
    fetch("/api/admin/ebooks").then(r => r.json()).then(setEbooks).catch(() => {});
  }, []);

  // Search users
  const handleSearch = async () => {
    if (!searchPhone.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sessions?search=${encodeURIComponent(searchPhone)}`);
      const data = await res.json();
      // Extract unique users from sessions
      const uniqueUsers = new Map<string, User>();
      if (Array.isArray(data)) {
        data.forEach((s: any) => {
          if (s.user && !uniqueUsers.has(s.user.id)) {
            uniqueUsers.set(s.user.id, s.user);
          }
        });
      }
      setUsers(Array.from(uniqueUsers.values()));
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  };

  // Select user and load their overrides
  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    try {
      const res = await fetch("/api/admin/user-access");
      const data: AccessOverride[] = await res.json();
      setOverrides(data.filter(o => o.userId === user.id));
    } catch (e) {
      setOverrides([]);
    }
  };

  // Get current action for a content item
  const getAction = (contentType: string, contentId: string): string | null => {
    const override = overrides.find(o => o.contentType === contentType && o.contentId === contentId);
    return override ? override.action : null;
  };

  // Toggle access
  const toggleAccess = async (contentType: string, contentId: string, currentAction: string | null) => {
    if (!selectedUser) return;
    const key = `${contentType}-${contentId}`;
    setSaving(key);

    try {
      if (currentAction === "GRANT") {
        // Remove the override (revoke)
        const override = overrides.find(o => o.contentType === contentType && o.contentId === contentId);
        if (override) {
          await fetch(`/api/admin/user-access?id=${override.id}`, { method: "DELETE" });
          setOverrides(prev => prev.filter(o => o.id !== override.id));
        }
      } else {
        // Grant access
        const res = await fetch("/api/admin/user-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser.id,
            contentType,
            contentId,
            action: "GRANT",
          }),
        });
        const newOverride = await res.json();
        setOverrides(prev => [...prev.filter(o => !(o.contentType === contentType && o.contentId === contentId)), newOverride]);
      }
    } catch (e) {
      alert("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ইউজার অ্যাক্সেস কন্ট্রোল</h1>
        <p className="text-sm text-gray-400 mt-1">যেকোনো ইউজারকে যেকোনো কোর্স বা ইবুক লক/আনলক করুন</p>
      </div>

      {/* Search */}
      <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/5">
        <label className="block text-sm font-medium text-gray-300 mb-2">ইউজার খুঁজুন (ফোন নম্বর বা নাম)</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ফোন নম্বর লিখুন..."
            className="flex-1 bg-[#0f0f23] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "খুঁজছি..." : "খুঁজুন"}
          </button>
        </div>

        {/* User list */}
        {users.length > 0 && (
          <div className="mt-4 space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`p-3 rounded-lg cursor-pointer border transition-all ${
                  selectedUser?.id === user.id
                    ? "bg-blue-600/20 border-blue-500"
                    : "bg-[#0f0f23] border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-white font-medium">{user.name || "নাম নেই"}</span>
                <span className="text-gray-400 text-sm ml-3">{user.phone}</span>
                {user.email && <span className="text-gray-500 text-sm ml-3">{user.email}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Access Control Panel */}
      {selectedUser && (
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-bold text-white mb-1">
            {selectedUser.name || selectedUser.phone} — অ্যাক্সেস কন্ট্রোল
          </h2>
          <p className="text-sm text-gray-400 mb-6">টগল করে লক/আনলক করুন</p>

          {/* Courses */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-200 mb-3">কোর্স সমূহ</h3>
            <div className="grid gap-3">
              {courses.map(course => {
                const action = getAction("COURSE", course.id);
                const isGranted = action === "GRANT";
                return (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg border border-white/5">
                    <span className="text-white text-sm">{course.title}</span>
                    <button
                      onClick={() => toggleAccess("COURSE", course.id, action)}
                      disabled={saving === `COURSE-${course.id}`}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isGranted
                          ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-red-600/20 hover:text-red-400"
                          : "bg-gray-600/20 text-gray-400 border border-gray-500/30 hover:bg-green-600/20 hover:text-green-400"
                      } disabled:opacity-50`}
                    >
                      {saving === `COURSE-${course.id}` ? "..." : isGranted ? "🔓 আনলক" : "🔒 লক"}
                    </button>
                  </div>
                );
              })}
              {courses.length === 0 && <p className="text-gray-500 text-sm">কোনো কোর্স পাওয়া যায়নি</p>}
            </div>
          </div>

          {/* Ebooks */}
          <div>
            <h3 className="text-md font-semibold text-gray-200 mb-3">ইবুক সমূহ</h3>
            <div className="grid gap-3">
              {ebooks.map(ebook => {
                const action = getAction("EBOOK", ebook.id);
                const isGranted = action === "GRANT";
                return (
                  <div key={ebook.id} className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg border border-white/5">
                    <div>
                      <span className="text-white text-sm">{ebook.title}</span>
                      {ebook.isPremium && ebook.courseId && (
                        <span className="text-xs text-blue-400 ml-2">(কোর্স ফ্রি)</span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleAccess("EBOOK", ebook.id, action)}
                      disabled={saving === `EBOOK-${ebook.id}`}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isGranted
                          ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-red-600/20 hover:text-red-400"
                          : "bg-gray-600/20 text-gray-400 border border-gray-500/30 hover:bg-green-600/20 hover:text-green-400"
                      } disabled:opacity-50`}
                    >
                      {saving === `EBOOK-${ebook.id}` ? "..." : isGranted ? "🔓 আনলক" : "🔒 লক"}
                    </button>
                  </div>
                );
              })}
              {ebooks.length === 0 && <p className="text-gray-500 text-sm">কোনো ইবুক পাওয়া যায়নি</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
