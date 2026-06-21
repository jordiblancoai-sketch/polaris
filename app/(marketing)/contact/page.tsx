"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Check, Mail, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", institution: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending message. Please try emailing directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03071e] flex flex-col items-center justify-center p-6">
      <Link href="/landing" className="mb-8"><Logo size="lg" dark /></Link>
      <div className="w-full max-w-lg bg-navy-900/50 border border-navy-700/50 rounded-2xl p-7">
        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Thanks, {form.name || "there"}!</h1>
            <p className="text-navy-300 text-sm">We've received your message and will reply to <span className="text-gold-400">{form.email}</span> within one business day.</p>
            <Link href="/landing" className="inline-block mt-6 text-sm text-gold-400 hover:text-gold-300">← Back to home</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-white mb-1">Talk to us</h1>
            <p className="text-navy-300 text-sm mb-6">Request a demo or ask anything about Polaris.</p>
            <form onSubmit={submit} className="space-y-4">
              {[
                { k: "name", label: "Your name", type: "text", ph: "Jane Smith" },
                { k: "email", label: "Work email", type: "email", ph: "jane@university.edu" },
                { k: "institution", label: "Institution", type: "text", ph: "State University" },
              ].map(f => (
                <div key={f.k}>
                  <label className="text-sm font-medium text-navy-300 block mb-1.5">{f.label}</label>
                  <input required type={f.type} placeholder={f.ph}
                    value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-navy-300 block mb-1.5">Message</label>
                <textarea required rows={4} placeholder="I'd like a demo for our international office…"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 text-navy-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Send message</>
                )}
              </button>
            </form>
            <p className="text-center text-navy-600 text-xs mt-5">Or email us directly at <a href="mailto:hello@polaris.io" className="text-gold-400">hello@polaris.io</a></p>
          </>
        )}
      </div>
    </div>
  );
}
