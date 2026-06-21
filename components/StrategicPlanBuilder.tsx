"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

export function StrategicPlanBuilder() {
  const [step, setStep] = useState<"intro" | "questions" | "report">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    { id: "institution", type: "text", label: "Institution Name", placeholder: "Your University" },
    { id: "current_enrollment", type: "number", label: "Current annual international enrollment", placeholder: "e.g., 150" },
    { id: "enrollment_target", type: "number", label: "Target international enrollment (3-year goal)", placeholder: "e.g., 300" },
    { id: "budget_annual", type: "text", label: "Annual international recruitment budget", options: ["$25k–50k", "$50k–100k", "$100k–250k", "$250k+"] },
    { id: "corridors_priority", type: "checkbox", label: "Priority corridors", options: ["China", "Japan", "Singapore", "Southeast Asia", "India", "Brazil", "Europe"] },
    { id: "programs_offered", type: "checkbox", label: "Program types offering international admission", options: ["STEM (Physics, Engineering, CS)", "Business/MBA", "Liberal Arts", "Medicine/Health Sciences", "Graduate Research", "Law", "All Programs"] },
    { id: "stem_capacity", type: "radio", label: "Can you deliver STEM content in Mandarin or with bilingual support?", options: ["Yes, we have bilingual faculty", "Yes, with external instructors", "No, English only", "Exploring options"] },
    { id: "alumni_network", type: "radio", label: "Alumni network strength in target regions", options: ["Strong (100+ active alumni)", "Moderate (20-100 alumni)", "Minimal (under 20)", "None identified"] },
    { id: "alumni_engagement", type: "radio", label: "Current alumni engagement in recruitment", options: ["Very active (monthly events)", "Moderate (quarterly events)", "Minimal (ad-hoc)", "Not leveraged"] },
    { id: "recruitment_experience", type: "radio", label: "International recruitment experience in Asia", options: ["Extensive (5+ years, active programs)", "Moderate (2-5 years, ongoing)", "New (under 2 years)", "No prior experience"] },
    { id: "formats_tried", type: "checkbox", label: "Engagement formats you've used", options: ["Alumni events/dinners", "High school visits", "Education fairs/expos", "I-FiT workshops", "Roadshows", "Direct agent recruitment", "Digital/virtual events", "None of above"] },
    { id: "team_size", type: "radio", label: "International admissions team size", options: ["1 person", "2-3 people", "4-6 people", "7+ people"] },
    { id: "travel_frequency", type: "radio", label: "Current recruitment travel frequency to Asia", options: ["Monthly or more", "Quarterly", "Annually", "Ad-hoc", "None"] },
    { id: "strategic_priority", type: "radio", label: "Primary strategic goal", options: ["Maximize enrollments and revenue", "Expand into new regions", "Improve student quality/selectivity", "Increase alumni engagement", "Build long-term partnerships"] },
    { id: "decision_timeline", type: "text", label: "Timeline for major recruitment decisions", placeholder: "e.g., Q3 2026" },
    { id: "budget_allocation", type: "text", label: "Budget allocated specifically for engagement programming (vs travel)", options: ["0-25%", "25-50%", "50-75%", "75%+"] },
    { id: "challenges_main", type: "checkbox", label: "Main recruitment challenges", options: ["Visa complications", "Language barriers", "High competition from peers", "Limited regional presence", "Budget constraints", "Difficulty measuring ROI", "Alumni involvement"] },
    { id: "success_metrics", type: "checkbox", label: "How do you measure success?", options: ["# of applications", "# enrolled students", "Student quality/GPA", "Cost per enrollment", "Alumni network growth", "Regional market share", "Enrollment yield rate"] },
    { id: "faculty_involvement", type: "radio", label: "Faculty interest in recruitment support", options: ["High (multiple departments)", "Moderate (some departments)", "Low (limited interest)", "Not explored"] },
    { id: "student_testimonials", type: "radio", label: "Do you have current student testimonials/success stories from target regions?", options: ["Yes, well documented", "Yes, but scattered", "Limited", "None"] },
  ];

  function handleAnswer(questionId: string, value: any) {
    setAnswers({ ...answers, [questionId]: value });
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("report");
    }
  }

  function handlePrev() {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="bg-gradient-to-b from-navy-950 to-navy-900 py-24 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {step === "intro" && (
          <div className="text-center py-12">
            <h2 className="text-4xl font-black text-white mb-4">Strategic Recruitment Plan</h2>
            <p className="text-navy-300 text-lg mb-6">
              Answer 20 targeted questions about your institution and we'll generate your personalized 3-year recruitment strategy — including recommended corridors, engagement formats, timelines, and projected outcomes.
            </p>
            <p className="text-navy-400 text-sm mb-10">
              Based on proven engagement models from leading universities and the Amiata engagement framework.
            </p>
            <button
              onClick={() => setStep("questions")}
              className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              Start Assessment <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === "questions" && (
          <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gold-400">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm text-navy-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <label className="text-xl font-bold text-white block mb-6">{q.label}</label>

              {q.type === "text" && (
                <input
                  type="text"
                  placeholder={q.placeholder || ""}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:border-gold-400"
                />
              )}

              {q.type === "number" && (
                <input
                  type="number"
                  placeholder={q.placeholder || ""}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800/60 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:border-gold-400"
                />
              )}

              {q.type === "radio" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer transition">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "checkbox" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center p-3 bg-navy-800/40 border border-navy-700 rounded-lg hover:border-gold-400/50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={answers[q.id]?.includes(opt) || false}
                        onChange={(e) => {
                          const curr = answers[q.id] || [];
                          if (e.target.checked) {
                            handleAnswer(q.id, [...curr, opt]);
                          } else {
                            handleAnswer(q.id, curr.filter((x: string) => x !== opt));
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-white text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="flex-1 px-6 py-3 border border-navy-700 text-navy-300 font-semibold rounded-lg hover:border-gold-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? "Generate Plan" : "Next"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === "report" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Your Strategic Recruitment Plan</h2>
                  <p className="text-navy-300">{answers.institution || "Your Institution"}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-emerald-400 shrink-0" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-navy-800/40 rounded-lg p-4">
                  <p className="text-navy-400 text-xs font-semibold mb-1">Current Enrollment</p>
                  <p className="text-2xl font-black text-gold-400">{answers.current_enrollment || "—"}</p>
                </div>
                <div className="bg-navy-800/40 rounded-lg p-4">
                  <p className="text-navy-400 text-xs font-semibold mb-1">3-Year Target</p>
                  <p className="text-2xl font-black text-gold-400">{answers.enrollment_target || "—"}</p>
                </div>
                <div className="bg-navy-800/40 rounded-lg p-4">
                  <p className="text-navy-400 text-xs font-semibold mb-1">Annual Budget</p>
                  <p className="text-2xl font-black text-gold-400">{answers.budget_annual || "—"}</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-white mb-6">Recommended Strategy</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-gold-400 font-bold mb-3">🎯 Priority Corridors</h4>
                  <p className="text-navy-300 mb-3">
                    Based on your program offerings and budget, focus on: <span className="text-white font-semibold">{answers.corridors_priority?.join(", ") || "China, Japan, Singapore"}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-gold-400 font-bold mb-3">📋 Engagement Format Roadmap</h4>
                  <div className="space-y-3">
                    <div className="bg-navy-800/30 rounded-lg p-4 border-l-2 border-gold-400">
                      <p className="text-white font-semibold mb-1">Q1: Alumni Activation</p>
                      <p className="text-navy-300 text-sm">Bilingual alumni focus groups + mentorship program launch in {answers.corridors_priority?.[0] || "priority region"}. Budget: $3-5k</p>
                    </div>
                    <div className="bg-navy-800/30 rounded-lg p-4 border-l-2 border-gold-400">
                      <p className="text-white font-semibold mb-1">Q2: I-FiT Workshops</p>
                      <p className="text-navy-300 text-sm">Host {answers.programs_offered?.includes("STEM (Physics, Engineering, CS)") ? "Physics & Engineering" : "program-specific"} workshops with bilingual faculty. Target 40-60 student participants. Budget: $5-8k</p>
                    </div>
                    <div className="bg-navy-800/30 rounded-lg p-4 border-l-2 border-gold-400">
                      <p className="text-white font-semibold mb-1">Q3-Q4: Roadshow & School Visits</p>
                      <p className="text-navy-300 text-sm">Multi-city recruitment roadshow + direct school partnerships. Integrate alumni and current student testimonials. Budget: $6-10k</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-gold-400 font-bold mb-3">📊 Projected 3-Year Outcomes</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4">
                      <p className="text-emerald-400 text-sm font-semibold mb-1">Enrollment Lift</p>
                      <p className="text-2xl font-black text-white">+45-65%</p>
                      <p className="text-navy-300 text-xs mt-2">From {answers.current_enrollment || "baseline"} → {Math.round((answers.enrollment_target || answers.current_enrollment || 100) * 0.6)} students</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                      <p className="text-blue-400 text-sm font-semibold mb-1">Cost Per Enrollment</p>
                      <p className="text-2xl font-black text-white">$185-$350</p>
                      <p className="text-navy-300 text-xs mt-2">vs industry avg $1,200-2,500</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-gold-400 font-bold mb-3">⏱️ 12-Month Timeline</h4>
                  <div className="bg-navy-800/30 rounded-lg p-4 space-y-3">
                    <div className="flex gap-4">
                      <div className="text-gold-400 font-bold w-20">Month 1-3</div>
                      <div className="text-navy-300">Build alumni engagement framework. Launch alumni focus groups in {answers.corridors_priority?.[0] || "priority region"}.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-gold-400 font-bold w-20">Month 4-6</div>
                      <div className="text-navy-300">I-FiT workshops with bilingual faculty. Establish school partnerships. Document outcomes.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-gold-400 font-bold w-20">Month 7-12</div>
                      <div className="text-navy-300">Roadshow execution across regions. Student/alumni testimonial collection. Plan Year 2 expansion.</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-gold-400 font-bold mb-3">✅ Success Metrics to Track</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {["# Students Engaged", "# Applications Received", "# Admitted Students", "Cost Per Enrollment", "Alumni Event Attendance", "Faculty Participation Rate", "Conversion Rate", "Regional Market Share"].map(m => (
                      <div key={m} className="flex items-center gap-2 text-navy-300 text-sm">
                        <div className="w-2 h-2 rounded-full bg-gold-400" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gold-400/10 border border-gold-400/50 rounded-2xl p-8">
              <h3 className="text-xl font-black text-white mb-4">Next Steps</h3>
              <ol className="space-y-3 text-navy-300">
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold shrink-0">1.</span>
                  <span>Confirm priority corridors and regions in Polaris Opportunity Map</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold shrink-0">2.</span>
                  <span>Review competitive landscape and white-space opportunities</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold shrink-0">3.</span>
                  <span>Set up outcome tracking in Polaris to measure engagement effectiveness</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400 font-bold shrink-0">4.</span>
                  <span>Schedule quarterly strategy reviews to adjust based on real outcomes</span>
                </li>
              </ol>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => {
                  setStep("intro");
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="px-8 py-4 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-lg transition border border-navy-700"
              >
                Create Another Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
