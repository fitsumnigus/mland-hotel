"use client";

// src/components/admin/AdminLoginClient.tsx
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, Lock } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function AdminLoginClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/admin";

  const [email,    setEmail]    = useState("admin@marklandhotel.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Both fields are required"); return; }
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,160,50,0.04) 0%, transparent 70%)" }} />

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-display text-3xl text-ivory-100 tracking-[0.08em]">Markland</p>
          <p className="eyebrow text-2xs text-champagne-600 tracking-[0.4em] mt-0.5">Hotel & Spa</p>
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-champagne-700/40 to-transparent" />
          <p className="eyebrow text-xs text-obsidian-500 tracking-widest mt-4">STAFF ACCESS</p>
        </div>

        {/* Card */}
        <div className="border border-obsidian-700 bg-obsidian-900/60 backdrop-blur-sm p-8">
          <h1 className="font-display text-2xl text-ivory-100 mb-1">Sign In</h1>
          <p className="font-body text-sm text-obsidian-500 mb-7">Access the hotel management system</p>

          {error && (
            <motion.div
              className="flex items-center gap-3 border border-red-700/40 bg-red-900/10 px-4 py-3 mb-5 text-sm text-red-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="border border-obsidian-700 bg-obsidian-900/40 px-4 py-3 focus-within:border-champagne-700/60 transition-colors">
              <label className="eyebrow text-2xs text-champagne-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="bg-transparent font-body text-sm text-ivory-200 placeholder:text-obsidian-600 focus:outline-none w-full"
                placeholder="admin@marklandhotel.com"
              />
            </div>

            {/* Password */}
            <div className="border border-obsidian-700 bg-obsidian-900/40 px-4 py-3 focus-within:border-champagne-700/60 transition-colors">
              <label className="eyebrow text-2xs text-champagne-700 block mb-1.5">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="bg-transparent font-body text-sm text-ivory-200 placeholder:text-obsidian-600 focus:outline-none flex-1"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-obsidian-500 hover:text-obsidian-300 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-body text-sm tracking-[0.12em] uppercase transition-all duration-300 btn-luxury-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Signing in…</>
                : <><Lock size={13} /> Sign In</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-obsidian-800">
            <p className="text-2xs text-obsidian-600 text-center leading-relaxed">
              Demo credentials: admin@marklandhotel.com / Markland2024!
            </p>
          </div>
        </div>

        <p className="text-center text-2xs text-obsidian-700 mt-5">
          Markland Hotel & Spa · Management System
        </p>
      </motion.div>
    </div>
  );
}
