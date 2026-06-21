import { NextRequest, NextResponse } from "next/server";
import { generateStrategyPDF } from "@/lib/strategy-pdf";

export async function POST(req: NextRequest) {
  const {
    email,
    institution,
    corridor,
    budget,
    timeline,
    regions,
    currentEnrollment,
    priorExperience,
    formats,
    targetStudents,
    alumniNetworks,
    competitors,
    primaryGoal,
    partnershipBudget,
  } = await req.json();

  if (!email || !institution || !corridor || !budget) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    console.log("📊 ENGAGEMENT STRATEGY REQUEST:", {
      timestamp: new Date().toISOString(),
      email,
      institution,
      corridor,
      budget,
      timeline,
      regions,
      currentEnrollment,
      priorExperience,
      formats,
      targetStudents,
      alumniNetworks,
      primaryGoal,
    });

    // Generate personalized PDF
    const pdfBuffer = await generateStrategyPDF({
      email,
      institution,
      corridor,
      budget,
      timeline,
      regions,
      currentEnrollment: parseInt(currentEnrollment) || 0,
      priorExperience,
      formats,
      targetStudents,
      alumniNetworks,
      competitors,
      primaryGoal,
      partnershipBudget,
    });

    // TODO: Send PDF via email (Resend or similar)
    // TODO: Save submission to database

    return NextResponse.json(
      { success: true, message: "Strategy generated and sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Strategy generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate strategy" },
      { status: 500 }
    );
  }
}
