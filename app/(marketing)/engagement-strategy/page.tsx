"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Check, Mail, AlertCircle, ChevronRight, Lock, Sparkles } from "lucide-react";

export default function EngagementStrategyPage() {
  const [step, setStep] = useState<"coming-soon" | "form" | "success" | "subscribed">("coming-soon");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeInstitution, setSubscribeInstitution] = useState("");
  const [form, setForm] = useState({
    email: "",
    institution: "",
    corridor: "",
    budget: "",
    timeline: "",
    regions: "",
    currentEnrollment: "",
    priorExperience: "",
    formats: [] as string[],
    targetStudents: [] as string[],
    alumniNetworks: "",
    competitors: "",
    primaryGoal: "",
    partnershipBudget: "",
  });

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscribeEmail,
          institution: subscribeInstitution,
          feature: "engagement-strategy",
        }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      setStep("subscribed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const corridors = ["China", "Japan", "Singapore", "Multiple corridors"];
  const budgetOptions = ["$10k–25k", "$25k–50k", "$50k–100k", "$100k+"];
  const timelines = ["Immediate (0–3 months)", "Medium-term (3–6 months)", "Long-term (6–12 months)", "12+ months"];
  const formatsOptions = ["Alumni events", "School visits", "Education fairs", "I-FiT workshops", "Bilingual programs", "Direct recruitment", "Roadshows"];
  const studentProfiles = ["STEM", "Business", "Engineering", "Liberal Arts", "Graduate/MBA", "All programs"];
  const alumniOptions = ["Strong networks", "Partial networks", "Minimal networks", "No networks"];
  const goals = ["Maximize enrollments", "Brand awareness & presence", "Market entry", "Alumni activation", "Regional expansion"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/engagement-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to generate strategy");

      const data = await res.json();
      // TODO: Download or display PDF
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating strategy. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const toggleFormat = (fmt: string) => {
    setForm(prev => ({
      ...prev,
      formats: prev.formats.includes(fmt) ? prev.formats.filter(f => f !== fmt) : [...prev.formats, fmt]
    }));
  };

  const toggleStudent = (profile: string) => {
    setForm(prev => ({
      ...prev,
      targetStudents: prev.targetStudents.includes(profile) ? prev.targetStudents.filter(p => p !== profile) : [...prev.targetStudents, profile]
    }));
  };

  return (
    <div className="min-h-screen bg-[#03071e] flex flex-col items-center justify-center p-6">
      <Link href="/landing" className="mb-8">
        <Logo size="lg" dark />
      </Link>

      <div className="w-full max-w-2xl bg-navy-900/50 border border-navy-700/50 rounded-2xl p-7">
        {step === "coming-soon" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-400/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Coming Soon</h1>
            <p className="text-gold-400 text-sm font-bold mb-6">Engagement Strategy Builder</p>
            <p className="text-navy-300 mb-8 text-sm leading-relaxed">
              Generate personalized recruitment strategies tailored to your institution, budget, and goals. <span className="block mt-3 text-xs text-navy-400">Launching Q3 2026 for Professional tier and above</span>
            </p>

            <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-6 mb-8 text-left">
              <p className="text-white font-bold text-sm mb-4">Your strategy will include:</p>
              <ul className="text-navy-300 text-sm space-y-2.5">
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold">✓</span>
                  <span>Personalized recruitment plan for your target regions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold">✓</span>
                  <span>Month-by-month execution timeline</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold">✓</span>
                  <span>Detailed budget breakdown & cost per enrollment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold">✓</span>
                  <span>Competitive intelligence for your targets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold">✓</span>
                  <span>Enrollment projections & success KPIs</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-6 mb-8">
              <p className="text-white font-bold text-sm mb-4">Get Early Access</p>
              <p className="text-navy-300 text-xs mb-5">Join our waitlist and be the first to build your strategy.</p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@university.edu"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-emerald-400/60"
                />
                <input
                  type="text"
                  placeholder="Your Institution"
                  value={subscribeInstitution}
                  onChange={(e) => setSubscribeInstitution(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-emerald-400/60"
                />
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Joining...</>
                  ) : (
                    <><Mail className="w-4 h-4" /> Notify Me When Live</>
                  )}
                </button>
              </form>
            </div>

            <p className="text-navy-500 text-xs">
              <span className="text-navy-400 font-bold">Professional tier feature:</span> Available to $25k/yr subscribers and above
            </p>
          </div>
        )}

        {step === "subscribed" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">You're on the List!</h1>
            <p className="text-navy-300 mb-8 text-sm leading-relaxed">
              We'll notify <span className="text-gold-400 font-bold">{subscribeEmail}</span> as soon as the Engagement Strategy Builder launches.
            </p>
            <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-6 mb-8">
              <p className="text-white font-bold text-sm mb-2">In the meantime:</p>
              <ul className="text-navy-300 text-sm space-y-2 text-left">
                <li>✓ Explore Polaris regional scores</li>
                <li>✓ View competitive intelligence</li>
                <li>✓ Download methodology & case studies</li>
              </ul>
            </div>
            <Link href="/landing" className="inline-block w-full bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-3 rounded-xl transition-all mb-4">
              Back to Polaris
            </Link>
            <p className="text-navy-500 text-xs">Expected launch: Q3 2026</p>
          </div>
        )}

        {step === "form" && (
          <>
            <h1 className="text-2xl font-black text-white mb-1">Build Your Strategy</h1>
            <p className="text-navy-300 text-sm mb-7">Answer these questions and we'll generate a personalized recruitment plan.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Q1: Corridor */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">1. Which corridor(s) are you targeting?</label>
                <div className="space-y-2">
                  {corridors.map(c => (
                    <label key={c} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="corridor" value={c} checked={form.corridor === c} onChange={e => setForm({...form, corridor: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2: Budget */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">2. Total annual recruitment budget for Asia?</label>
                <div className="space-y-2">
                  {budgetOptions.map(b => (
                    <label key={b} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="budget" value={b} checked={form.budget === b} onChange={e => setForm({...form, budget: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q3: Timeline */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">3. Timeline for first results?</label>
                <div className="space-y-2">
                  {timelines.map(t => (
                    <label key={t} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="timeline" value={t} checked={form.timeline === t} onChange={e => setForm({...form, timeline: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q4: Regions */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">4. How many regions do you want to activate?</label>
                <input type="text" placeholder="e.g., Beijing, Shanghai, Wuhan" value={form.regions} onChange={e => setForm({...form, regions: e.target.value})} required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q5: Current Enrollment */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">5. Current annual enrollment from these regions?</label>
                <input type="number" placeholder="e.g., 25" value={form.currentEnrollment} onChange={e => setForm({...form, currentEnrollment: e.target.value})} required
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q6: Prior Experience */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">6. Have you recruited in Asia before?</label>
                <div className="space-y-2">
                  {["Yes, actively", "Yes, minimal", "No, first time"].map(exp => (
                    <label key={exp} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="experience" value={exp} checked={form.priorExperience === exp} onChange={e => setForm({...form, priorExperience: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q7: Engagement Formats */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">7. Which engagement formats have you used? (select all that apply)</label>
                <div className="space-y-2">
                  {formatsOptions.map(fmt => (
                    <label key={fmt} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="checkbox" checked={form.formats.includes(fmt)} onChange={() => toggleFormat(fmt)} className="mr-3" />
                      <span className="text-white text-sm">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q8: Target Students */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">8. Target student profile? (select all that apply)</label>
                <div className="space-y-2">
                  {studentProfiles.map(profile => (
                    <label key={profile} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="checkbox" checked={form.targetStudents.includes(profile)} onChange={() => toggleStudent(profile)} className="mr-3" />
                      <span className="text-white text-sm">{profile}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q9: Alumni Networks */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">9. Alumni network presence in your target regions?</label>
                <div className="space-y-2">
                  {alumniOptions.map(opt => (
                    <label key={opt} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="alumni" value={opt} checked={form.alumniNetworks === opt} onChange={e => setForm({...form, alumniNetworks: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q10: Competitors */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">10. Who are your main competitors in these regions?</label>
                <textarea placeholder="e.g., Harvard, Stanford, MIT, UC Berkeley..." value={form.competitors} onChange={e => setForm({...form, competitors: e.target.value})} required rows={3}
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q11: Primary Goal */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">11. Primary goal for this initiative?</label>
                <div className="space-y-2">
                  {goals.map(goal => (
                    <label key={goal} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="goal" value={goal} checked={form.primaryGoal === goal} onChange={e => setForm({...form, primaryGoal: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q12: Partnership Budget */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">12. Do you have budget for external partnerships?</label>
                <div className="space-y-2">
                  {["Yes, up to 20% of budget", "Yes, up to 50% of budget", "Maybe, depends on value", "No, DIY only"].map(opt => (
                    <label key={opt} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="partnership" value={opt} checked={form.partnershipBudget === opt} onChange={e => setForm({...form, partnershipBudget: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-navy-700 pt-6">
                <p className="text-navy-300 text-xs mb-4">Your information (to send your strategy)</p>
                <div>
                  <label className="text-sm font-medium text-navy-300 block mb-1.5">Work email</label>
                  <input type="email" placeholder="you@university.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                    className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60 mb-4" />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-300 block mb-1.5">Institution</label>
                  <input type="text" placeholder="State University" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} required
                    className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 text-navy-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Generating strategy...</>
                ) : (
                  <>Generate My Strategy <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Strategy Generated!</h1>
            <p className="text-navy-300 mb-6 text-sm">Your personalized recruitment strategy has been sent to <span className="text-gold-400 font-bold">{form.email}</span></p>
            <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-6 mb-8 text-left">
              <p className="text-white font-bold text-sm mb-3">Your report includes:</p>
              <ul className="text-navy-300 text-sm space-y-2">
                <li>✓ Month-by-month execution timeline</li>
                <li>✓ Detailed budget breakdown</li>
                <li>✓ Competitor intel for your regions</li>
                <li>✓ Projected enrollment & success metrics</li>
              </ul>
            </div>
            <Link href="/landing" className="inline-block text-sm text-gold-400 hover:text-gold-300">
              ← Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
