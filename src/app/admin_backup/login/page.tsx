"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = data.redirectUrl || "/admin";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Admin <span className="text-primary">Panel</span></h1>
          <p className="text-slate-400 mt-2">Secure Login</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number (Admin)</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="017XXXXXXXX" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 text-white font-bold bg-primary hover:bg-primary-hover rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : <><LogIn className="w-5 h-5" /> Login to Dashboard</>}
          </button>
        </form>
      </div>
    </div>
  );
}
