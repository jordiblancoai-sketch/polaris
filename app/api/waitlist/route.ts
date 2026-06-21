import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, institution, feature } = await req.json();

  if (!email || !institution || !feature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    console.log("📋 WAITLIST SIGNUP:", {
      timestamp: new Date().toISOString(),
      email,
      institution,
      feature,
    });

    // TODO: Save to database or Airtable
    // TODO: Send confirmation email via Resend

    // Optional: Send notification to Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          body: JSON.stringify({
            text: `🎯 New waitlist signup for ${feature}`,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${feature}* waitlist\n${email} • ${institution}`,
                },
              },
            ],
          }),
        });
      } catch (e) {
        console.error("Slack notification failed:", e);
      }
    }

    return NextResponse.json(
      { success: true, message: "Successfully added to waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
}
