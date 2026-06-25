"use client";
import { cn } from "@/lib/utils";
import { Zap, AlertTriangle, Users, School, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const RESOURCE_COLORS: Record<string, string> = {
  low:    "text-emerald-600 bg-emerald-50 border-emerald-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  high:   "text-red-600 bg-red-50 border-red-200",
};

// Static engagement playbook data keyed by province name (mirrors backend seed data)
const PLAYBOOKS: Record<string, {
  executiveSummary: string;
  recommendations: Array<{
    formatName: string;
    conversionLift: number;
    effectivenessScore: number;
    resourceIntensity: string;
    leadTimeDays: number;
    reason: string;
    action: string;
    timing: string;
    partnerOpportunities: string[];
    universityAssetLeveraged: string | null;
    projectedEnrolled: number;
  }>;
  avoid: Array<{ formatName: string; reason: string }>;
  assetsInRegion: Array<{ assetType: string; name: string | null; count: number | null; programFocus: string | null }>;
  projectedWithStrategy: number;
  projectedColdVisit: number;
  liftMultiplier: number;
}> = {
  "Zhejiang": {
    executiveSummary: "Zhejiang scores 82/100. Lead with Partner School Direct Visit — projects 12 enrolled students vs. 4.0 on a cold visit (3.0× lift). You have 8 existing business alumni in Hangzhou to leverage.",
    projectedWithStrategy: 12.0, projectedColdVisit: 4.0, liftMultiplier: 3.0,
    assetsInRegion: [{ assetType: "alumni_network", name: "Hangzhou Alumni Chapter", count: 8, programFocus: "Business" }],
    recommendations: [
      { formatName: "Partner School Direct Visit", conversionLift: 2.8, effectivenessScore: 91, resourceIntensity: "low", leadTimeDays: 21, reason: "Hangzhou No.2 and Ningbo Xiaoshi High School are elite feeder schools with active college counselors. Pre-existing relationships convert at 3× cold visits.", action: "Contact college counselors at Hangzhou No.2 High School 3 weeks before your trip.", timing: "October–November", partnerOpportunities: ["Hangzhou No.2 High School", "Ningbo Xiaoshi High School", "Wenzhou No.22 Middle School"], universityAssetLeveraged: null, projectedEnrolled: 12.0 },
      { formatName: "Alumni Networking Event", conversionLift: 3.2, effectivenessScore: 88, resourceIntensity: "medium", leadTimeDays: 45, reason: "8 business alumni in Hangzhou tech sector (Alibaba effect). Zhejiang families respond strongly to career outcome data.", action: "Contact alumni office — pull Hangzhou alumni list from 2018–2024.", timing: "October–November", partnerOpportunities: [], universityAssetLeveraged: "8 Business alumni in this region", projectedEnrolled: 10.5 },
      { formatName: "Family Information Session", conversionLift: 2.1, effectivenessScore: 84, resourceIntensity: "medium", leadTimeDays: 30, reason: "Zhejiang families are data-driven. Show salary outcomes by field, not just rankings. Tech sector placements are highly valued.", action: "Prepare salary outcome data by field. Translate key slides to simplified Chinese.", timing: "October–November", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 8.2 },
    ],
    avoid: [],
  },
  "Hubei": {
    executiveSummary: "Hubei scores 73/100. Lead with Alumni Networking Event — you have 14 STEM alumni in Wuhan, the most underutilized asset in your portfolio. Projects 15 enrolled vs. 3.0 cold (5.0× lift).",
    projectedWithStrategy: 15.0, projectedColdVisit: 3.0, liftMultiplier: 5.0,
    assetsInRegion: [{ assetType: "alumni_network", name: "Wuhan Alumni Chapter", count: 14, programFocus: "STEM" }],
    recommendations: [
      { formatName: "Alumni Networking Event", conversionLift: 4.2, effectivenessScore: 94, resourceIntensity: "medium", leadTimeDays: 45, reason: "14 STEM alumni in Wuhan — largest concentrated asset in your portfolio. Wuhan has a huge high-school graduating class and only 110 US universities recruiting. Your alumni dinner will be one of very few happening.", action: "Contact alumni office IMMEDIATELY — pull Wuhan alumni database, 2015–2024 graduates.", timing: "October–November (post Gaokao scores)", partnerOpportunities: ["Wuhan Foreign Languages School college night (Nov)", "Huazhong University-Affiliated High School"], universityAssetLeveraged: "14 STEM alumni identified in Wuhan (2015–2024 graduates)", projectedEnrolled: 15.0 },
      { formatName: "Partner School Direct Visit", conversionLift: 2.8, effectivenessScore: 88, resourceIntensity: "low", leadTimeDays: 21, reason: "Wuhan Foreign Languages School is elite — only 3 US universities visited last year. Book immediately for November.", action: "Book Wuhan Foreign Languages School college night (November). Contact counselor now.", timing: "October–November", partnerOpportunities: ["Wuhan Foreign Languages School", "Wuhan No.2 High School", "Huazhong University Affiliated High School"], universityAssetLeveraged: null, projectedEnrolled: 10.0 },
      { formatName: "Scholarship Announcement Event", conversionLift: 2.5, effectivenessScore: 80, resourceIntensity: "low", leadTimeDays: 14, reason: "Middle-income academic families. Merit scholarships are extremely effective — these families WANT to send their child abroad but cost is the barrier.", action: "Coordinate with financial aid office. Create a 'Hubei Excellence Scholarship' announcement.", timing: "September–October", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 8.5 },
    ],
    avoid: [],
  },
  "Beijing": {
    executiveSummary: "Beijing scores 28/100 — not a targeting priority. If you go, do NOT use school fairs (95% saturated, 380 competitors). Alumni events and WeChat campaigns are the only viable formats. Expected yield is very low.",
    projectedWithStrategy: 4.5, projectedColdVisit: 1.5, liftMultiplier: 3.0,
    assetsInRegion: [],
    recommendations: [
      { formatName: "WeChat / Xiaohongshu Campaign", conversionLift: 1.6, effectivenessScore: 82, resourceIntensity: "medium", leadTimeDays: 21, reason: "Xiaohongshu is dominant here. Beijing students are extremely online. Authentic student content outperforms institutional marketing 5:1.", action: "Set up Xiaohongshu account. Post authentic student content about your campus city.", timing: "Year-round, peak Sep–Nov", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 4.5 },
      { formatName: "Family Information Session", conversionLift: 2.1, effectivenessScore: 65, resourceIntensity: "medium", leadTimeDays: 30, reason: "Sophisticated audience. Skip the basics — go deep on grad school placement rates, research opportunities, faculty connections.", action: "Prepare a research-focused presentation. Invite faculty to join virtually.", timing: "October–November", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 3.5 },
    ],
    avoid: [
      { formatName: "University Fair / Education Expo", reason: "95% market saturation — 380 US universities already here. You will be one of 80 booths. Zero ROI." },
    ],
  },
  "Shanghai": {
    executiveSummary: "Shanghai scores 26/100 — lowest in the dataset. Enrollment declining -7% YoY. If you invest here, focus only on WeChat/Xiaohongshu and avoid fairs entirely.",
    projectedWithStrategy: 3.5, projectedColdVisit: 1.0, liftMultiplier: 3.5,
    assetsInRegion: [],
    recommendations: [
      { formatName: "WeChat / Xiaohongshu Campaign", conversionLift: 1.6, effectivenessScore: 85, resourceIntensity: "medium", leadTimeDays: 21, reason: "Highest Xiaohongshu engagement in China. Video content of campus life and city exploration performs best.", action: "Post campus city lifestyle content targeting Shanghai users on Xiaohongshu.", timing: "Year-round", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 3.5 },
    ],
    avoid: [
      { formatName: "University Fair / Education Expo", reason: "94% saturation. Cost per lead is 4× higher than inland cities. Avoid entirely." },
    ],
  },
  "Sichuan": {
    executiveSummary: "Sichuan scores 74/100. Lead with Scholarship Announcement — inland families are financially motivated. 6 Chengdu alumni to leverage. Projects 11 enrolled vs. 3.0 cold (3.7× lift).",
    projectedWithStrategy: 11.0, projectedColdVisit: 3.0, liftMultiplier: 3.7,
    assetsInRegion: [{ assetType: "alumni_network", name: "Chengdu Alumni Chapter", count: 6, programFocus: "Business" }],
    recommendations: [
      { formatName: "Scholarship Announcement Event", conversionLift: 2.5, effectivenessScore: 85, resourceIntensity: "low", leadTimeDays: 14, reason: "Sichuan is inland — international tuition is a real stretch. Scholarship events are the #1 converter here. Make financial aid numbers front and center.", action: "Create a 'Sichuan Excellence Scholarship.' Post on WeChat 2 weeks before event.", timing: "September–October", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 11.0 },
      { formatName: "Alumni Networking Event", conversionLift: 3.2, effectivenessScore: 88, resourceIntensity: "medium", leadTimeDays: 45, reason: "Chengdu is the fastest-growing metro in China. 6 business alumni available. Alumni events here have a startup energy.", action: "Contact 6 Chengdu business alumni. Host in a Chengdu hotpot restaurant — food culture matters here.", timing: "October–November", partnerOpportunities: [], universityAssetLeveraged: "6 Business alumni in Chengdu", projectedEnrolled: 9.5 },
      { formatName: "WeChat / Xiaohongshu Campaign", conversionLift: 1.6, effectivenessScore: 85, resourceIntensity: "medium", leadTimeDays: 21, reason: "Chengdu is China's social media capital. Lifestyle content (pandas, food, culture) from your campus city performs extremely well.", action: "Post panda-themed campus content on Xiaohongshu targeting Chengdu/Sichuan users.", timing: "Year-round", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 7.0 },
    ],
    avoid: [],
  },
  // ─── Japan ───────────────────────────────────────────────
  "Kyoto": {
    executiveSummary: "Kyoto scores 78/100. Lead with University Partnership / MOU — Kyoto University and Doshisha feed top US grad programs. You have 9 alumni in the Kansai academic network. Projects 9 enrolled vs. 2.0 cold (4.5× lift).",
    projectedWithStrategy: 9.0, projectedColdVisit: 2.0, liftMultiplier: 4.5,
    assetsInRegion: [{ assetType: "alumni_network", name: "Kansai Academic Alumni", count: 9, programFocus: "Research / STEM" }],
    recommendations: [
      { formatName: "University Partnership / MOU", conversionLift: 3.4, effectivenessScore: 92, resourceIntensity: "medium", leadTimeDays: 60, reason: "Japan is a relationship-led market — formal MOUs with Kyoto University and Doshisha unlock vetted, high-intent applicants. Decisions are institutional, not individual.", action: "Open MOU discussions with Kyoto University's international office 2 months ahead.", timing: "September–November", partnerOpportunities: ["Kyoto University", "Doshisha University", "Ritsumeikan"], universityAssetLeveraged: "9 alumni in the Kansai academic network", projectedEnrolled: 9.0 },
      { formatName: "English Pathway / Test-Prep Partnership", conversionLift: 2.6, effectivenessScore: 86, resourceIntensity: "medium", leadTimeDays: 45, reason: "English proficiency is the #1 barrier in Japan. Co-branded TOEFL/IELTS pathway programs remove the single biggest friction point.", action: "Partner with a Kyoto eikaiwa / prep school to co-host a pathway info session.", timing: "Sep–Nov", partnerOpportunities: ["ECC Kyoto", "Kyoto IB schools"], universityAssetLeveraged: null, projectedEnrolled: 6.5 },
      { formatName: "Alumni Networking Event", conversionLift: 3.0, effectivenessScore: 83, resourceIntensity: "medium", leadTimeDays: 45, reason: "Kansai alumni carry strong social proof. Japanese families weigh peer outcomes heavily before committing to overseas study.", action: "Host an alumni evening in central Kyoto; invite prospective families.", timing: "October", partnerOpportunities: [], universityAssetLeveraged: "9 Kansai alumni", projectedEnrolled: 5.5 },
    ],
    avoid: [{ formatName: "January–February visits", reason: "National entrance-exam season — families are fully unavailable. Avoid entirely." }],
  },
  "Osaka": {
    executiveSummary: "Osaka scores 74/100. Lead with University Partnership — Kansai business families are internationally minded and under-recruited vs. Tokyo. Projects 8 enrolled vs. 2.0 cold (4.0× lift).",
    projectedWithStrategy: 8.0, projectedColdVisit: 2.0, liftMultiplier: 4.0,
    assetsInRegion: [{ assetType: "alumni_network", name: "Osaka Business Alumni", count: 6, programFocus: "Business" }],
    recommendations: [
      { formatName: "High-School Partnership Visit", conversionLift: 2.9, effectivenessScore: 88, resourceIntensity: "low", leadTimeDays: 30, reason: "Osaka's IB and international high schools have active overseas-study counselors and very few US visitors.", action: "Book visits with 2–3 Osaka IB schools for the autumn fair window.", timing: "Sep–Nov", partnerOpportunities: ["Osaka International School", "Kansai IB network"], universityAssetLeveraged: null, projectedEnrolled: 8.0 },
      { formatName: "English Pathway / Test-Prep Partnership", conversionLift: 2.6, effectivenessScore: 84, resourceIntensity: "medium", leadTimeDays: 45, reason: "Removes the English barrier and signals long-term support — highly valued by Kansai families.", action: "Co-host a pathway session with a local prep school.", timing: "Oct–Nov", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 5.5 },
    ],
    avoid: [{ formatName: "January–February visits", reason: "Entrance-exam season — avoid." }],
  },
  "Central Region": {
    executiveSummary: "Central Region (Singapore) scores 88/100 — the highest on the platform. Students are self-directed and rankings-driven. Lead with an Outcomes / Rankings Showcase, not scholarships. Projects 7 enrolled vs. 1.5 cold (4.7× lift).",
    projectedWithStrategy: 7.0, projectedColdVisit: 1.5, liftMultiplier: 4.7,
    assetsInRegion: [{ assetType: "alumni_network", name: "Singapore Alumni Chapter", count: 11, programFocus: "Business / STEM" }],
    recommendations: [
      { formatName: "Feeder-School Partnership Visit", conversionLift: 3.1, effectivenessScore: 93, resourceIntensity: "low", leadTimeDays: 30, reason: "Raffles, Hwa Chong and ACS (Independent) send students straight to the Ivy League. Direct counselor relationships convert at the highest rate in the dataset.", action: "Book sessions with Raffles & HCI college counselors right after January A-level results.", timing: "January & October", partnerOpportunities: ["Raffles Institution", "Hwa Chong Institution", "ACS (Independent)"], universityAssetLeveraged: "11 Singapore alumni in finance & tech", projectedEnrolled: 7.0 },
      { formatName: "Outcomes / Rankings Showcase", conversionLift: 2.7, effectivenessScore: 89, resourceIntensity: "low", leadTimeDays: 21, reason: "Income is not a barrier here — scholarships underperform. Students choose US over NUS/NTU for differentiation, so lead with placement outcomes, research and rankings.", action: "Prepare a graduate-outcomes deck; host at a central hotel or partner school.", timing: "January / October", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: 5.5 },
      { formatName: "Alumni Networking Event", conversionLift: 3.0, effectivenessScore: 85, resourceIntensity: "medium", leadTimeDays: 40, reason: "11 alumni across finance and tech provide exactly the career proof points Singaporean families want.", action: "Host an alumni evening in the CBD; invite prospective families and counselors.", timing: "October", partnerOpportunities: [], universityAssetLeveraged: "11 Singapore alumni", projectedEnrolled: 4.5 },
    ],
    avoid: [{ formatName: "Scholarship-led messaging", reason: "Income is not the barrier here — scholarship events convert poorly. Lead with outcomes instead." }],
  },

// Default playbook for provinces without specific data
};

// Per-corridor cultural/language context for the default family session,
// so an India region never shows China-specific (Mandarin/Chinese) copy.
const CORRIDOR_CTX: Record<string, { family: string; action: string }> = {
  CHN: { family: "Family involvement is high in Chinese markets. Sessions with Mandarin-speaking staff convert well.", action: "Book venue 6 weeks out. Prepare simplified Chinese materials." },
  JPN: { family: "Japanese families weigh institutional trust and peer outcomes heavily. Japanese-language support and alumni proof points convert well.", action: "Book venue 6 weeks out. Prepare Japanese-language materials and graduate-outcome data." },
  KOR: { family: "Korean families are outcomes-driven and largely English-comfortable. Lead with placement data; Korean-language parent handouts help.", action: "Book venue 6 weeks out. Prepare Korean-language parent materials." },
  IND: { family: "Indian families are highly engaged and English-proficient. Lead with ROI, scholarships and visa-success rates.", action: "Book venue 6 weeks out. Prepare English materials with clear cost and visa guidance." },
  SGP: { family: "Singaporean families are rankings- and outcomes-driven (English throughout). Lead with graduate outcomes rather than scholarships.", action: "Book venue 4 weeks out. Lead with rankings and graduate-outcome data." },
};

function getDefaultPlaybook(provinceName: string, score: number, countryIso?: string) {
  const coldVisit = score >= 70 ? 3.0 : score >= 60 ? 2.0 : 1.5;
  const ctx = CORRIDOR_CTX[countryIso ?? ""] ?? {
    family: "Family involvement is high in this market. Provide local-language support and clear outcome data.",
    action: "Book venue 6 weeks out. Prepare local-language materials and outcome data.",
  };
  return {
    executiveSummary: `${provinceName} scores ${score}/100. Scholarship events and family sessions are the recommended starting formats for this corridor.`,
    projectedWithStrategy: coldVisit * 2.5, projectedColdVisit: coldVisit, liftMultiplier: 2.5,
    assetsInRegion: [],
    recommendations: [
      { formatName: "Scholarship Announcement Event", conversionLift: 2.5, effectivenessScore: 80, resourceIntensity: "low", leadTimeDays: 14, reason: "Cost-effective first engagement for most mid-tier regions.", action: "Create a region-specific scholarship. Announce 2 weeks before your visit.", timing: "September–October", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: coldVisit * 2.5 },
      { formatName: "Family Information Session", conversionLift: 2.1, effectivenessScore: 75, resourceIntensity: "medium", leadTimeDays: 30, reason: ctx.family, action: ctx.action, timing: "October–November", partnerOpportunities: [], universityAssetLeveraged: null, projectedEnrolled: coldVisit * 2.0 },
    ],
    avoid: [],
  };
}

export function getPlaybook(provinceName: string, score: number, countryIso?: string) {
  return PLAYBOOKS[provinceName] || getDefaultPlaybook(provinceName, score, countryIso);
}

interface Props {
  provinceName: string;
  score: number;
  countryIso?: string;
}

export function EngagementPlaybook({ provinceName, score, countryIso }: Props) {
  const playbook = PLAYBOOKS[provinceName] || getDefaultPlaybook(provinceName, score, countryIso);

  return (
    <div className="space-y-4">
      {/* Executive Summary */}
      <div className="bg-navy-50 rounded-xl border border-navy-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-navy-700" />
          <span className="text-xs font-semibold text-navy-700 uppercase tracking-wider">Engagement Strategy</span>
        </div>
        <p className="text-sm text-navy-800 leading-relaxed">{playbook.executiveSummary}</p>
      </div>

      {/* Lift metrics */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Cold visit", value: `~${playbook.projectedColdVisit}`, sub: "enrolled" },
          { label: "With strategy", value: `~${playbook.projectedWithStrategy}`, sub: "enrolled", highlight: true },
          { label: "Lift", value: `${playbook.liftMultiplier}×`, sub: "more students", gold: true },
        ].map(m => (
          <div key={m.label} className={cn("rounded-lg border p-2.5 text-center",
            m.highlight ? "bg-emerald-50 border-emerald-200" : m.gold ? "bg-gold-50 border-amber-200" : "bg-gray-50 border-gray-200"
          )}>
            <div className={cn("text-xl font-bold", m.highlight ? "text-emerald-700" : m.gold ? "text-amber-600" : "text-gray-700")}>{m.value}</div>
            <div className="text-[10px] text-gray-400 leading-tight">{m.label}</div>
            <div className="text-[9px] text-gray-400">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Assets */}
      {playbook.assetsInRegion.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
          <div className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Your Assets in This Region
          </div>
          {playbook.assetsInRegion.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-purple-800">
              <CheckCircle2 className="w-3 h-3 text-purple-500 shrink-0" />
              <span><strong>{a.count} {a.programFocus}</strong> {a.assetType.replace("_", " ")} — {a.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top recommendations */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Top Engagement Formats</div>
        {playbook.recommendations.map((rec, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 bg-white">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-sm font-semibold text-gray-900">{rec.formatName}</span>
                {rec.universityAssetLeveraged && (
                  <div className="text-[10px] text-purple-600 mt-0.5 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> {rec.universityAssetLeveraged}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-emerald-700">{rec.conversionLift}×</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-medium", RESOURCE_COLORS[rec.resourceIntensity])}>
                  {rec.resourceIntensity}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{rec.reason}</p>
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] font-medium text-blue-700 mb-0.5">→ Action</div>
              <p className="text-xs text-blue-800">{rec.action}</p>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{rec.leadTimeDays}d lead time</span>
              <span>{rec.timing}</span>
              <span className="text-emerald-600 font-medium ml-auto">~{rec.projectedEnrolled} projected</span>
            </div>
            {rec.partnerOpportunities.length > 0 && (
              <div className="mt-2">
                <div className="text-[10px] font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <School className="w-2.5 h-2.5" /> Partner opportunities
                </div>
                <div className="flex flex-wrap gap-1">
                  {rec.partnerOpportunities.slice(0, 3).map(p => (
                    <span key={p} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Avoid */}
      {playbook.avoid.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Avoid</div>
          {playbook.avoid.map((w, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-red-700">{w.formatName}: </span>
                <span className="text-xs text-red-700">{w.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
