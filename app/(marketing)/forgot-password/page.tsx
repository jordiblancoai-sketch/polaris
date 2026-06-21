"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Check, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#03071e] flex flex-col items-center justify-center p-6">
      <Link href="/landing" className="mb-8"><Logo size="lg" dark /></Link>
      <div className="w-full max-w-md bg-navy-900/50 border border-navy-700/50 rounded-2xl p-7">
        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Check your inbox</h1>
            <p className="text-navy-300 text-sm">If an account exists for <span className="text-gold-400">{email}</span>, we've sent a reset link.</p>
            <Link href="/login" className="inline-block mt-6 text-sm text-gold-400 hover:text-gold-300">← Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-white mb-1">Reset your password</h1>
            <p className="text-navy-300 text-sm mb-6">Enter your work email and we'll send you a reset link.</p>
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <input required type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              <button type="submit" className="w-full bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                Send reset link <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-navy-600 text-xs mt-5"><Link href="/login" className="text-gold-400 hover:text-gold-300">← Back to sign in</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
