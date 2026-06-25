// Shared FAQ content — used by the landing FAQ section and the chat widget.
export interface FaqItem { q: string; a: string }

export const FAQS: FaqItem[] = [
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
    q: "Do I need to install anything?",
    a: "No. Polaris is fully web-based and works on any device. Sign in, pick a corridor, and start exploring — no software, no setup, no IT ticket.",
  },
  {
    q: "How do I get started?",
    a: "Start a pilot on a single corridor or request a 15-minute live demo — no signup required. We'll scope the corridors that matter to your institution and have you exploring real scores the same week.",
  },
];
