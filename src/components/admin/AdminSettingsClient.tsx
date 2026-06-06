"use client";

// src/components/admin/AdminSettingsClient.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Globe, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

type Tab = "general" | "notifications" | "security" | "billing";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "general",       label: "General",       icon: <Globe size={14} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  { id: "security",      label: "Security",      icon: <Shield size={14} /> },
  { id: "billing",       label: "Billing",       icon: <CreditCard size={14} /> },
];

export function AdminSettingsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved,     setSaved]     = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-5 lg:p-7 max-w-4xl">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Settings size={18} className="text-champagne-600" />
        <div>
          <h1 className="font-display text-2xl text-ivory-100 font-light">Settings</h1>
          <p className="font-body text-sm text-obsidian-500">System configuration and preferences</p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab nav */}
        <div className="lg:w-44 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-left transition-all",
                  activeTab === tab.id
                    ? "text-champagne-400 bg-champagne-900/15 border-l-2 border-champagne-500"
                    : "text-obsidian-400 hover:text-ivory-200 hover:bg-obsidian-800/40 border-l-2 border-transparent"
                )}
              >
                <span className={activeTab === tab.id ? "text-champagne-500" : "text-obsidian-600"}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            className="border border-obsidian-800 bg-obsidian-900/30"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "billing" && <BillingSettings />}

            {/* Save */}
            <div className="border-t border-obsidian-800 px-5 py-4 flex justify-end">
              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-xs font-body tracking-wider uppercase transition-all",
                  saved ? "bg-emerald-800/30 border border-emerald-700/40 text-emerald-400" : "btn-luxury-primary"
                )}
              >
                {saved ? <><Check size={12} /> Saved</> : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 px-5 py-4 border-b border-obsidian-800 last:border-0">
      <div className="sm:w-56 shrink-0">
        <p className="font-body text-sm text-ivory-300 font-medium">{label}</p>
        {description && <p className="text-xs text-obsidian-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors duration-200",
        on ? "bg-champagne-500" : "bg-obsidian-700"
      )}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
        on ? "translate-x-4" : "translate-x-0"
      )} />
    </button>
  );
}

function FieldInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 placeholder:text-obsidian-600 focus:outline-none focus:border-champagne-700/60 transition-colors"
    />
  );
}

function GeneralSettings() {
  return (
    <div>
      <div className="px-5 py-3 border-b border-obsidian-800 bg-obsidian-900/50">
        <p className="eyebrow text-xs text-champagne-600 tracking-widest">General Settings</p>
      </div>
      <SettingRow label="Hotel Name" description="Displayed in emails and booking confirmations">
        <FieldInput defaultValue="Markland Hotel & Spa" />
      </SettingRow>
      <SettingRow label="Contact Email" description="Reservations and guest communications">
        <FieldInput defaultValue="reservations@marklandhotel.com" />
      </SettingRow>
      <SettingRow label="Contact Phone" description="Listed on booking confirmations">
        <FieldInput defaultValue="+353 1 234 5678" />
      </SettingRow>
      <SettingRow label="Default Currency" description="Currency for all pricing">
        <select className="border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 focus:outline-none [&>option]:bg-obsidian-900">
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
          <option value="USD">USD — US Dollar</option>
        </select>
      </SettingRow>
      <SettingRow label="Timezone" description="Used for check-in/check-out times">
        <select className="border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 focus:outline-none [&>option]:bg-obsidian-900">
          <option>Europe/Dublin</option>
          <option>Europe/London</option>
        </select>
      </SettingRow>
      <SettingRow label="VAT Rate" description="Applied to all room rates">
        <FieldInput defaultValue="13" />
      </SettingRow>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <div className="px-5 py-3 border-b border-obsidian-800 bg-obsidian-900/50">
        <p className="eyebrow text-xs text-champagne-600 tracking-widest">Notification Settings</p>
      </div>
      {[
        { label: "New Booking Alert",     description: "Notify staff when a new booking is made",      defaultChecked: true },
        { label: "Check-in Reminders",    description: "Email guest 24h before arrival",               defaultChecked: true },
        { label: "Payment Received",      description: "Alert when payment is captured",               defaultChecked: true },
        { label: "Review Requests",       description: "Automatically request review after checkout",  defaultChecked: true },
        { label: "Low Availability Alert",description: "Alert when rooms drop below 2 available",      defaultChecked: false },
        { label: "Daily Summary Email",   description: "Morning report on check-ins and check-outs",   defaultChecked: true },
      ].map((item) => (
        <SettingRow key={item.label} label={item.label} description={item.description}>
          <Toggle defaultChecked={item.defaultChecked} />
        </SettingRow>
      ))}
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <div className="px-5 py-3 border-b border-obsidian-800 bg-obsidian-900/50">
        <p className="eyebrow text-xs text-champagne-600 tracking-widest">Security Settings</p>
      </div>
      <SettingRow label="Two-Factor Auth" description="Require 2FA for all admin logins">
        <Toggle defaultChecked={false} />
      </SettingRow>
      <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
        <select className="border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 focus:outline-none [&>option]:bg-obsidian-900">
          <option>7 days</option>
          <option>1 day</option>
          <option>8 hours</option>
        </select>
      </SettingRow>
      <SettingRow label="Admin IP Whitelist" description="Restrict admin access by IP (comma separated)">
        <textarea
          rows={2}
          placeholder="Leave empty to allow all IPs"
          className="w-full border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 placeholder:text-obsidian-600 focus:outline-none focus:border-champagne-700/60 resize-none"
        />
      </SettingRow>
      <SettingRow label="Activity Logs" description="Keep detailed admin activity records">
        <Toggle defaultChecked={true} />
      </SettingRow>
    </div>
  );
}

function BillingSettings() {
  return (
    <div>
      <div className="px-5 py-3 border-b border-obsidian-800 bg-obsidian-900/50">
        <p className="eyebrow text-xs text-champagne-600 tracking-widest">Billing & Payments</p>
      </div>
      <SettingRow label="Stripe Integration" description="Payment processor for card transactions">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Connected
          </span>
          <button className="text-xs text-champagne-600 hover:text-champagne-400 transition-colors">Configure</button>
        </div>
      </SettingRow>
      <SettingRow label="Stripe Public Key" description="Used for client-side payment forms">
        <FieldInput placeholder="pk_live_…" />
      </SettingRow>
      <SettingRow label="Stripe Secret Key" description="Server-side key — never expose publicly">
        <FieldInput placeholder="sk_live_…" />
      </SettingRow>
      <SettingRow label="Invoice Prefix" description="Prefix for all generated invoices">
        <FieldInput defaultValue="MH-INV-" />
      </SettingRow>
      <SettingRow label="Collect Payment At" description="When to charge the guest's card">
        <select className="border border-obsidian-700 bg-obsidian-900/50 px-3 py-2 text-sm font-body text-ivory-200 focus:outline-none [&>option]:bg-obsidian-900">
          <option>Check-In</option>
          <option>At Booking</option>
          <option>Check-Out</option>
        </select>
      </SettingRow>
    </div>
  );
}
