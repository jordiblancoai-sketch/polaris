import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-blanco-team.vercel.app"),
  title: "Polaris — International Enrollment Intelligence",
  description: "Data-driven precision targeting for international student recruitment. Score every source market before you book a flight.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
