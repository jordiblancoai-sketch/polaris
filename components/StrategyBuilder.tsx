"use client";
import { useState } from "react";
import { ChevronRight, AlertCircle, Download, Sparkles } from "lucide-react";

export function StrategyBuilder() {
  const [step, setStep] = useState<"intro" | "form" | "generating" | "success">("intro");
  const [loading, setLoading] = useState(false);
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

  const corridors = ["China", "Japan", "Singapore", "Multiple corridors"];
  const budgetOptions = ["$10k–25k", "$25k–50k", "$50k–100k", "$100k+"];
  const timelines = ["Immediate (0–3 months)", "Medium-term (3–6 months)", "Long-term (6–12 months)", "12+ months"];
  const formatsOptions = ["Alumni events", "School visits", "Education fairs", "I-FiT workshops", "Bilingual programs", "Direct recruitment", "Roadshows"];
  const studentProfiles = ["STEM", "Business", "Engineering", "Liberal Arts", "Graduate/MBA", "All programs"];
  const alumniOptions = ["Strong networks", "Partial networks", "Minimal networks", "No networks"];
  const goals = ["Maximize enrollments", "Brand awareness & presence", "Market entry", "Alumni activation", "Regional expansion"];

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

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStep("generating");

    try {
      const res = await fetch("/api/engagement-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to generate");
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-navy-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {step === "intro" && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/50 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-xs font-bold">Interactive Demo</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Build Your Strategy Now</h2>
            <p className="text-navy-300 text-lg max-w-2xl mx-auto mb-10">
              Answer 12 quick questions about your institution and we'll generate your personalized recruitment strategy — including timeline, budget, and projected enrollments.
            </p>
            <button
              onClick={() => setStep("form")}
              className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              Start Building <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === "form" && (
          <div className="bg-navy-900/50 border border-navy-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-black text-white mb-6">Recruitment Strategy Builder</h3>
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Q1: Corridor */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">1. Which corridor(s) are you targeting?</label>
                <div className="space-y-2">
                  {corridors.map(c => (
                    <label key={c} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="corridor" value={c} checked={form.corridor === c} onChange={e => setForm({...form, corridor: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2: Budget */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">2. Annual recruitment budget for Asia?</label>
                <div className="space-y-2">
                  {budgetOptions.map(b => (
                    <label key={b} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
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
                    <label key={t} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="timeline" value={t} checked={form.timeline === t} onChange={e => setForm({...form, timeline: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q4: Regions */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">4. Which regions? (comma-separated)</label>
                <input type="text" placeholder="e.g., Beijing, Shanghai, Wuhan" value={form.regions} onChange={e => setForm({...form, regions: e.target.value})} required
                  className="w-full px-4 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q5: Current Enrollment */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">5. Current annual enrollment from these regions?</label>
                <input type="number" placeholder="e.g., 25" value={form.currentEnrollment} onChange={e => setForm({...form, currentEnrollment: e.target.value})} required
                  className="w-full px-4 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q6: Prior Experience */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">6. Have you recruited in Asia before?</label>
                <div className="space-y-2">
                  {["Yes, actively", "Yes, minimal", "No, first time"].map(exp => (
                    <label key={exp} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="experience" value={exp} checked={form.priorExperience === exp} onChange={e => setForm({...form, priorExperience: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q7: Engagement Formats */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">7. Which engagement formats have you used? (select all)</label>
                <div className="space-y-2">
                  {formatsOptions.map(fmt => (
                    <label key={fmt} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="checkbox" checked={form.formats.includes(fmt)} onChange={() => toggleFormat(fmt)} className="mr-3" />
                      <span className="text-white text-sm">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q8: Target Students */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">8. Target student profile? (select all)</label>
                <div className="space-y-2">
                  {studentProfiles.map(profile => (
                    <label key={profile} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="checkbox" checked={form.targetStudents.includes(profile)} onChange={() => toggleStudent(profile)} className="mr-3" />
                      <span className="text-white text-sm">{profile}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q9: Alumni Networks */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">9. Alumni network presence?</label>
                <div className="space-y-2">
                  {alumniOptions.map(opt => (
                    <label key={opt} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="alumni" value={opt} checked={form.alumniNetworks === opt} onChange={e => setForm({...form, alumniNetworks: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q10: Competitors */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">10. Main competitors in these regions?</label>
                <textarea placeholder="e.g., Harvard, Stanford, MIT, UC Berkeley..." value={form.competitors} onChange={e => setForm({...form, competitors: e.target.value})} required rows={2}
                  className="w-full px-4 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              {/* Q11: Primary Goal */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">11. Primary goal?</label>
                <div className="space-y-2">
                  {goals.map(goal => (
                    <label key={goal} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="goal" value={goal} checked={form.primaryGoal === goal} onChange={e => setForm({...form, primaryGoal: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q12: Partnership Budget */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">12. Budget for external partnerships?</label>
                <div className="space-y-2">
                  {["Yes, up to 20% of budget", "Yes, up to 50% of budget", "Maybe, depends on value", "No, DIY only"].map(opt => (
                    <label key={opt} className="flex items-center p-2 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer">
                      <input type="radio" name="partnership" value={opt} checked={form.partnershipBudget === opt} onChange={e => setForm({...form, partnershipBudget: e.target.value})} className="mr-3" required />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-navy-700 pt-6">
                <p className="text-navy-300 text-xs mb-4">Your information (for your report)</p>
                <input type="email" placeholder="your@university.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                  className="w-full px-4 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60 mb-3" />
                <input type="text" placeholder="Your Institution" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} required
                  className="w-full px-4 py-2 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 text-sm focus:outline-none focus:border-gold-400/60" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-60 text-navy-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Generating...</>
                ) : (
                  <>Generate My Strategy <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        )}

        {step === "generating" && (
          <div className="text-center py-16">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gold-400/30 border-t-gold-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Generating Your Report</h3>
            <p className="text-navy-300">Analyzing your responses and creating your personalized 4-page strategy...</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Download className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Strategy Ready!</h3>
            <p className="text-navy-300 mb-8 max-w-md mx-auto">
              Your personalized recruitment strategy PDF is ready. It includes month-by-month timeline, budget breakdown, competitor intel, and enrollment projections.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setStep("intro");
                  setForm({ email: "", institution: "", corridor: "", budget: "", timeline: "", regions: "", currentEnrollment: "", priorExperience: "", formats: [], targetStudents: [], alumniNetworks: "", competitors: "", primaryGoal: "", partnershipBudget: "" });
                }}
                className="px-6 py-3 border border-gold-400 text-gold-400 font-bold rounded-lg hover:bg-gold-400/10 transition-all"
              >
                Build Another Strategy
              </button>
              <button onClick={() => window.location.href = "/"} className="px-6 py-3 bg-gold-400 text-navy-950 font-bold rounded-lg hover:bg-gold-500 transition-all">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
