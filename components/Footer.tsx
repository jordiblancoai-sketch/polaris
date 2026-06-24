"use client";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Logo size="md" />
            <p className="mt-4 text-navy-300 text-sm leading-relaxed">
              International enrollment intelligence for ambitious universities.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/map" className="text-navy-300 hover:text-gold-400 transition-colors">Demo</Link></li>
              <li><Link href="/strategic-plan" className="text-navy-300 hover:text-gold-400 transition-colors">Free Strategic Plan</Link></li>
              <li><Link href="/methodology" className="text-navy-300 hover:text-gold-400 transition-colors">Methodology</Link></li>
              <li><a href="#pricing" className="text-navy-300 hover:text-gold-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-navy-300 hover:text-gold-400 transition-colors">Contact</Link></li>
              <li><a href="https://wa.me/?text=Hi%20Polaris%20team" target="_blank" rel="noopener" className="text-navy-300 hover:text-gold-400 transition-colors">WhatsApp</a></li>
              <li><a href="mailto:hello@polarisuni.com" className="text-navy-300 hover:text-gold-400 transition-colors">Email</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-navy-300 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-navy-300 hover:text-gold-400 transition-colors">Terms of Service</Link></li>
              <li><a href="https://gdpr.eu" target="_blank" rel="noopener" className="text-navy-300 hover:text-gold-400 transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-navy-400 text-xs">
              © {currentYear} Polaris. All rights reserved.
            </p>
            <p className="text-navy-400 text-xs text-center md:text-right">
              Polaris is a recruitment intelligence platform for international enrollment at universities worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
