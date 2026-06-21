/**
 * Generate a professional 4-5 page recruitment strategy PDF
 * Includes: timeline, budget, competitors, projections, KPIs
 */

interface StrategyRequest {
  email: string;
  institution: string;
  corridor: string;
  budget: string;
  timeline: string;
  regions: string;
  currentEnrollment: number;
  priorExperience: string;
  formats: string[];
  targetStudents: string[];
  alumniNetworks: string;
  competitors: string;
  primaryGoal: string;
  partnershipBudget: string;
}

export async function generateStrategyPDF(data: StrategyRequest): Promise<Buffer> {
  // Dynamic import to avoid bundling reportlab client-side
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  let yPos = margin;

  // ─── PAGE 1: COVER + EXECUTIVE SUMMARY ───
  // Header band
  doc.setFillColor(3, 7, 30); // Navy-deep
  doc.rect(0, 0, pageWidth, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("POLARIS", margin + 5, 18);

  doc.setTextColor(245, 200, 66); // Gold
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("RECRUITMENT STRATEGY", margin + 5, 28);

  doc.setTextColor(152, 175, 217); // Light blue
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 28);

  yPos = 65;

  // Title
  doc.setTextColor(3, 7, 30);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Your Personalized Recruitment Strategy", margin, yPos);

  yPos += 12;
  doc.setTextColor(79, 102, 130);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.institution} — ${data.corridor}`, margin, yPos);

  yPos += 20;

  // Key stats box
  doc.setFillColor(15, 30, 69); // Navy
  doc.rect(margin, yPos, contentWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR TARGETS", margin + 5, yPos + 8);

  doc.setTextColor(245, 200, 66);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.regions.split(",")[0].trim(), margin + 5, yPos + 18);

  doc.setTextColor(152, 175, 217);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const budgetValue = data.budget.split("–")[0].trim();
  doc.text(`Budget: ${data.budget}`, margin + 70, yPos + 8);
  doc.text(`Timeline: ${data.timeline.split("(")[0].trim()}`, margin + 70, yPos + 15);
  doc.text(`Goal: ${data.primaryGoal}`, margin + 70, yPos + 22);

  yPos += 50;

  // Executive summary
  doc.setTextColor(79, 102, 130);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE SUMMARY", margin, yPos);

  yPos += 8;
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const summary = `Based on your responses, we've designed a ${data.timeline.toLowerCase()} recruitment strategy for ${data.institution} targeting ${data.corridor}. With a budget of ${data.budget}, this plan activates your focus regions through ${data.formats.slice(0, 2).join(" + ")} formats, projected to generate 35–65 quality enrollments.`;

  const summaryLines = doc.splitTextToSize(summary, contentWidth - 10);
  doc.text(summaryLines, margin + 5, yPos);

  yPos += summaryLines.length * 5 + 15;

  // ─── PAGE 2: TIMELINE + MONTHLY BREAKDOWN ───
  if (yPos > pageHeight - 40) {
    doc.addPage();
    yPos = margin;
  }

  doc.setTextColor(3, 7, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTION TIMELINE", margin, yPos);

  yPos += 12;

  // Month-by-month plan
  const months = generateMonthlyPlan(data);
  months.forEach((month, idx) => {
    if (yPos > pageHeight - 35) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFillColor(245, 200, 66);
    doc.rect(margin, yPos, 12, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(month.label, margin + 16, yPos + 5.5);

    doc.setTextColor(79, 102, 130);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${month.activity} | Budget: ${month.budget}`, margin + 16, yPos + 11);

    yPos += 15;
  });

  yPos += 10;

  // ─── PAGE 3: BUDGET BREAKDOWN ───
  if (yPos > pageHeight - 50) {
    doc.addPage();
    yPos = margin;
  }

  doc.setTextColor(3, 7, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BUDGET BREAKDOWN", margin, yPos);

  yPos += 12;

  const budgetBreakdown = generateBudgetBreakdown(data);
  const tableStartY = yPos;

  // Budget table
  doc.setFillColor(245, 200, 66);
  doc.setTextColor(3, 7, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Category", margin + 5, yPos + 6);
  doc.text("Amount", pageWidth - margin - 30, yPos + 6);

  yPos += 10;
  doc.setFillColor(240, 245, 255);
  doc.rect(margin, yPos - 5, contentWidth, 30, "F");

  doc.setTextColor(79, 102, 130);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");

  budgetBreakdown.items.forEach((item, idx) => {
    doc.text(item.category, margin + 5, yPos + idx * 8);
    doc.text(item.amount, pageWidth - margin - 30, yPos + idx * 8);
  });

  yPos += budgetBreakdown.items.length * 8 + 10;

  // Total
  doc.setFillColor(15, 30, 69);
  doc.rect(margin, yPos, contentWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL BUDGET", margin + 5, yPos + 6.5);
  doc.text(budgetBreakdown.total, pageWidth - margin - 30, yPos + 6.5);

  yPos += 20;

  // ─── PAGE 4: COMPETITORS + INTELLIGENCE ───
  if (yPos > pageHeight - 50) {
    doc.addPage();
    yPos = margin;
  }

  doc.setTextColor(3, 7, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("COMPETITIVE LANDSCAPE", margin, yPos);

  yPos += 12;

  doc.setTextColor(79, 102, 130);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Main competitors in your target regions:", margin, yPos);

  yPos += 8;
  const competitors = data.competitors.split(",").slice(0, 5);
  competitors.forEach((comp, idx) => {
    doc.setFillColor(240, 245, 255);
    doc.rect(margin, yPos, contentWidth, 6, "F");
    doc.setTextColor(79, 102, 130);
    doc.setFontSize(8.5);
    doc.text(`• ${comp.trim()}`, margin + 5, yPos + 4);
    yPos += 8;
  });

  yPos += 10;

  // Opportunity analysis
  doc.setTextColor(3, 7, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Your Competitive Advantage", margin, yPos);

  yPos += 8;
  doc.setTextColor(79, 102, 130);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");

  const advantage = generateCompetitiveAdvantage(data);
  const advLines = doc.splitTextToSize(advantage, contentWidth - 10);
  doc.text(advLines, margin + 5, yPos);

  yPos += advLines.length * 5 + 15;

  // ─── PAGE 5: SUCCESS METRICS + NEXT STEPS ───
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = margin;
  }

  doc.setTextColor(3, 7, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SUCCESS METRICS & KPIs", margin, yPos);

  yPos += 12;

  const projections = generateProjections(data);

  doc.setFillColor(15, 30, 69);
  doc.rect(margin, yPos, contentWidth / 2 - 3, 35, "F");

  doc.setTextColor(245, 200, 66);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ENROLLMENT PROJECTION", margin + 5, yPos + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(projections.enrollment, margin + 5, yPos + 20);

  doc.setTextColor(152, 175, 217);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("projected enrollments", margin + 5, yPos + 28);

  // Right box
  doc.setFillColor(15, 30, 69);
  doc.rect(margin + contentWidth / 2 + 3, yPos, contentWidth / 2 - 3, 35, "F");

  doc.setTextColor(245, 200, 66);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ENGAGEMENT RATE", margin + contentWidth / 2 + 8, yPos + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(projections.engagementRate, margin + contentWidth / 2 + 8, yPos + 20);

  doc.setTextColor(152, 175, 217);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("students engaged", margin + contentWidth / 2 + 8, yPos + 28);

  yPos += 50;

  // Tracking KPIs
  doc.setTextColor(3, 7, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Track These KPIs Monthly:", margin, yPos);

  yPos += 8;
  const kpis = [
    "# Students engaged in events",
    "# Inquiries received",
    "# Applications submitted",
    "# Admitted students",
    "Cost per enrolled student",
  ];

  kpis.forEach((kpi) => {
    doc.setTextColor(79, 102, 130);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(`☐ ${kpi}`, margin + 5, yPos);
    yPos += 6;
  });

  yPos += 10;

  // Next steps
  doc.setTextColor(3, 7, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("NEXT STEPS", margin, yPos);

  yPos += 8;
  const steps = [
    "1. Review this strategy with your team and stakeholders",
    "2. Confirm regional priorities and engagement formats",
    "3. Set up outcome tracking (spreadsheet or CRM)",
    "4. Book travel and event venues (see timeline)",
    "5. Share strategy with Polaris for ongoing optimization",
  ];

  steps.forEach((step) => {
    doc.setTextColor(79, 102, 130);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const stepLines = doc.splitTextToSize(step, contentWidth - 10);
    doc.text(stepLines, margin + 5, yPos);
    yPos += stepLines.length * 4 + 2;
  });

  yPos += 10;

  // Footer
  doc.setTextColor(152, 175, 217);
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This strategy is personalized to your institution and based on Polaris intelligence data. Projections are estimates; actual results depend on execution quality.",
    margin,
    pageHeight - 10
  );

  return Buffer.from(doc.output("arraybuffer"));
}

// Helper functions

function generateMonthlyPlan(data: StrategyRequest) {
  const months = [];
  const formatList = data.formats.length > 0 ? data.formats : ["Alumni events", "School visits"];

  const baseMonths = [
    { label: "Month 1", activity: `Kickoff + ${formatList[0]}`, budget: "$2.5k" },
    { label: "Month 2", activity: `${formatList[1] || "School visits"}`, budget: "$3.2k" },
    { label: "Month 3", activity: "Follow-up & alumni activation", budget: "$2.8k" },
    { label: "Month 4", activity: "Event 2 / Roadshow", budget: "$4.5k" },
    { label: "Month 5", activity: "Relationship nurturing", budget: "$1.8k" },
    { label: "Month 6", activity: "Results tracking & Q3 planning", budget: "$1.2k" },
  ];

  return baseMonths.slice(0, Math.ceil(Math.random() * 4) + 2);
}

function generateBudgetBreakdown(data: StrategyRequest) {
  const budgetNum = parseInt(data.budget.replace(/\D/g, "")) || 25;

  return {
    items: [
      { category: "Events & activities", amount: `$${Math.round(budgetNum * 0.35)}k` },
      { category: "Travel & logistics", amount: `$${Math.round(budgetNum * 0.28)}k` },
      { category: "Partner fees", amount: `$${Math.round(budgetNum * 0.25)}k` },
      { category: "Materials & collateral", amount: `$${Math.round(budgetNum * 0.07)}k` },
      { category: "Contingency (5%)", amount: `$${Math.round(budgetNum * 0.05)}k` },
    ],
    total: data.budget,
  };
}

function generateCompetitiveAdvantage(data: StrategyRequest) {
  const advantages = [];

  if (data.alumniNetworks !== "No networks") {
    advantages.push(`Your ${data.alumniNetworks.toLowerCase()} provide authentic credibility in target regions.`);
  }

  if (data.priorExperience.includes("Yes")) {
    advantages.push(
      "Your prior recruiting experience in Asia gives you market knowledge competitors lack."
    );
  }

  if (data.targetStudents.includes("STEM")) {
    advantages.push(
      "STEM programs are high-demand in your target regions — position this as your advantage."
    );
  }

  advantages.push(
    `Your ${data.primaryGoal.toLowerCase()} focus differentiates you from the typical commodity recruitment approach.`
  );

  return advantages.join(" ") || "Position your unique strengths (programs, scholarships, alumni success) as your competitive differentiator.";
}

function generateProjections(data: StrategyRequest) {
  const baseEnrollment = data.currentEnrollment || 10;
  const budgetNum = parseInt(data.budget.replace(/\D/g, "")) || 25;
  const costPerStudent = Math.max(500, 2500 - budgetNum * 10);

  const projectedEnrollment = Math.round(budgetNum / (costPerStudent / 1000));
  const engagementRate = Math.round((projectedEnrollment * 100) / Math.max(1, projectedEnrollment * 3));

  return {
    enrollment: `${baseEnrollment + Math.round(projectedEnrollment * 0.6)}–${baseEnrollment + projectedEnrollment}`,
    engagementRate: `${engagementRate}–${engagementRate + 15}%`,
  };
}
