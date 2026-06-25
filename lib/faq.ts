// Shared FAQ content — used by the landing FAQ section and the chat widget.
export interface FaqItem { q: string; a: string }

export const FAQS: FaqItem[] = [
  {
    q: "What exactly is Polaris?",
    a: "Polaris is a recruitment-intelligence platform for universities. It scores every region inside a country — provinces, prefectures, states — by how likely your recruiting spend there converts into enrolled students, so you target the best markets before booking a single flight.",
  },
  {
    q: "Where does Polaris get its data?",
    a: "We combine authoritative public datasets — IIE Open Doors enrollment flows, U.S. Department of State F-1 visa statistics, World Bank economics, UNESCO mobility trends and EF English Proficiency — with live web signals collected and refreshed continuously. Every input is a verifiable, citable source, never a black box.",
  },
  {
    q: "How is each region scored?",
    a: "Every province, prefecture or state gets a 0–100 yield-probability score built from six weighted dimensions: Student Demand, Economic ability-to-pay, Academic readiness, Corridor strength (visa approval + travel access), Competitive white space, and Migration intent. The score estimates how likely your recruiting spend in that region converts to actual enrolled students.",
  },
  {
    q: "How often is the data updated?",
    a: "Scores are recomputed nightly. As visa policy, economic conditions and competitor activity shift through the recruiting cycle, your map stays current — so you're never planning a trip on last year's assumptions.",
  },
  {
    q: "Which corridors are covered?",
    a: "China, Japan, South Korea, India and Singapore → United States are live today, covering 130+ scored regions. Additional source and destination corridors are added on request as part of a pilot.",
  },
  {
    q: "Can I see why a region scores the way it does?",
    a: "Yes. Click any region for a full transparent breakdown — the six score dimensions, the key insight, risk flags, the optimal visit window and recommended partner schools. You can show your provost exactly why one province outperforms another. No black boxes.",
  },
  {
    q: "How accurate are the scores?",
    a: "Scores are calibrated against historical enrollment and visa outcomes, and every dimension is traceable to its source. The goal isn't a crystal ball — it's a defensible, transparent ranking that beats gut feel and outdated relationships.",
  },
  {
    q: "How is this different from buying a list or using an agent?",
    a: "Lists and agents tell you who to contact. Polaris tells you where to invest and why — with transparent scoring you can defend to leadership. It actually makes agents more effective by pointing them at the highest-yield regions instead of the usual saturated cities.",
  },
  {
    q: "What does the ROI Planner do?",
    a: "Enter your budget, trip length and the countries you'll visit, and it builds an optimal multi-country itinerary across the highest-yield regions — with projected enrollments, cost per enrollment, and dollars saved versus your historical spend. You can export the whole plan as a PDF for your CFO.",
  },
  {
    q: "Can I plan a trip across more than one country?",
    a: "Yes. In the ROI Planner you can select any combination of the live corridors — say China + Japan + Singapore — and Polaris routes the top regions across all of them into one budget-optimized itinerary.",
  },
  {
    q: "How much does it cost?",
    a: "Two plans: Starter at $9k/year and Professional at $25k/year. Most teams recover the cost from a single better-targeted recruiting trip. The best way to see the value is to run a pilot on your own numbers first.",
  },
  {
    q: "Is there a free trial or pilot?",
    a: "Yes — the live demo needs no signup, and you can run a pilot on a single corridor. We scope the markets that matter to your institution and have you exploring real scores the same week.",
  },
  {
    q: "Who is Polaris for?",
    a: "International enrollment teams, admissions offices and recruitment agencies — anyone deciding where to spend limited travel and marketing budget to enroll more international students.",
  },
  {
    q: "Can I add my own countries or corridors?",
    a: "Yes. Five corridors are live now, and we add new source or destination countries on request as part of a pilot — so we can build out exactly the markets your institution recruits in.",
  },
  {
    q: "Can my whole team use it?",
    a: "Yes — multiple team members share one workspace, including saved trips and reports, so admissions, leadership and finance all work from the same numbers.",
  },
  {
    q: "Is my data private and GDPR-compliant?",
    a: "Yes. Polaris is built privacy-first and is GDPR-compliant. Scoring relies on aggregated public datasets and web signals — not personal student records — so there's no sensitive student data to manage.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Polaris is fully web-based and works on any device. Sign in, pick a corridor, and start exploring — no software, no setup, no IT ticket.",
  },
  {
    q: "How do I get started?",
    a: "Start a pilot on a single corridor or request a 15-minute live demo — no signup required. We'll scope the corridors that matter to your institution and have you exploring real scores the same week.",
  },
];

// The landing page shows a curated subset; the chat widget offers them all.
export const LANDING_FAQS: FaqItem[] = FAQS.slice(0, 8);
