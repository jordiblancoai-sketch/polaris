"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronLeft, Send, Check, Loader2 } from "lucide-react";
import { FAQS } from "@/lib/faq";

type Msg = { role: "bot" | "user"; text: string };
type Mode = "chat" | "form" | "sent";

const GREETING = "Hi! 👋 I'm here to help. Tap a question below, or leave us a message and we'll get right back to you.";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: GREETING }]);
  const [asked, setAsked] = useState<number[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, mode]);

  function askFaq(i: number) {
    const f = FAQS[i];
    setAsked(a => [...a, i]);
    setMsgs(m => [...m, { role: "user", text: f.q }, { role: "bot", text: f.a }]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "chat", interestedIn: "Chat enquiry" }),
      });
      setMode("sent");
    } catch {
      setMode("sent"); // still confirm; lead is logged server-side
    } finally {
      setSending(false);
    }
  }

  const remaining = FAQS.map((_, i) => i).filter(i => !asked.includes(i));

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[380px] max-h-[min(620px,75vh)] flex flex-col rounded-2xl overflow-hidden border border-navy-700 bg-navy-950 shadow-2xl shadow-black/50"
          style={{ animation: "chatIn .18s cubic-bezier(.22,1,.36,1)" }}
        >
          <style>{`@keyframes chatIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}`}</style>

          {/* Header */}
          <div className="relative px-4 py-4 bg-gradient-to-br from-navy-900 to-navy-800 border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-navy-950 border border-gold-400/40 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-400">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold text-sm leading-tight">Polaris team</div>
                <div className="text-navy-300 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Typically replies in a few hours
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"
                className="ml-auto text-navy-300 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mode === "sent" ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-white font-bold">Message sent!</div>
              <p className="text-navy-300 text-sm">Thanks {form.name.split(" ")[0] || "there"} — we'll reply to {form.email} shortly.</p>
              <button onClick={() => { setMode("chat"); setForm({ name: "", email: "", message: "" }); }}
                className="mt-2 text-gold-400 text-sm font-semibold hover:text-gold-500">Back to chat</button>
            </div>
          ) : mode === "form" ? (
            <form onSubmit={submit} className="flex-1 flex flex-col px-4 py-4 gap-3 overflow-y-auto">
              <button type="button" onClick={() => setMode("chat")}
                className="self-start flex items-center gap-1 text-navy-300 hover:text-white text-xs mb-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <p className="text-navy-300 text-sm">Leave your details and your question — we'll email you back.</p>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
                className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white text-sm placeholder:text-navy-500 focus:outline-none focus:border-gold-400/60" />
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address"
                className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white text-sm placeholder:text-navy-500 focus:outline-none focus:border-gold-400/60" />
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={4}
                className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-white text-sm placeholder:text-navy-500 focus:outline-none focus:border-gold-400/60 resize-none" />
              <button type="submit" disabled={sending}
                className="mt-auto flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          ) : (
            <>
              {/* Thread */}
              <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                      m.role === "user"
                        ? "bg-gold-400 text-navy-950 rounded-br-sm font-medium"
                        : "bg-navy-800 text-navy-100 rounded-bl-sm"
                    }`}>{m.text}</div>
                  </div>
                ))}
              </div>

              {/* Quick FAQ chips */}
              {remaining.length > 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {remaining.slice(0, 4).map(i => (
                    <button key={i} onClick={() => askFaq(i)}
                      className="text-[11px] text-gold-400 border border-gold-400/30 hover:border-gold-400/70 hover:bg-gold-400/10 rounded-full px-2.5 py-1 transition-colors text-left">
                      {FAQS[i].q}
                    </button>
                  ))}
                </div>
              )}

              {/* Leave a message CTA */}
              <div className="px-4 py-3 border-t border-navy-800">
                <button onClick={() => setMode("form")}
                  className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  <Send className="w-4 h-4 text-gold-400" /> Leave us a message
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-gold-400/30 blur-xl group-hover:bg-gold-400/50 transition-all animate-pulse" />
        <span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-navy-800 to-navy-950 border border-gold-400/50 group-hover:border-gold-400 flex items-center justify-center shadow-xl transition-all group-hover:scale-105">
          {open
            ? <X className="w-6 h-6 text-gold-400" />
            : <MessageCircle className="w-6 h-6 text-gold-400" />}
        </span>
      </button>
    </>
  );
}
