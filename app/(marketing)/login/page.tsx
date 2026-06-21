"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    label: "Demo University",
    email: "demo@university.edu",
    password: "polaris2026",
    role: "VP of International Enrollment",
    corridor: "China · Japan · Singapore → US",
    tier: "Professional",
  },
  {
    label: "R1 Pilot Account",
    email: "pilot@r1university.edu",
    password: "polaris2026",
    role: "Director of Admissions",
    corridor: "China → US",
    tier: "Pilot",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    // Demo: any email/password combo works
    router.push("/map");
  }

  function loginAsDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setLoading(true);
    setTimeout(() => router.push("/map"), 800);
  }

  return (
    <div className="min-h-screen bg-[#03071e] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <Link href="/landing" className="mb-8">
        <Logo size="lg" dark />
      </Link>

      <div className="w-full max-w-md">
        {/* Demo accounts */}
        <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-gold-400" />
            <span className="text-gold-400 text-sm font-semibold">Try a demo account</span>
            <span className="text-navy-500 text-xs ml-auto">No signup needed</span>
          </div>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => loginAsDemo(acc)}
                className="w-full text-left p-3 bg-navy-800/60 hover:bg-navy-700/60 border border-navy-700/50 hover:border-gold-400/40 rounded-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-gold-400 transition-colors">{acc.label}</div>
                    <div className="text-navy-400 text-[11px] mt-0.5">{acc.role} · {acc.tier}</div>
                    <div className="text-navy-500 text-[10px] mt-0.5">{acc.corridor}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-navy-600 group-hover:text-gold-400 transition-colors shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-navy-800" />
          <span className="text-navy-600 text-xs">or sign in with email</span>
          <div className="flex-1 h-px bg-navy-800" />
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="bg-navy-900/40 border border-navy-700/50 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-300 block mb-1.5">Work email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu" required
              className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-300 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60 transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-3.5 text-navy-500 hover:text-navy-300 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-3 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-70 flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Signing in...</>
              : <>Sign in <ArrowRight className="w-4 h-4" /></>
            }
          </button>

          <div className="flex items-center justify-between pt-1">
            <Link href="/forgot-password" className="text-xs text-navy-500 hover:text-navy-300 transition-colors">Forgot password?</Link>
            <Link href="/landing#pricing" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
              Request access →
            </Link>
          </div>
        </form>

        <p className="text-center text-navy-600 text-xs mt-6">
          Don't have an account?{" "}
          <Link href="/landing#pricing" className="text-gold-400 hover:text-gold-300 transition-colors">
            Start a pilot →
          </Link>
        </p>
      </div>
    </div>
  );
}
