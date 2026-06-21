"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, Gift, Lock, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/Footer";

export default function StrategicPlanPage() {
  const [step, setStep] = useState<"intro" | "questions" | "report">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    { id: "institution", type: "text", label: "Institution Name", placeholder: "Your University" },
    { id: "current_enrollment", type: "number", label: "Current annual international enrollment", placeholder: "e.g., 150" },
    { id: "enrollment_target_3yr", type: "number", label: "Target international enrollment in 3 years", placeholder: "e.g., 400" },
    { id: "budget_annual", type: "text", label: "Annual international recruitment budget", options: ["$25k–50k", "$50k–100k", "$100k–250k", "$250k–500k", "$500k+"] },
    { id: "corridors_priority", type: "checkbox", label: "Priority corridors", options: ["China", "Japan", "Singapore", "Southeast Asia (Vietnam, Thailand, Indonesia)", "India", "Brazil", "Mexico", "Europe (UK, Germany, France)"] },
    { id: "programs_offered", type: "checkbox", label: "Program types", options: ["STEM (Physics, Engineering, CS)", "Business/MBA", "Liberal Arts", "Medicine/Health Sciences", "Law", "Graduate Research", "All Programs", "Other"] },
    { id: "stem_bilingual", type: "radio", label: "Can you deliver STEM content in Mandarin or with bilingual support?", options: ["Yes, we have bilingual faculty", "Yes, with external instructors", "No, English only", "Exploring options"] },
    { id: "alumni_network_strength", type: "radio", label: "Alumni network strength in target regions", options: ["Strong (100+ active alumni)", "Moderate (20-100 alumni)", "Minimal (under 20)", "None identified"] },
    { id: "alumni_engagement_level", type: "radio", label: "Current alumni engagement in recruitment", options: ["Very active (monthly events)", "Moderate (quarterly events)", "Minimal (ad-hoc)", "Not leveraged"] },
    { id: "recruitment_experience", type: "radio", label: "International recruitment experience in Asia", options: ["Extensive (5+ years, active programs)", "Moderate (2-5 years, ongoing)", "New (under 2 years)", "No prior experience"] },
    { id: "team_size", type: "radio", label: "International admissions team size", options: ["1 person", "2-3 people", "4-6 people", "7+ people"] },
    { id: "travel_frequency", type: "radio", label: "Current recruitment travel frequency to Asia", options: ["Monthly or more", "Quarterly", "Annually", "Ad-hoc", "None"] },
    { id: "formats_tried", type: "checkbox", label: "Engagement formats you've used", options: ["Alumni events/dinners", "High school visits", "Education fairs/expos", "I-FiT workshops", "Roadshows", "Direct agent recruitment", "Digital/virtual events", "None of above"] },
    { id: "student_demographics", type: "checkbox", label: "Current student demographics from target regions", options: ["STEM-focused", "Business/MBA", "Undergrad liberal arts", "Graduate research", "Mixed"] },
    { id: "faculty_involvement_capacity", type: "radio", label: "Faculty interest in recruitment support", options: ["High (multiple departments)", "Moderate (some departments)", "Low (limited interest)", "Not explored"] },
    { id: "current_student_testimonials", type: "radio", label: "Do you have current student testimonials/success stories?", options: ["Yes, well documented", "Yes, but scattered", "Limited", "None"] },
    { id: "marketing_materials", type: "radio", label: "Do you have translated marketing materials (Mandarin/Japanese)?", options: ["Yes, comprehensive", "Yes, partial", "No, planning to create", "No plans"] },
    { id: "agent_relationships", type: "radio", label: "Relationships with recruitment agents in target regions", options: ["Strong (3+ active agents)", "Some (1-2 agents)", "Exploring", "None"] },
    { id: "strategic_priority", type: "radio", label: "Primary strategic goal", options: ["Maximize enrollments and revenue", "Expand into new regions", "Improve student quality/selectivity", "Increase alumni engagement", "Build long-term regional partnerships"] },
    { id: "decision_timeline", type: "text", label: "Timeline for major recruitment decisions (e.g., Q3 2026)", placeholder: "e.g., Q3 2026" },
    { id: "budget_allocation_engagement", type: "text", label: "% of budget for engagement (vs travel/agents)", options: ["0-25%", "25-50%", "50-75%", "75%+"] },
    { id: "challenges_main", type: "checkbox", label: "Main recruitment challenges", options: ["Visa complications", "Language barriers", "High competition", "Limited regional presence", "Budget constraints", "Difficulty measuring ROI", "Alumni involvement", "Faculty engagement"] },
    { id: "success_metrics", type: "checkbox", label: "How do you measure success?", options: ["# of applications", "# enrolled students", "Student quality/GPA", "Cost per enrollment", "Alumni network growth", "Regional market share", "Enrollment yield rate", "Retention rates"] },
    { id: "compliance_requirements", type: "radio", label: "Are there specific compliance/visa requirements you need to track?", options: ["Yes, strict requirements", "Yes, but manageable", "No major issues", "Not sure"] },
    { id: "competitor_activity", type: "radio", label: "Do you track competitor recruitment activity?", options: ["Yes, actively", "Yes, occasionally", "No", "Not sure what to track"] },
    { id: "student_support_services", type: "radio", label: "Support services for international students", options: ["Comprehensive (housing, visa, language, mentoring)", "Moderate (some services)", "Limited", "Minimal"] },
    { id: "scholarship_availability", type: "radio", label: "Available scholarship funding for international students", options: ["Abundant", "Moderate", "Limited", "Minimal/Merit-based only"] },
    { id: "partnership_interests", type: "checkbox", label: "Interested in partnerships with", options: ["Universities in target regions", "Alumni-led initiatives", "Local recruitment firms", "Bilingual facilitators", "Student ambassador programs"] },
    { id: "reporting_cadence", type: "radio", label: "How often do you review recruitment strategy?", options: ["Monthly", "Quarterly", "Annually", "Ad-hoc"] },
    { id: "additional_context", type: "textarea", label: "Any additional context about your institution or goals?" },
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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing"><Logo size="md" /></Link>
          {step === "intro" ? (
            <Link href="/landing" className="text-sm text-gray-600 hover:text-navy-900">← Back to home</Link>
          ) : (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to exit? Your answers will not be saved.")) {
                  setStep("intro");
                  setCurrentQuestion(0);
                  setAnswers({});
                }
              }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" /> Close
            </button>
          )}
        </div>
      </nav>

      {step === "intro" && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2 mb-8">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-bold">FREE STRATEGIC PLAN</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-6">
              Your 3-Year International Recruitment Strategy
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Answer 30 questions about your institution and get a comprehensive, personalized strategic plan — <span className="text-emerald-600 font-bold">completely free</span>.
            </p>
            <p className="text-gray-500 mb-12 text-lg">
              Includes: market analysis, 12-month roadmap, budget framework, competitor intelligence, and success metrics.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">Questions</p>
                  <p className="text-3xl font-black text-navy-900">30</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">Report Pages</p>
                  <p className="text-3xl font-black text-navy-900">8+</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">Timeline</p>
                  <p className="text-3xl font-black text-navy-900">3 Years</p>
                </div>
              </div>
              <button
                onClick={() => setStep("questions")}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center justify-center gap-2 text-lg"
              >
                Build My Strategic Plan <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h3 className="font-bold text-gray-900 mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Institution & market analysis</li>
                  <li>✓ 12-month engagement roadmap</li>
                  <li>✓ Budget recommendations by quarter</li>
                  <li>✓ Competitor landscape analysis</li>
                  <li>✓ 3-year enrollment projections</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h3 className="font-bold text-gray-900 mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Success metrics & KPIs</li>
                  <li>✓ Risk assessment</li>
                  <li>✓ Alumni engagement strategy</li>
                  <li>✓ Faculty involvement plan</li>
                  <li>✓ Implementation checklist</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === "questions" && (
        <section className="bg-white py-12 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-navy-900 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <label className="text-2xl font-bold text-gray-900 block mb-6">{q.label}</label>

              {q.type === "text" && (
                <input
                  type="text"
                  placeholder={q.placeholder || ""}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                />
              )}

              {q.type === "number" && (
                <input
                  type="number"
                  placeholder={q.placeholder || ""}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                />
              )}

              {q.type === "radio" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-navy-900 cursor-pointer transition">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-900 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "checkbox" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-navy-900 cursor-pointer transition">
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
                      <span className="text-gray-900 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "textarea" && (
                <textarea
                  placeholder="Optional..."
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? "Generate Plan" : "Next"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {step === "report" && (
        <section className="bg-gray-50 py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Strategic Recruitment Plan</h2>
                  <p className="text-gray-600">{answers.institution || "Your Institution"}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-lg px-4 py-2">
                  <Gift className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-bold">FREE</span>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-semibold mb-1">Current Enrollment</p>
                  <p className="text-2xl font-black text-navy-900">{answers.current_enrollment || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-semibold mb-1">3-Year Target</p>
                  <p className="text-2xl font-black text-navy-900">{answers.enrollment_target_3yr || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-semibold mb-1">Annual Budget</p>
                  <p className="text-2xl font-black text-navy-900">{answers.budget_annual || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-semibold mb-1">Corridors</p>
                  <p className="text-lg font-black text-navy-900">{answers.corridors_priority?.length || "—"}</p>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">1. Market Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Current Position</h4>
                  <p className="text-gray-600">
                    Your institution currently enrolls approximately {answers.current_enrollment || "X"} international students annually.
                    With a target of {answers.enrollment_target_3yr || "Y"} in 3 years, you're aiming for a {answers.enrollment_target_3yr && answers.current_enrollment ? Math.round((answers.enrollment_target_3yr - answers.current_enrollment) / answers.current_enrollment * 100) : "—"}% growth rate.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Target Corridors</h4>
                  <p className="text-gray-600">
                    Focus regions: {answers.corridors_priority?.join(", ") || "China, Japan, Singapore"}. These markets offer strong enrollment potential, manageable competition, and alignment with your program offerings.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Competitive Landscape</h4>
                  <p className="text-gray-600">
                    Key challenges: {answers.challenges_main?.slice(0, 3).join(", ") || "visa complications, language barriers, high competition"}. Your strategy must address these directly through targeted engagement and differentiation.
                  </p>
                </div>
              </div>
            </div>

            {/* Year 1 Roadmap */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">2. Year 1 Quarterly Roadmap</h3>
              <div className="space-y-4">
                {[
                  { q: "Q1", title: "Foundation & Planning", activities: "Establish alumni engagement framework. Identify key partnerships. Launch bilingual content development." },
                  { q: "Q2", title: "Activation & Outreach", activities: "I-FiT workshops with bilingual faculty. School partnership launches. Career fair participation." },
                  { q: "Q3", title: "Roadshow & Events", activities: "Multi-city roadshow across target regions. Student ambassador program launch. Alumni dinner series." },
                  { q: "Q4", title: "Review & Planning", activities: "Enrollment outcome tracking. Strategy review & adjustments. Year 2 goal-setting." },
                ].map(qtr => (
                  <div key={qtr.q} className="border-l-4 border-navy-900 pl-4 py-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900">{qtr.q}: {qtr.title}</h4>
                      <span className="text-navy-900 font-bold text-sm">est. ${Math.round((parseInt(answers.budget_annual?.replace(/\D/g, '') || 25) / 4))}k</span>
                    </div>
                    <p className="text-gray-600 text-sm">{qtr.activities}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Framework */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">3. 3-Year Budget Framework</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Year 1</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Year 2</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Year 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "Alumni Events", y1: "15%", y2: "18%", y3: "20%" },
                      { cat: "I-FiT Workshops", y1: "20%", y2: "22%", y3: "20%" },
                      { cat: "Roadshows", y1: "18%", y2: "20%", y3: "22%" },
                      { cat: "Digital & Content", y1: "12%", y2: "12%", y3: "15%" },
                      { cat: "Agent Partnerships", y1: "20%", y2: "18%", y3: "15%" },
                      { cat: "Faculty Travel", y1: "15%", y2: "10%", y3: "8%" },
                    ].map(row => (
                      <tr key={row.cat} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900 font-semibold">{row.cat}</td>
                        <td className="py-3 px-4 text-gray-600">{row.y1}</td>
                        <td className="py-3 px-4 text-gray-600">{row.y2}</td>
                        <td className="py-3 px-4 text-gray-600">{row.y3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">4. Success Metrics & KPIs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {["# Students Engaged", "# Applications Received", "# Enrolled Students", "Cost Per Enrollment", "Alumni Event Attendance", "Faculty Participation Rate", "Conversion Rate (Apps → Admits)", "Yield Rate (Admits → Enrolled)"].map(m => (
                  <div key={m} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-navy-900" />
                    <span className="text-gray-900 font-semibold text-sm">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA - HOOK FOR PAID */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8 text-white">
              <div className="flex gap-6 items-start">
                <div className="shrink-0">
                  <Lock className="w-8 h-8 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-3">Ready to Execute This Plan?</h3>
                  <p className="text-white/80 mb-6">
                    <strong>This strategic plan is FREE</strong> and gives you a roadmap to follow. But executing it requires real-time insights into which regions are performing, which competitors are active, and how your investments are paying off.
                  </p>
                  <div className="space-y-3 mb-8">
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-gold-400 font-bold">+</span> <span><strong>Polaris Opportunity Map</strong> shows you the best regions to target in real-time</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-gold-400 font-bold">+</span> <span><strong>Competitive Intelligence</strong> alerts you when competitors move into your regions</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-gold-400 font-bold">+</span> <span><strong>Outcome Tracking</strong> measures which engagement formats actually drive enrollment</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-gold-400 font-bold">+</span> <span><strong>ROI Calculator</strong> optimizes your travel budget and itineraries</span>
                    </p>
                  </div>
                  <button onClick={() => window.location.href = "/landing"} className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold py-3 px-6 rounded-lg transition-all">
                    See How Polaris Powers This Plan <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Create Another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setStep("intro");
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Create Another Plan
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
