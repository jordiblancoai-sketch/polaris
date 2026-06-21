import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Terms of Service — Polaris" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/landing"><Logo size="md" /></Link>
        <h1 className="text-3xl font-black text-navy-950 mt-8 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section><h2 className="font-bold text-navy-900 mb-2">1. Agreement</h2><p>By accessing Polaris you agree to these terms. The platform is licensed to your institution under your subscription plan, not sold.</p></section>
          <section><h2 className="font-bold text-navy-900 mb-2">2. Acceptable use</h2><p>You may use Polaris to plan and analyse your institution's recruitment. You may not resell, scrape, or redistribute our scores, reports or underlying datasets without written permission.</p></section>
          <section><h2 className="font-bold text-navy-900 mb-2">3. Subscriptions & billing</h2><p>Plans are billed annually. Pilots are billed once. You may cancel renewal at any time; access continues to the end of the paid term.</p></section>
          <section><h2 className="font-bold text-navy-900 mb-2">4. Intelligence disclaimer</h2><p>Opportunity scores are decision-support estimates derived from public and licensed data. They are not guarantees of enrollment outcomes. You remain responsible for your recruitment decisions.</p></section>
          <section><h2 className="font-bold text-navy-900 mb-2">5. Liability</h2><p>Polaris is provided "as is". To the extent permitted by law, our liability is limited to the fees paid in the prior 12 months.</p></section>
          <section><h2 className="font-bold text-navy-900 mb-2">6. Contact</h2><p><Link href="/contact" className="text-navy-700 underline">Contact us</Link> with any questions about these terms.</p></section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/landing" className="text-sm text-navy-700 hover:text-navy-900">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
