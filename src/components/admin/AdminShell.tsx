"use client";

// src/components/admin/AdminShell.tsx
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarCheck, BedDouble, Users,
  BarChart3, Settings, LogOut, Menu, X, Bell,
  ChevronRight, Sparkles,
} from "lucide-react";
import type { SessionPayload } from "@/lib/auth";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings",  label: "Bookings",   icon: CalendarCheck },
  { href: "/admin/rooms",     label: "Rooms",      icon: BedDouble },
  { href: "/admin/guests",    label: "Guests",     icon: Users },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart3 },
  { href: "/admin/settings",  label: "Settings",   icon: Settings },
];

interface Props {
  session:  SessionPayload;
  children: React.ReactNode;
}

export function AdminShell({ session, children }: Props) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  };

  const isActive = (item: typeof NAV[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-obsidian-800">
        <Link href="/" target="_blank" className="block group">
          <p className="font-display text-xl text-ivory-100 tracking-[0.06em] group-hover:text-champagne-300 transition-colors">Markland</p>
          <p className="eyebrow text-2xs text-champagne-700 tracking-[0.35em] mt-0.5">Hotel & Spa</p>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-2xs text-obsidian-500 tracking-wider">Management System</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-body tracking-wide transition-all duration-150 group relative",
                active
                  ? "text-champagne-300 bg-champagne-900/20"
                  : "text-obsidian-400 hover:text-ivory-200 hover:bg-obsidian-800/50"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute left-0 top-1 bottom-1 w-0.5 bg-champagne-500"
                />
              )}
              <Icon size={15} className={cn("shrink-0", active ? "text-champagne-400" : "text-obsidian-600 group-hover:text-obsidian-300")} />
              {item.label}
              {active && <ChevronRight size={12} className="ml-auto text-champagne-600" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-obsidian-800 p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-champagne-900/40 border border-champagne-700/30 flex items-center justify-center text-champagne-400">
            <span className="text-xs font-display">
              {(session.firstName?.[0] ?? session.email[0]).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-ivory-300 truncate">
              {session.firstName ? `${session.firstName} ${session.lastName ?? ""}` : session.email}
            </p>
            <p className="text-2xs text-obsidian-500 capitalize">{session.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-obsidian-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-obsidian-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 border-r border-obsidian-800 bg-obsidian-950 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-obsidian-950/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-obsidian-800 bg-obsidian-950"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
            >
              <button
                className="absolute top-4 right-4 text-obsidian-400 hover:text-ivory-200"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-obsidian-800 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-obsidian-950">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-obsidian-400 hover:text-ivory-200 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <BreadcrumbNav pathname={pathname} />
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center text-obsidian-500 hover:text-ivory-200 transition-colors" aria-label="Notifications">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-champagne-500" />
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-obsidian-500 hover:text-champagne-400 transition-colors border border-obsidian-700 px-3 py-1.5"
            >
              <Sparkles size={11} />
              View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-obsidian-950">
          {children}
        </main>
      </div>
    </div>
  );
}

function BreadcrumbNav({ pathname }: { pathname: string }) {
  const parts  = pathname.split("/").filter(Boolean);
  const labels: Record<string, string> = {
    admin: "Dashboard", bookings: "Bookings", rooms: "Rooms",
    guests: "Guests", analytics: "Analytics", settings: "Settings",
  };

  return (
    <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
      {parts.map((part, i) => (
        <React.Fragment key={part}>
          {i > 0 && <ChevronRight size={12} className="text-obsidian-700" />}
          <span className={cn(
            "text-xs font-body capitalize",
            i === parts.length - 1 ? "text-ivory-300" : "text-obsidian-500"
          )}>
            {labels[part] ?? part}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}
