"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Palette,
    Megaphone,
    Users,
    Settings,
    Menu,
    X,
    ExternalLink,
    ArrowRight,
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
    {
        label: "ড্যাশবোর্ড",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "সংবাদ ব্যবস্থাপনা",
        href: "/admin/articles",
        icon: FileText,
    },
    {
        label: "ব্যবহারকারী ও রোল",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "ব্র্যান্ড স্টুডিও",
        href: "/admin/brand-studio",
        icon: Palette,
        badge: "নতুন",
    },
    {
        label: "বিজ্ঞাপন স্লট",
        href: "/admin/ads",
        icon: Megaphone,
    },
    {
        label: "সেটিংস",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
            {/* Top Bar - Sticky Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                        aria-label="সাইডবার মেনু টগল করুন"
                    >
                        {isMobileSidebarOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Admin Logo / Brand */}
                    <Link href="/admin" className="flex items-center gap-2">
                        <span
                            className="text-xl font-black text-slate-900 tracking-tight"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            নয়া বাংলা
                        </span>
                        <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            এডমিন
                        </span>
                    </Link>
                </div>

                {/* Right Top Bar Area: Publication Badge */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Current Publication Badge: "নয়া বাংলা - লাইভ" */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span style={{ fontFamily: "var(--font-headline)" }}>
                            নয়া বাংলা - লাইভ
                        </span>
                    </div>

                    {/* View Public Website */}
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-slate-50 px-3 py-1.5 rounded border border-slate-200 transition-colors"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <span>ওয়েবসাইট দেখুন</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    {/* Admin User Profile Chip */}
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            ন
                        </div>
                        <div className="hidden xl:flex flex-col leading-tight">
                            <span className="text-xs font-bold text-slate-800">এডমিন ডেস্ক</span>
                            <span className="text-[10px] text-slate-500">প্রধান সম্পাদক</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-visible">
                {/* ─── Desktop Sticky Sidebar ─── */}
                <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 flex-shrink-0 border-r border-slate-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20">
                    {/* Sidebar Brand Section */}
                    <div className="p-5 border-b border-slate-800 flex-shrink-0">
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                            সম্পাদনা ব্যবস্থাপনা
                        </div>
                        <div
                            className="text-lg font-bold text-white"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            সেন্ট্রাল কন্ট্রোল
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {SIDEBAR_ITEMS.map((item) => {
                            const IconComponent = item.icon;
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-red-600 text-white shadow-sm font-semibold"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span
                                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                isActive
                                                    ? "bg-white text-red-700"
                                                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer Link */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex-shrink-0">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            <span>লাইভ পোর্টাল দেখুন</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </aside>

                {/* ─── Mobile Sidebar Overlay & Drawer ─── */}
                {isMobileSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 text-slate-200 z-10 shadow-xl">
                            <div className="p-5 flex items-center justify-between border-b border-slate-800">
                                <div>
                                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                        এডমিন প্যানেল
                                    </div>
                                    <div
                                        className="text-lg font-bold text-white"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        নয়া বাংলা
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                                    aria-label="মেনু বন্ধ করুন"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                                {SIDEBAR_ITEMS.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive =
                                        item.href === "/admin"
                                            ? pathname === "/admin"
                                            : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileSidebarOpen(false)}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                                                isActive
                                                    ? "bg-red-600 text-white font-semibold"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`}
                                            style={{ fontFamily: "var(--font-headline)" }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <IconComponent className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                                <Link
                                    href="/"
                                    target="_blank"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="flex items-center justify-between text-xs text-slate-400 hover:text-white"
                                >
                                    <span>ওয়েবসাইটে ফিরে যান</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Main Content Canvas ─── */}
                <main className="flex-1 overflow-y-auto bg-slate-50 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
