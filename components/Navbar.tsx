"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingBag, LayoutDashboard, Shield, Shirt, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/design", label: "Studio", icon: Sparkles },
    { href: "/shop", label: "Marketplace", icon: ShoppingBag },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center group-hover:border-primary transition-colors">
            <Shirt className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-primary transition-colors">
              PROMPT<span className="text-primary">WEAR</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 -mt-1">
              Describe it. Wear it.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-zinc-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-primary border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-zinc-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px]">Ideogram v3 AI</span>
          </div>
          <Link
            href="/design"
            className="flex items-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-primary/20 hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Design</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-1 sm:hidden"><ThemeToggle /></div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${
                  isActive ? "bg-zinc-900 text-primary font-semibold" : "text-zinc-400 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/design"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold bg-primary text-black py-2.5 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Design</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
