"use client";
import { useState } from "react";
import { X, Mail, Check, AlertCircle } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function WaitlistModal({ isOpen, onClose, feature = "Engagement Strategy Builder" }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, institution, feature }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setEmail("");
        setInstitution("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-md w-full p-7 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-navy-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">You're on the list!</h2>
            <p className="text-navy-300 text-sm">We'll notify you when {feature} launches.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-2">Get Early Access</h2>
            <p className="text-navy-300 text-sm mb-6">
              Be the first to use <span className="text-gold-400 font-bold">{feature}</span> when it launches.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="your@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-xs">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 text-navy-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Joining...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Notify Me When Live</>
                )}
              </button>
            </form>

            <p className="text-center text-navy-500 text-xs mt-4">
              <span className="text-navy-400">Expected launch: Q3 2026</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
