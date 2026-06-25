"use client";
import { useEffect } from "react";

// Free Tawk.to live-chat widget.
// Set NEXT_PUBLIC_TAWK_PROPERTY_ID (and optionally NEXT_PUBLIC_TAWK_WIDGET_ID)
// in your env. Until then this renders nothing — no broken widget, no errors.
//
// Where to get the ID: tawk.to → Admin → Channels → Chat Widget →
// the embed src looks like  https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

export function TawkChat() {
  useEffect(() => {
    if (!PROPERTY_ID) return;                          // not configured yet
    if (document.getElementById("tawk-script")) return; // avoid double-inject
    const s = document.createElement("script");
    s.id = "tawk-script";
    s.async = true;
    s.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, []);

  return null;
}
