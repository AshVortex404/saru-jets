"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { NAV_LINKS, CONTACT } from "@/lib/constants";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-10 lg:px-14"
    >
      {/* Subtle top gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      <nav className="relative flex items-center justify-between gap-4">
        {/* Left Nav */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[11px] uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors duration-300"
                id={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Center Brand */}
        <div className="flex-1 md:flex-none text-center">
          <Link href="/" id="nav-brand" className="block">
            <span className="text-[15px] font-medium tracking-[0.12em] text-white whitespace-nowrap">
              {copy.brand}
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.slice(2).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors duration-300"
              id={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${CONTACT.phone}`}
            className="text-[11px] uppercase tracking-[0.12em] text-white/40 hover:text-white/80 transition-colors duration-300 ml-2"
            id="nav-phone"
          >
            {CONTACT.phone}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-menu-toggle"
          className="md:hidden text-white/60 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <motion.rect
              x="0" y="0" width="22" height="1.5" rx="1" fill="currentColor"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x="0" y="7" width="22" height="1.5" rx="1" fill="currentColor"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.rect
              x="0" y="14" width="22" height="1.5" rx="1" fill="currentColor"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative md:hidden overflow-hidden"
      >
        <div className="pt-6 pb-4 flex flex-col gap-5 border-t border-white/10 mt-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`mobile-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className="text-[13px] uppercase tracking-[0.14em] text-white/70"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href={`tel:${CONTACT.phone}`} className="text-[11px] text-white/40 mt-2">
            {CONTACT.phone}
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
