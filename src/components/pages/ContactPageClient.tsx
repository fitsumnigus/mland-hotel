"use client";

// src/components/pages/ContactPageClient.tsx
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const DEPARTMENTS = [
  { label: "Reservations",    email: "reservations@marklandhotel.com", phone: "+353 1 234 5678" },
  { label: "Spa Bookings",   email: "spa@marklandhotel.com",          phone: "+353 1 234 5679" },
  { label: "Events & Weddings", email: "events@marklandhotel.com",   phone: "+353 1 234 5680" },
  { label: "Press & Media",  email: "press@marklandhotel.com",        phone: "+353 1 234 5681" },
];
 
const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
}; 

const ENQUIRY_TYPES = [
  "Room Reservation",
  "Spa Treatment",
  "Dining Reservation",
  "Wedding Enquiry",
  "Corporate Event",
  "Gift Voucher",
  "Press / Media",
  "General Enquiry",
];

export function ContactPageClient() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(bodyRef, { once: true, amount: 0.1 });

  const [form,      setForm]      = useState({ name: "", email: "", phone: "", enquiry: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

  const setField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // Simulate send — in production wire to email API
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-obsidian-950 min-h-screen pt-32 pb-24">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow text-xs text-champagne-500 mb-4 tracking-[0.35em]">Get in Touch</p>
          <h1 className="font-display text-display-sm lg:text-display-md text-ivory-100 font-light leading-[0.95] mb-4">
            Contact Us
          </h1>
          <p className="font-body text-sm text-obsidian-400 max-w-lg leading-relaxed">
            Our team responds to all enquiries within four working hours. For urgent matters, call our main line — answered 24 hours a day.
          </p>
        </motion.div>

        <div ref={bodyRef} className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                className="border border-emerald-700/40 bg-emerald-900/10 p-8 flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center mb-4">
                  <Check size={20} className="text-emerald-400" />
                </div>
                <h2 className="font-display text-2xl text-ivory-100 mb-2">Message Received</h2>
                <p className="font-body text-sm text-obsidian-400 leading-relaxed">
                  Thank you, {form.name.split(" ")[0]}. We will respond to {form.email} within four hours.
                  If you need immediate assistance, call <a href="tel:+35312345678" className="text-champagne-400 hover:text-champagne-300 transition-colors">+353 1 234 5678</a>.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="James Thornton"
                      autoComplete="name"
                      required
                      className="contact-input"
                    />
                  </Field>
                  <Field label="Email Address" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="james@example.com"
                      autoComplete="email"
                      required
                      className="contact-input"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone Number">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="+353 1 234 5678"
                      autoComplete="tel"
                      className="contact-input"
                    />
                  </Field>
                  <Field label="Nature of Enquiry">
                    <select
                      value={form.enquiry}
                      onChange={(e) => setField("enquiry", e.target.value)}
                      aria-label="Nature of Enquiry"
                      className="contact-input cursor-pointer [&>option]:bg-obsidian-900 [&>option]:text-ivory-200"
                    >
                      <option value="">Select…</option>
                      {ENQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Message" required>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder="Tell us how we can help…"
                    rows={5}
                    required
                    className="contact-input resize-none"
                  />
                </Field>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-luxury-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {sending ? (
                      <><span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />Sending…</>
                    ) : (
                      <><Send size={13} />Send Message</>
                    )}
                  </button>
                </div>

                <p className="text-2xs text-obsidian-600 leading-relaxed">
                  Your details are used only to respond to your enquiry. See our{" "}
                  <a href="/privacy-policy" className="text-champagne-700 hover:text-champagne-500 transition-colors">privacy policy</a>.
                </p>
              </motion.form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Address */}
            <motion.div
              className="border border-obsidian-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <p className="eyebrow text-2xs text-champagne-600 mb-4 tracking-widest">Find Us</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-obsidian-400">
                  <MapPin size={13} className="text-champagne-700 mt-0.5 shrink-0" />
                  <span>1 Markland Estate<br />County Wicklow<br />A98 X000, Ireland</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-obsidian-400">
                  <Clock size={13} className="text-champagne-700 shrink-0" />
                  <span>Check-in from 3:00 PM<br />Check-out by 12:00 PM</span>
                </div>
              </div>
            </motion.div>

            {/* Main contact */}
            <motion.div
              className="border border-obsidian-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              <p className="eyebrow text-2xs text-champagne-600 mb-4 tracking-widest">Main Line</p>
              <a href="tel:+35312345678" className="flex items-center gap-3 text-sm text-ivory-300 hover:text-champagne-300 transition-colors mb-2">
                <Phone size={13} className="text-champagne-700" />
                +353 1 234 5678
              </a>
              <a href="mailto:reservations@marklandhotel.com" className="flex items-center gap-3 text-xs text-obsidian-400 hover:text-champagne-400 transition-colors">
                <Mail size={13} className="text-champagne-700" />
                reservations@marklandhotel.com
              </a>
            </motion.div>

            {/* Departments */}
            <motion.div
              className="border border-obsidian-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <p className="eyebrow text-2xs text-champagne-600 mb-4 tracking-widest">Direct Lines</p>
              <div className="space-y-4">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept.label}>
                    <p className="font-body text-xs font-medium text-ivory-400 mb-1">{dept.label}</p>
                    <a href={`mailto:${dept.email}`} className="text-2xs text-obsidian-500 hover:text-champagne-400 transition-colors block">{dept.email}</a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Inline style for contact inputs */}
      <style jsx global>{`
        .contact-input {
          width: 100%;
          background: rgba(26,22,20,0.5);
          border: 1px solid rgba(78,68,64,0.8);
          padding: 0.75rem 1rem;
          font-family: var(--font-jost);
          font-size: 0.875rem;
          color: #f5f0e4;
          transition: border-color 0.2s;
          outline: none;
        }
        .contact-input::placeholder { color: #4e4440; }
        .contact-input:focus { border-color: rgba(212,160,50,0.5); }
      `}</style>
    </div>
  );
}
