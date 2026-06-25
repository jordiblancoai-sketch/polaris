import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, institution, interestedIn, message, source } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  // Log to console for immediate visibility
  console.log("📧 LEAD SUBMISSION:", {
    timestamp: new Date().toISOString(),
    source: source || "contact",
    name,
    email,
    institution,
    interestedIn,
    message,
  });

  // Send to email service (Resend)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Polaris <hello@polaris.io>",
          to: "hello@polaris.io",
          replyTo: email,
          subject: `${source === "chat" ? "Chat message" : "Demo Request"}: ${name}${institution ? ` from ${institution}` : ""}`,
          html: `
            <h2>New ${source === "chat" ? "chat message" : "demo request"}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Institution:</strong> ${institution || "Not provided"}</p>
            <p><strong>Interested In:</strong> ${interestedIn || "Not specified"}</p>
            ${message ? `<p><strong>Message:</strong><br/>${String(message).replace(/</g, "&lt;")}</p>` : ""}
            <hr />
            <p><strong>Reply to:</strong> ${email}</p>
          `,
        }),
      });
      if (!res.ok) console.error("Email send failed:", await res.text());
    } catch (e) {
      console.error("Email service error:", e);
      // Don't fail the form submission if email service is down
    }
  }

  // TODO: Save to database when backend is live
  // await db.contacts.create({ name, email, institution, interestedIn });

  return NextResponse.json({ success: true, message: "Demo request received. We'll contact you within 24 hours." }, { status: 200 });
}
