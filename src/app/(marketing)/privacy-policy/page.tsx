// src/app/(marketing)/privacy-policy/page.tsx
import { Metadata } from "next";
import { LegalPageClient } from "@/components/pages/LegalPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Markland Hotel & Spa privacy policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageClient
      title="Privacy Policy"
      lastUpdated="1 January 2024"
      sections={[
        {
          heading: "Information We Collect",
          body: "We collect information you provide directly to us when making a reservation, creating an account, contacting us, or otherwise communicating with us. This includes name, email address, phone number, payment information, and any preferences or special requests you share.",
        },
        {
          heading: "How We Use Your Information",
          body: "We use information we collect to process reservations and payments, communicate with you about your stay, provide personalised guest experiences, send promotional communications (with your consent), comply with legal obligations, and improve our services.",
        },
        {
          heading: "Data Sharing",
          body: "We do not sell your personal information. We may share information with trusted service providers who assist in operating our hotel (payment processors, email services), and as required by law. All third parties are bound by confidentiality obligations.",
        },
        {
          heading: "Data Retention",
          body: "We retain personal data for as long as necessary to provide our services and comply with legal obligations. Reservation records are retained for seven years for accounting purposes. You may request deletion of your data at any time.",
        },
        {
          heading: "Your Rights",
          body: "Under GDPR you have the right to access, correct, delete, or port your personal data. You may also object to processing or withdraw consent at any time. Contact our Data Protection Officer at privacy@marklandhotel.com.",
        },
        {
          heading: "Cookies",
          body: "We use essential cookies for site functionality and, with your consent, analytics cookies to improve our website. See our Cookie Policy for full details.",
        },
        {
          heading: "Contact",
          body: "For privacy enquiries: privacy@marklandhotel.com · Markland Hotel & Spa, 1 Markland Estate, County Wicklow, A98 X000, Ireland.",
        },
      ]}
    />
  );
}
