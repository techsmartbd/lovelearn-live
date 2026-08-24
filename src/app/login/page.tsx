"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Generate deterministic device fingerprint
    let deviceFingerprint = "";
    if (typeof window !== "undefined") {
      const parts = [
        window.navigator.userAgent,
        window.screen.width + "x" + window.screen.height,
        window.navigator.language
      ];
      deviceFingerprint = btoa(unescape(encodeURIComponent(parts.join("||"))));
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, deviceFingerprint }),
      });
      const data = await res.json();

      if (res.ok) {
        // Clear warning popup seen state so it triggers popup on next dashboard load
        localStorage.removeItem("device_warning_seen");
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
      {/* Top right language toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo />
          <p className="text-slate-500 mt-4">{t("loginTitle")}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t("phoneLabel")}</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="017XXXXXXXX" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t("passwordLabel")}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 text-white font-bold bg-primary hover:bg-primary-hover rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Logging in..." : <><LogIn className="w-5 h-5" /> {t("loginBtn")}</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {t("noAccount")} <Link href="/" className="text-primary font-semibold hover:underline">{t("registerNow")}</Link>
        </div>
      </div>
    </div>
  );
}
