import { jsPDF } from "jspdf";
import { TripPlanResponse } from "@/lib/types";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export async function generateTripPDF(trip: TripPlanResponse) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = 0;

  // Header
  doc.setFillColor(15, 30, 69);
  doc.rect(0, 0, pageW, 46, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Travel ROI Report", 15, 22);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("China -> United States recruitment itinerary", 15, 33);

  y = 58;

  // ROI summary band
  doc.setFillColor(5, 150, 105);
  doc.rect(15, y, 180, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${usd(trip.savings_vs_historical_usd ?? 0)} saved`, 20, y + 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${usd(trip.projected_cost_per_enrollment_usd)}/enrollment vs ${usd(trip.historical_cost_per_enrollment_usd ?? 0)} historical`, 80, y + 16);
  y += 38;

  // Key numbers
  doc.setTextColor(15, 30, 69);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("At a glance", 15, y);
  y += 8;
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const rows: [string, string][] = [
    ["Total trip cost", `${usd(trip.total_cost_usd)} (${trip.total_days} days)`],
    ["Projected enrollments", `~${Math.round(trip.projected_total_enrollments)} students`],
    ["Cost per enrollment", usd(trip.projected_cost_per_enrollment_usd)],
    ["Budget freed up", usd(trip.savings_vs_historical_usd ?? 0)],
  ];
  rows.forEach(([k, v]) => {
    doc.text(`${k}:`, 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(v, 95, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  });
  y += 6;

  // Narrative
  doc.setTextColor(15, 30, 69);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Summary for your CFO", 15, y);
  y += 8;
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.splitTextToSize(trip.roi_narrative, 175).forEach((ln: string) => {
    if (y > pageH - 25) { doc.addPage(); y = 20; }
    doc.text(ln, 15, y); y += 5.5;
  });
  y += 6;

  // Itinerary
  if (y > pageH - 40) { doc.addPage(); y = 20; }
  doc.setTextColor(15, 30, 69);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Optimized itinerary — ${trip.itinerary.length} cities`, 15, y);
  y += 8;

  trip.itinerary.forEach((stop, i) => {
    if (y > pageH - 32) { doc.addPage(); y = 20; }
    doc.setTextColor(15, 30, 69);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${stop.city_name}`, 18, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(`Score ${stop.opportunity_score} · ${usd(stop.estimated_cost_usd)} · ~${stop.projected_enrolled_students} enrolled · ${stop.days_recommended}d`, 60, y);
    y += 5;
    if (stop.notes) {
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.splitTextToSize(stop.notes, 168).forEach((ln: string) => { doc.text(ln, 22, y); y += 4; });
    }
    const schools = stop.schools_to_visit.map(s => (s.has_ib ? "IB " : "") + s.name).join(", ");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.splitTextToSize("Schools: " + schools, 168).forEach((ln: string) => { doc.text(ln, 22, y); y += 4; });
    y += 3;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  doc.text(`Polaris Intelligence Platform  ·  ${date}`, pageW / 2, pageH - 10, { align: "center" });

  doc.save("Polaris-Trip-ROI-Report.pdf");
  return true;
}
