"use client";
import { useState } from "react";
import { X, Mail, Check, AlertCircle, ArrowRight } from "lucide-react";

interface EnhancedContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedContactForm({ isOpen, onClose }: EnhancedContactFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    institution: "",
    interestedIn: "" as string,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStep("success");
      setTimeout(() => {
        onClose();
        setStep("form");
        setForm({
          name: "",
          email: "",
          institution: "",
          interestedIn: "",
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error submitting form");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-navy-900 border border-navy-700 rounded-xl max-w-md w-full p-6 relative max-h-[85vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-navy-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "success" ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Demo Request Received!</h2>
            <p className="text-navy-300 mb-6">
              We'll be in touch within 24 hours to schedule your personalized demo of Polaris.
            </p>
            <p className="text-navy-400 text-sm">Confirmation sent to <span className="font-semibold">{form.email}</span></p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-black text-white mb-1">Request a Demo</h2>
              <p className="text-navy-300 text-sm">We'll show you how Polaris works in 20 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-navy-300 block mb-1">Your Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-navy-300 block mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@university.edu"
                  className="w-full px-3 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-navy-300 block mb-1">Institution *</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  required
                  placeholder="State University"
                  className="w-full px-3 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-navy-300 block mb-1">Interested In *</label>
                <select
                  value={form.interestedIn}
                  onChange={(e) => setForm({ ...form, interestedIn: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="">Select...</option>
                  <option value="Opportunity Scoring">Opportunity Scoring</option>
                  <option value="Competitive Intelligence">Competitive Intelligence</option>
                  <option value="Strategic Planning">Strategic Planning</option>
                  <option value="ROI Calculator">ROI Calculator</option>
                  <option value="Outcome Tracking">Outcome Tracking</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-xs">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !form.email || !form.email.includes('@')}
                className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 disabled:cursor-not-allowed text-navy-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <>Schedule Demo <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-navy-500 text-xs">
                We'll follow up within 24 hours.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
