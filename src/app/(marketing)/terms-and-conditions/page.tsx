// src/app/(marketing)/terms-and-conditions/page.tsx
import { Metadata } from "next";
import { LegalPageClient } from "@/components/pages/LegalPageClient";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Markland Hotel & Spa booking terms, cancellation policy, and conditions of stay.",
};

export default function TermsPage() {
  return (
    <LegalPageClient
      title="Terms & Conditions"
      lastUpdated="1 January 2024"
      sections={[
        {
          heading: "Reservations",
          body: "All reservations are subject to availability. A reservation is confirmed upon receipt of a confirmation email from Markland Hotel & Spa. We reserve the right to decline reservations at our discretion.",
        },
        {
          heading: "Check-In & Check-Out",
          body: "Standard check-in is from 3:00 PM. Check-out is by 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges. Guests must present valid photo identification at check-in.",
        },
        {
          heading: "Cancellation Policy",
          body: "Free cancellation is available up to 48 hours before the scheduled arrival date. Cancellations within 48 hours of arrival will be charged one night's accommodation. No-shows will be charged the full reservation amount. Non-refundable rates cannot be cancelled or modified.",
        },
        {
          heading: "Payment",
          body: "Payment is collected at the hotel on or before check-out unless otherwise agreed. We accept Visa, Mastercard, and American Express. A pre-authorisation may be placed on your card at check-in to cover incidentals.",
        },
        {
          heading: "Damage & Conduct",
          body: "Guests are responsible for any damage caused to the hotel property during their stay. Markland Hotel & Spa reserves the right to charge the credit card on file for any such damage. We operate a non-smoking policy throughout the property.",
        },
        {
          heading: "Liability",
          body: "The hotel accepts no liability for loss or damage to guest property. Valuables should be stored in the in-room safe or at the front desk. Our liability is limited to the extent permitted by Irish law.",
        },
        {
          heading: "Governing Law",
          body: "These terms are governed by the laws of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts.",
        },
      ]}
    />
  );
}
