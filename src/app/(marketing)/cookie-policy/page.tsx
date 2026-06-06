// src/app/(marketing)/cookie-policy/page.tsx
import { Metadata } from "next";
import { LegalPageClient } from "@/components/pages/LegalPageClient";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Markland Hotel & Spa cookie policy — how we use cookies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageClient
      title="Cookie Policy"
      lastUpdated="1 January 2024"
      sections={[
        {
          heading: "What Are Cookies",
          body: "Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
        },
        {
          heading: "Essential Cookies",
          body: "These cookies are necessary for the website to function. They enable core features such as session management, security, and booking flow continuity. You cannot opt out of essential cookies.",
        },
        {
          heading: "Analytics Cookies",
          body: "With your consent, we use analytics cookies to understand how visitors interact with our website. This data is anonymised and used solely to improve our site's performance and content.",
        },
        {
          heading: "Preference Cookies",
          body: "These cookies remember your settings and preferences, such as your preferred language or region, to provide a more personalised experience on return visits.",
        },
        {
          heading: "Managing Cookies",
          body: "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Blocking essential cookies may affect the functionality of our booking system.",
        },
        {
          heading: "Contact",
          body: "For questions about our use of cookies, contact privacy@marklandhotel.com.",
        },
      ]}
    />
  );
}
