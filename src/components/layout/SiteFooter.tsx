"use client";

// src/components/layout/SiteFooter.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const FOOTER_LINKS = {
  "Our Hotel": [
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Spa & Wellness", href: "/spa" },
    { label: "Dining",         href: "/dining" },
    { label: "Experiences",    href: "/experiences" },
    { label: "Meetings & Events", href: "/events" },
  ],
  "Guest Services": [
    { label: "Book a Room",   href: "/book" },
    { label: "Concierge",     href: "/concierge" },
    { label: "Transfers",     href: "/transfers" },
    { label: "Gift Vouchers", href: "/gift-vouchers" },
    { label: "My Booking",    href: "/account/bookings" },
  ],
  "About": [
    { label: "Our Story",      href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers",        href: "/careers" },
    { label: "Press",          href: "/press" },
    { label: "Contact Us",     href: "/contact" },
  ],
};

const SOCIAL = [
  { icon: Instagram, href: "https://instagram.com/marklandhotel", label: "Instagram" },
  { icon: Facebook,  href: "https://facebook.com/marklandhotel",  label: "Facebook" },
  { icon: Twitter,   href: "https://twitter.com/marklandhotel",   label: "Twitter" },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-obsidian-950 border-t border-obsidian-800">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-700/50 to-transparent" />

      {/* Main footer content */}
      <div className="section-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <p className="font-display text-3xl font-light tracking-[0.08em] text-ivory-100">
                Markland
              </p>
              <p className="eyebrow text-2xs tracking-[0.4em] text-champagne-600 mt-0.5">
                Hotel & Spa
              </p>
            </Link>

            <p className="font-body text-sm text-obsidian-400 leading-relaxed max-w-xs mb-8">
              A sanctuary of refined luxury nestled in the heart of the countryside.
              Where timeless elegance meets contemporary comfort.
            </p>

            {/* Contact */}
            <div className="space-y-3 mb-8">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-obsidian-400 hover:text-champagne-400 transition-colors group"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-champagne-700 group-hover:text-champagne-400 transition-colors" />
                <span>1 Markland Estate, County Wicklow,<br />A98 X000, Ireland</span>
              </a>
              <a
                href="tel:+35312345678"
                className="flex items-center gap-2.5 text-sm text-obsidian-400 hover:text-champagne-400 transition-colors group"
              >
                <Phone size={14} className="text-champagne-700 group-hover:text-champagne-400 transition-colors" />
                +353 1 234 5678
              </a>
              <a
                href="mailto:reservations@marklandhotel.com"
                className="flex items-center gap-2.5 text-sm text-obsidian-400 hover:text-champagne-400 transition-colors group"
              >
                <Mail size={14} className="text-champagne-700 group-hover:text-champagne-400 transition-colors" />
                reservations@marklandhotel.com
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-champagne-600 hover:text-champagne-400 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="eyebrow text-xs text-champagne-700 mb-5">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="font-body text-sm text-obsidian-400 hover:text-ivory-200 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-12 border-t border-obsidian-800">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-16">
            <div className="lg:w-1/2">
              <h4 className="font-display text-xl text-ivory-200 mb-1">
                Stay Informed
              </h4>
              <p className="text-sm text-obsidian-400">
                Receive exclusive offers, seasonal packages, and the latest news from Markland.
              </p>
            </div>
            <form
              className="flex gap-3 lg:w-1/2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="input-luxury flex-1 text-xs py-3"
              />
              <button
                type="submit"
                className="btn-luxury-primary text-2xs py-3 px-6 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-obsidian-800">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs tracking-wider text-obsidian-600">
            © {new Date().getFullYear()} Markland Hotel & Spa. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {([
              { label: "Privacy Policy",     href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
              { label: "Cookie Policy",      href: "/cookie-policy" },
            ] as { label: string; href: string }[]).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xs tracking-wider text-obsidian-600 hover:text-obsidian-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </footer>
  );
}
