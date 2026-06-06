"use client";

// src/components/layout/SiteHeader.tsx
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const NAV_ITEMS = [
  { label: "Rooms & Suites",   href: "/rooms" },
  { label: "Spa & Wellness",   href: "/spa" },
  { label: "Dining",           href: "/dining" },
  { label: "Experiences",      href: "/experiences" },
  { label: "About",            href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop]           = useState(true);
  const headerRef                   = useRef<HTMLElement>(null);
  const isHome                      = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setAtTop(y < 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const headerBg = scrolled
    ? "bg-obsidian-950/95 backdrop-blur-md border-b border-obsidian-800"
    : isHome
    ? "bg-transparent"
    : "bg-obsidian-950";

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          headerBg
        )}
      >
        {/* Top bar */}
        <div
          className={cn(
            "border-b border-champagne-800/20 py-2 transition-all duration-300",
            scrolled && "hidden"
          )}
        >
          <div className="section-container flex items-center justify-between">
            <p className="eyebrow text-2xs text-obsidian-500 tracking-widest">
              Established 1923 · Luxury Redefined
            </p>
            <a
              href="tel:+35312345678"
              className="flex items-center gap-1.5 text-2xs tracking-wider font-body text-obsidian-400 hover:text-champagne-400 transition-colors"
            >
              <Phone size={10} />
              +353 1 234 5678
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col items-start leading-none group"
              aria-label="Markland Hotel & Spa — Home"
            >
              <span className="font-display text-2xl lg:text-3xl font-light tracking-[0.08em] text-ivory-100 group-hover:text-champagne-300 transition-colors duration-300">
                Markland
              </span>
              <span className="eyebrow text-2xs tracking-[0.4em] text-champagne-600 -mt-0.5">
                Hotel & Spa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative font-body text-xs tracking-[0.18em] uppercase transition-colors duration-200",
                    pathname.startsWith(item.href)
                      ? "text-champagne-400"
                      : "text-ivory-400 hover:text-ivory-100"
                  )}
                >
                  {item.label}
                  {pathname.startsWith(item.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-champagne-500"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="font-body text-xs tracking-[0.15em] uppercase text-ivory-400 hover:text-ivory-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/book"
                className="btn-luxury-primary text-2xs py-2.5 px-6"
              >
                Reserve Now
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden p-2 text-ivory-300 hover:text-champagne-400 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-obsidian-950 border-l border-obsidian-800 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
                <div>
                  <p className="font-display text-xl text-ivory-100">Markland</p>
                  <p className="eyebrow text-2xs tracking-widest text-champagne-600">
                    Hotel & Spa
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-obsidian-400 hover:text-ivory-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col p-6 gap-1 flex-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-3.5 font-body text-sm tracking-[0.15em] uppercase border-b border-obsidian-800/50 transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-champagne-400"
                          : "text-ivory-300 hover:text-champagne-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="p-6 border-t border-obsidian-800 space-y-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center btn-luxury-outline text-xs py-3"
                >
                  Sign In
                </Link>
                <Link
                  href="/book"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center btn-luxury-primary text-xs py-3"
                >
                  Reserve Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
