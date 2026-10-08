"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { label: "জাতীয়", href: "/category/national" },
    { label: "রাজনীতি", href: "/category/politics" },
    { label: "অর্থনীতি", href: "/category/economy" },
    { label: "আন্তর্জাতিক", href: "/category/international" },
    { label: "খেলাধুলা", href: "/category/sports" },
    { label: "প্রযুক্তি", href: "/category/tech" },
    { label: "বিনোদন", href: "/category/entertainment" },
    { label: "মতামত", href: "/category/opinion" },
];

export default function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    // Close drawer on escape key press or resize to desktop
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsDrawerOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsDrawerOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Close drawer when route changes
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    return (
        <header
            className="sticky top-0 z-40 bg-white"
            style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
            {/* Top masthead */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3.5 md:py-4">
                {/* Logo */}
                <Link href="/" className="flex flex-col leading-tight">
                    <span
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                        style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                    >
                        নয়া বাংলা
                    </span>
                    <span
                        className="text-[11px] md:text-xs mt-0.5"
                        style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", letterSpacing: "0.05em" }}
                    >
                        নির্ভরযোগ্য সংবাদ, প্রতিদিন
                    </span>
                </Link>

                {/* Desktop Date & edition */}
                <div className="hidden md:flex flex-col items-end gap-0">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                        মঙ্গলবার, ৬ অক্টোবর ২০২৬
                    </span>
                    <span
                        className="text-xs font-medium"
                        style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)" }}
                    >
                        ঢাকা সংস্করণ
                    </span>
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 -mr-1 rounded-md text-slate-800 hover:text-red-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1"
                        aria-label="মেনু খুলুন"
                        aria-expanded={isDrawerOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Desktop Horizontal Navigation bar */}
            <nav
                className="hidden md:flex max-w-7xl mx-auto items-center gap-0 px-4 md:px-8 overflow-x-auto"
                style={{ borderTop: "1px solid var(--border-primary)", scrollbarWidth: "none" }}
                aria-label="প্রধান নেভিগেশন"
            >
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex-shrink-0 px-4 py-2.5 text-sm transition-colors duration-150 hover:text-red-700 relative ${
                                isActive ? "font-bold text-red-700" : "font-medium"
                            }`}
                            style={{
                                fontFamily: "var(--font-headline)",
                                fontSize: "0.85rem",
                                color: isActive ? "var(--accent-red)" : "var(--text-secondary)",
                            }}
                        >
                            {link.label}
                            {isActive && (
                                <span
                                    className="absolute bottom-0 left-4 right-4 h-0.5"
                                    style={{ background: "var(--accent-red)" }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Horizontal Quick-Scroll Bar */}
            <nav
                className="flex md:hidden max-w-7xl mx-auto items-center gap-0 px-3 overflow-x-auto"
                style={{ borderTop: "1px solid var(--border-primary)", scrollbarWidth: "none" }}
                aria-label="দ্রুত বিভাগসমূহ"
            >
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex-shrink-0 px-3 py-2 text-xs transition-colors duration-150 hover:text-red-700 whitespace-nowrap ${
                                isActive ? "font-bold text-red-700" : "font-medium"
                            }`}
                            style={{
                                fontFamily: "var(--font-headline)",
                                color: isActive ? "var(--accent-red)" : "var(--text-secondary)",
                            }}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* ─── Mobile Slide-over Hamburger Drawer ─── */}
            <div
                className={`fixed inset-0 z-50 md:hidden transition-visibility duration-300 ${
                    isDrawerOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="মোবাইল নেভিগেশন মেনু"
            >
                {/* Backdrop Overlay */}
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
                        isDrawerOpen ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Slide-over Drawer Panel */}
                <div
                    className={`fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out transform ${
                        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Drawer Header */}
                    <div
                        className="p-5 flex items-center justify-between border-b"
                        style={{ borderColor: "var(--border-primary)" }}
                    >
                        <Link
                            href="/"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex flex-col leading-tight"
                        >
                            <span
                                className="text-2xl font-black tracking-tight"
                                style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                            >
                                নয়া বাংলা
                            </span>
                            <span
                                className="text-[11px]"
                                style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                            >
                                সত্যের সন্ধানে, সবসময়
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
                            aria-label="মেনু বন্ধ করুন"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Edition & Date Pill */}
                    <div
                        className="px-5 py-3 border-b flex flex-col gap-0.5"
                        style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-primary)",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                            <span
                                className="text-xs font-semibold"
                                style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)" }}
                            >
                                ঢাকা সংস্করণ • লাইভ
                            </span>
                        </div>
                        <span
                            className="text-[11px]"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                        >
                            মঙ্গলবার, ৬ অক্টোবর ২০২৬
                        </span>
                    </div>

                    {/* Navigation Links list */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                        <Link
                            href="/"
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm font-semibold transition-colors ${
                                pathname === "/"
                                    ? "bg-red-50 text-red-700 font-bold"
                                    : "text-slate-800 hover:bg-slate-50 hover:text-red-700"
                            }`}
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            <span>হোমপেজ</span>
                            <span className="text-xs text-slate-400">›</span>
                        </Link>

                        <div className="py-2 px-3">
                            <span
                                className="text-[11px] font-bold uppercase tracking-wider block"
                                style={{ color: "var(--text-faint)", fontFamily: "var(--font-headline)" }}
                            >
                                বিভাগসমূহ
                            </span>
                        </div>

                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm transition-colors ${
                                        isActive
                                            ? "bg-red-50 text-red-700 font-bold border-l-3 border-red-700"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-red-700 font-medium"
                                    }`}
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    <span>{link.label}</span>
                                    <span
                                        className={`text-xs ${
                                            isActive ? "text-red-600 font-bold" : "text-slate-400"
                                        }`}
                                    >
                                        ›
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Drawer Footer */}
                    <div
                        className="p-4 border-t text-xs flex flex-col gap-2"
                        style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-primary)",
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700">নয়া বাংলা ডিজিটাল</span>
                            <span className="text-[10px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded">v1.0</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                            © ২০২৬ নয়া বাংলা। সমস্ত স্বত্ব সংরক্ষিত।
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
