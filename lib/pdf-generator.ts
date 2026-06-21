import { jsPDF } from "jspdf";
import { getPlaybook } from "@/components/EngagementPlaybook";
import { getCompetitive } from "@/components/CompetitiveIntelPanel";
import { getTimingMonths } from "@/components/TimingHeatmap";

interface PDFData {
  score: number;
  rank: number;
  confidence: string;
  keyInsight: string | null;
  riskFlag: string | null;
  visitWindow: string | null;
  corridor: string;
  strategies: string[];
  tierLabel: string;
  factors?: { subject: string; value: number }[];
  isChina?: boolean;
  iso?: string;
}

export async function generateProvincePDF(regionName: string, data: PDFData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 15;            // left margin
  let y = 0;

  const ensure = (need: number) => { if (y > pageH - need) { doc.addPage(); y = 20; } };
  const heading = (txt: string, color: [number, number, number] = [15, 30, 69]) => {
    ensure(18);
    doc.setTextColor(...color); doc.setFontSize(13); doc.setFont("helvetica", "bold");
    doc.text(txt, M, y); y += 7;
  };
  const body = (txt: string, indent = 0, size = 10) => {
    doc.setTextColor(45, 45, 45); doc.setFontSize(size); doc.setFont("helvetica", "normal");
    doc.splitTextToSize(txt, 180 - indent).forEach((ln: string) => {
      ensure(10); doc.text(ln, M + indent, y); y += size === 10 ? 5.2 : 4.6;
    });
  };
  const label = (k: string, v: string) => {
    ensure(8);
    doc.setTextColor(90, 90, 90); doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(k, M + 2, y);
    doc.setTextColor(20, 20, 20); doc.setFont("helvetica", "bold");
    doc.text(v, M + 70, y); y += 5.5;
  };
  const rule = () => { y += 2; doc.setDrawColor(230); doc.line(M, y, pageW - M, y); y += 5; };

  // ── Header ──
  doc.setFillColor(15, 30, 69);
  doc.rect(0, 0, pageW, 46, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28); doc.setFont("helvetica", "bold");
  doc.text(regionName, M, 24);
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  doc.text(`${data.corridor} corridor  -  ${data.tierLabel}`, M, 35);
  y = 58;

  // ── Score band ──
  const c = data.score >= 70 ? [5, 150, 105] : data.score >= 50 ? [217, 119, 6] : [239, 68, 68];
  doc.setFillColor(c[0], c[1], c[2]);
  doc.rect(M, y, 180, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24); doc.setFont("helvetica", "bold");
  doc.text(`Score ${data.score}/100`, M + 5, y + 16);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`Rank #${data.rank}  ·  ${data.confidence} confidence  ·  Best window: ${data.visitWindow || "—"}`, M + 78, y + 16);
  y += 34;

  // ── 1. Why this score ──
  if (data.keyInsight) { heading("Why this score"); body(data.keyInsight); y += 4; }

  // ── Watch out ──
  if (data.riskFlag) { heading("Watch out", [200, 30, 30]); body(data.riskFlag); y += 4; }

  // ── 2. Score breakdown factors ──
  if (data.factors?.length) {
    heading("Score breakdown");
    data.factors.forEach(f => { label(f.subject.replace(/[^\x00-\x7F]/g, "").trim(), `${f.value}/100`); });
    y += 4;
  }

  // ── 3. Recommended strategy ──
  heading("Recommended engagement strategy");
  data.strategies.forEach(sx => body("- " + sx, 2));
  y += 2;

  // ── 4. Full engagement playbook ──
  const pb = getPlaybook(regionName, data.score);
  rule();
  heading("Engagement playbook");
  body(pb.executiveSummary);
  y += 2;
  label("Cold visit (no strategy)", `~${pb.projectedColdVisit} enrolled`);
  label("With Polaris strategy", `~${pb.projectedWithStrategy} enrolled`);
  label("Lift", `${pb.liftMultiplier}x more students`);
  y += 3;

  if (pb.assetsInRegion.length) {
    doc.setTextColor(120, 60, 160); doc.setFontSize(10); doc.setFont("helvetica", "bold");
    ensure(8); doc.text("Your assets in this region", M + 2, y); y += 6;
    pb.assetsInRegion.forEach((a: any) =>
      body(`- ${a.count} ${a.programFocus} ${String(a.assetType).replace("_", " ")} - ${a.name}`, 2, 9));
    y += 2;
  }

  doc.setTextColor(15, 30, 69); doc.setFontSize(10); doc.setFont("helvetica", "bold");
  ensure(8); doc.text("Top engagement formats", M + 2, y); y += 6;
  pb.recommendations.forEach((r: any) => {
    ensure(20);
    doc.setTextColor(20, 20, 20); doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text(`${r.formatName}  (${r.conversionLift}x, ${r.resourceIntensity} effort)`, M + 2, y); y += 5;
    body(r.reason, 4, 9);
    body(`Action: ${r.action}`, 4, 9);
    body(`Timing: ${r.timing}  ·  ${r.leadTimeDays}d lead  ·  ~${r.projectedEnrolled} projected`, 4, 9);
    if (r.partnerOpportunities?.length) body(`Partner high schools: ${r.partnerOpportunities.join(", ")}`, 4, 9);
    y += 2;
  });

  if (pb.avoid.length) {
    doc.setTextColor(200, 30, 30); doc.setFontSize(10); doc.setFont("helvetica", "bold");
    ensure(8); doc.text("Avoid", M + 2, y); y += 6;
    pb.avoid.forEach((a: any) => body(`- ${a.formatName}: ${a.reason}`, 2, 9));
    y += 2;
  }

  // ── 5. Competitive landscape (China) ──
  const comp = getCompetitive(regionName);
  if (comp) {
    rule();
    heading("Competitive landscape");
    label("US universities recruiting here", String(comp.totalUSUnisRecruiting));
    label(`vs ${comp.saturatedComparatorName} (saturated)`, String(comp.saturatedComparatorCount));
    label("White-space score", `${comp.whiteSpaceScore}/100`);
    if (comp.monthsBeforeSaturation) label("Est. months before saturation", String(comp.monthsBeforeSaturation));
    y += 2;
    if (comp.notPresentNote) { body(comp.notPresentNote); y += 2; }
    if (comp.notPresent?.length) body(`Top schools NOT yet here: ${comp.notPresent.join(", ")}`, 2, 9);
    if (comp.competitors?.length) {
      body(`Currently active: ${comp.competitors.slice(0, 8).map((x: any) => x.name).join(", ")}`, 2, 9);
    }
    y += 2;
  }

  // ── 6. Timing windows ──
  {
    const months = getTimingMonths(data.iso);
    rule();
    heading("Best timing windows");
    months.forEach((m: any) => {
      ensure(7);
      const mc = m.label === "PEAK" ? [5, 150, 105] : m.label === "GOOD" ? [22, 120, 200]
        : m.label === "AVOID" ? [220, 40, 40] : [120, 120, 120];
      doc.setTextColor(mc[0], mc[1], mc[2]); doc.setFontSize(9); doc.setFont("helvetica", "bold");
      doc.text(`${m.monthFull} — ${m.label}`, M + 2, y);
      doc.setTextColor(90, 90, 90); doc.setFont("helvetica", "normal");
      doc.text(`(${m.score}/100)`, M + 60, y); y += 4.5;
      doc.setFontSize(8); doc.setTextColor(110, 110, 110);
      doc.text(m.keyEvents[0] || "", M + 4, y); y += 5;
    });
  }

  // ── Footer on every page ──
  const pages = doc.getNumberOfPages();
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text(`Polaris Intelligence Platform  ·  ${date}`, M, pageH - 8);
    doc.text(`${p} / ${pages}`, pageW - M, pageH - 8, { align: "right" });
  }

  doc.save(`${regionName.replace(/\s+/g, "-")}-full-report.pdf`);
  return true;
}
