import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Privacy Policy — Polaris" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/landing"><Logo size="md" /></Link>
        <h1 className="text-3xl font-black text-navy-950 mt-8 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-navy-900 mb-2">1. Who we are</h2>
            <p>Polaris provides international student-recruitment intelligence to universities. This policy explains what data we collect from our customers (university staff) and how we use it.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy-900 mb-2">2. Data we collect</h2>
            <p>Account details (name, work email, institution), product usage, and the recruitment parameters you enter. Polaris analyses publicly available demographic, enrollment and visa data — we do not collect personal data on prospective students.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy-900 mb-2">3. How we use it</h2>
            <p>To deliver the platform, generate opportunity scores and reports, improve our models, and provide support. We never sell your data.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy-900 mb-2">4. Data sources</h2>
            <p>Our intelligence is built from public sources (World Bank, UNESCO, US Department of State visa statistics, EF English Proficiency Index) and licensed datasets. Aggregated, never individual-level.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy-900 mb-2">5. Your rights</h2>
            <p>You may request access, correction or deletion of your account data at any time by emailing <a href="mailto:privacy@polarisuni.com" className="text-navy-700 underline">privacy@polarisuni.com</a>.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy-900 mb-2">6. Contact</h2>
            <p>Questions? <Link href="/contact" className="text-navy-700 underline">Contact us</Link>.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/landing" className="text-sm text-navy-700 hover:text-navy-900">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
