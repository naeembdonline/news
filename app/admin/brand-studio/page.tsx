"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Lock, X } from "lucide-react";

interface BrandSettings {
    publicationName: string;
    tagline: string;
    editionName: string;
    primaryColor: string;
    headlineFont: string;
    bodyFont: string;
}

const DEFAULT_SETTINGS: BrandSettings = {
    publicationName: "নয়া বাংলা",
    tagline: "নির্ভরযোগ্য সংবাদ, প্রতিদিন",
    editionName: "ঢাকা সংস্করণ",
    primaryColor: "#B91C1C", // Deep Crimson
    headlineFont: "'Anek Bangla', sans-serif",
    bodyFont: "'Hind Siliguri', sans-serif",
};

const COLOR_PRESETS = [
    {
        name: "ডিপ ক্রিমসন (Deep Crimson)",
        hex: "#B91C1C",
        description: "ঐতিহ্যবাহী সংবাদপত্র ও প্রধান সংবাদ প্রকাশনার লাল আভা",
    },
    {
        name: "নেভি ব্লু (Navy Blue)",
        hex: "#1E3A8A",
        description: "আধুনিক, আন্তর্জাতিক ও বিশ্বাসযোগ্য গম্ভীর নীল আভা",
    },
    {
        name: "ফরেস্ট গ্রিন (Forest Green)",
        hex: "#15803D",
        description: "প্রগতিশীল, অর্থনৈতিক ও পরিবেশ বিষয়ক গভীর সবুজ আভা",
    },
];

const HEADLINE_FONTS = [
    {
        label: "Anek Bangla (অ্যানেক বাংলা)",
        value: "'Anek Bangla', sans-serif",
        desc: "আধুনিক, স্পষ্ট ও শক্তিশালী শিরোনামের জন্য আদর্শ",
    },
    {
        label: "Kalpurush (ক্যালপুরুষ)",
        value: "'Kalpurush', 'Hind Siliguri', serif",
        desc: "চিরায়ত বাংলা সংবাদপত্র ও ক্লাসিক মুদ্রণশৈলীর ফন্ট",
    },
];

const BODY_FONTS = [
    {
        label: "Hind Siliguri (হিন্দ শিলিগুড়ি)",
        value: "'Hind Siliguri', sans-serif",
        desc: "দীর্ঘ সংবাদ ও নিবন্ধ সহজে পাঠযোগ্য ও চোখের জন্য আরামদায়ক",
    },
    {
        label: "Anek Bangla (অ্যানেক বাংলা)",
        value: "'Anek Bangla', sans-serif",
        desc: "কমপ্যাক্ট অনুচ্ছেদ ও আধুনিক ডিজিটাল স্ক্রিনের জন্য উপযোগী",
    },
];

export default function BrandStudioPage() {
    const [settings, setSettings] = useState<BrandSettings>(DEFAULT_SETTINGS);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "info">("success");

    // Load saved settings from localStorage on client mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("craftera_brand_settings");
            if (saved) {
                const parsed = JSON.parse(saved);
                setSettings((prev) => ({ ...prev, ...parsed }));
            }
        } catch {
            // Ignore storage errors
        }
    }, []);

    // Auto dismiss toast
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 3500);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    const showToast = (message: string, type: "success" | "info" = "success") => {
        setToastMessage(message);
        setToastType(type);
    };

    const handleSave = () => {
        try {
            localStorage.setItem("craftera_brand_settings", JSON.stringify(settings));
        } catch {
            // Ignore storage errors
        }
        showToast("ব্র্যান্ড সেটিংস সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        try {
            localStorage.removeItem("craftera_brand_settings");
        } catch {
            // Ignore storage errors
        }
        showToast("ব্র্যান্ড সেটিংস ডিফল্ট মানে রিসেট করা হয়েছে।", "info");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* ─── Page Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>ড্যাশবোর্ড</span>
                        <span>›</span>
                        <span className="text-slate-800 font-semibold">ব্র্যান্ড স্টুডিও</span>
                    </nav>
                    <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        ব্র্যান্ড স্টুডিও (Brand Studio)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        পত্রিকার ভিজ্যুয়াল পরিচয়, প্রকাশনা তথ্য, কালার প্যালেট ও টাইপোগ্রাফি রিয়েল-টাইমে কাস্টমাইজ করুন।
                    </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        রিসেট করুন
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2 text-xs font-bold rounded-md text-white transition-all shadow-sm flex items-center gap-1.5"
                        style={{
                            backgroundColor: settings.primaryColor,
                            fontFamily: "var(--font-headline)",
                        }}
                    >
                        <Check className="w-3.5 h-3.5" />
                        <span>সংরক্ষণ করুন</span>
                    </button>
                </div>
            </div>

            {/* ─── Main Studio Grid: Form Controls vs Live Preview ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ─── Left Column: Configuration Forms (7 cols) ─── */}
                <div className="lg:col-span-7 space-y-6">
                    {/* 1. Identity Form Card */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
                            <h2
                                className="text-base font-bold text-slate-900"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                ১. প্রকাশনা পরিচয় (Identity)
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {/* Publication Name */}
                            <div>
                                <label
                                    htmlFor="pub-name"
                                    className="block text-xs font-bold text-slate-700 mb-1.5"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    পত্রিকার নাম (Publication Name)
                                </label>
                                <input
                                    id="pub-name"
                                    type="text"
                                    value={settings.publicationName}
                                    onChange={(e) =>
                                        setSettings({ ...settings, publicationName: e.target.value })
                                    }
                                    placeholder="নয়া বাংলা"
                                    className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">
                                    ওয়েবসাইটের মূল মাস্টহেড ও মেটাডেটায় এই নামটি প্রদর্শিত হবে।
                                </p>
                            </div>

                            {/* Tagline */}
                            <div>
                                <label
                                    htmlFor="pub-tagline"
                                    className="block text-xs font-bold text-slate-700 mb-1.5"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    ট্যাগলাইন (Tagline / স্লোগান)
                                </label>
                                <input
                                    id="pub-tagline"
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) =>
                                        setSettings({ ...settings, tagline: e.target.value })
                                    }
                                    placeholder="নির্ভরযোগ্য সংবাদ, প্রতিদিন"
                                    className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">
                                    মাস্টহেডের লোগোর নিচে ছোট অক্ষরে ট্যাগলাইন দেখানো হয়।
                                </p>
                            </div>

                            {/* Edition Name */}
                            <div>
                                <label
                                    htmlFor="pub-edition"
                                    className="block text-xs font-bold text-slate-700 mb-1.5"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    সংস্করণ নাম (Edition)
                                </label>
                                <input
                                    id="pub-edition"
                                    type="text"
                                    value={settings.editionName}
                                    onChange={(e) =>
                                        setSettings({ ...settings, editionName: e.target.value })
                                    }
                                    placeholder="ঢাকা সংস্করণ"
                                    className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">
                                    বর্তমান প্রিন্ট ও অনলাইন সংস্করণের নাম (যেমন: ঢাকা সংস্করণ, জাতীয় সংস্করণ)।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Color Palette Selector Card */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
                            <h2
                                className="text-base font-bold text-slate-900"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                ২. কালার প্যালেট নির্বাচন (Color Palette)
                            </h2>
                        </div>

                        <div>
                            <span
                                className="block text-xs font-bold text-slate-700 mb-3"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                এডিটরিয়াল প্রিসেট (Editorial Presets)
                            </span>

                            {/* Presets List */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                                {COLOR_PRESETS.map((preset) => {
                                    const isSelected = settings.primaryColor.toUpperCase() === preset.hex.toUpperCase();
                                    return (
                                        <button
                                            key={preset.hex}
                                            type="button"
                                            onClick={() => setSettings({ ...settings, primaryColor: preset.hex })}
                                            className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between h-full ${
                                                isSelected
                                                    ? "border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                                                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full shadow-inner border border-white"
                                                        style={{ backgroundColor: preset.hex }}
                                                    />
                                                    {isSelected && (
                                                        <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-slate-900">
                                                            সক্রিয়
                                                        </span>
                                                    )}
                                                </div>
                                                <div
                                                    className="text-xs font-bold text-slate-900"
                                                    style={{ fontFamily: "var(--font-headline)" }}
                                                >
                                                    {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
                                                </div>
                                                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                                    {preset.hex}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                                                {preset.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Hex Color Picker */}
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <label
                                    htmlFor="custom-hex"
                                    className="block text-xs font-bold text-slate-700 mb-2"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    কাস্টম প্রাইমারি কালার (Custom Color)
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) =>
                                                setSettings({ ...settings, primaryColor: e.target.value })
                                            }
                                            className="w-10 h-10 rounded cursor-pointer border border-slate-300 p-0.5 bg-white"
                                            aria-label="রং নির্বাচন করুন"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            id="custom-hex"
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) =>
                                                setSettings({ ...settings, primaryColor: e.target.value })
                                            }
                                            placeholder="#B91C1C"
                                            className="w-full px-3 py-2 text-sm font-mono rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                                        />
                                    </div>
                                    <div
                                        className="px-3 py-2 rounded text-xs font-bold text-white shadow-2xs"
                                        style={{ backgroundColor: settings.primaryColor }}
                                    >
                                        নমুনা
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Typography Selector Card */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
                            <h2
                                className="text-base font-bold text-slate-900"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                ৩. টাইপোগ্রাফি নির্বাচন (Typography)
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {/* Headline Font Dropdown */}
                            <div>
                                <label
                                    htmlFor="headline-font"
                                    className="block text-xs font-bold text-slate-700 mb-1.5"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    শিরোনামের ফন্ট (Headline Font)
                                </label>
                                <select
                                    id="headline-font"
                                    value={settings.headlineFont}
                                    onChange={(e) =>
                                        setSettings({ ...settings, headlineFont: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                                >
                                    {HEADLINE_FONTS.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1.5 text-xs text-slate-500">
                                    {HEADLINE_FONTS.find((f) => f.value === settings.headlineFont)?.desc}
                                </p>
                            </div>

                            {/* Body Font Dropdown */}
                            <div>
                                <label
                                    htmlFor="body-font"
                                    className="block text-xs font-bold text-slate-700 mb-1.5"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    বডি টেক্সট ফন্ট (Body Font)
                                </label>
                                <select
                                    id="body-font"
                                    value={settings.bodyFont}
                                    onChange={(e) =>
                                        setSettings({ ...settings, bodyFont: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                                >
                                    {BODY_FONTS.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1.5 text-xs text-slate-500">
                                    {BODY_FONTS.find((f) => f.value === settings.bodyFont)?.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Right Column: Live Side-by-Side Preview (5 cols) ─── */}
                <div className="lg:col-span-5 sticky top-20 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2
                                className="text-base font-extrabold text-slate-900"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                লাইভ প্রিভিউ (Live Preview)
                            </h2>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                            রিয়েল-টাইম রেন্ডার
                        </span>
                    </div>

                    {/* Preview Container Frame */}
                    <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden">
                        {/* Browser simulated header */}
                        <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                            </div>
                            <div className="px-3 py-0.5 rounded bg-white text-[11px] font-mono text-slate-600 border border-slate-200 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-emerald-600" />
                                <span>https://noyabangla.com.bd</span>
                            </div>
                            <div className="text-[10px] text-slate-400">মক ভিউ</div>
                        </div>

                        <div className="p-4 sm:p-5 space-y-5 bg-white">
                            {/* ─── 1. Masthead Preview ─── */}
                            <div className="pb-4 border-b border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div
                                            className="text-2xl font-black tracking-tight"
                                            style={{
                                                fontFamily: settings.headlineFont,
                                                color: "#0F172A",
                                            }}
                                        >
                                            {settings.publicationName || "নয়া বাংলা"}
                                        </div>
                                        <div
                                            className="text-[11px]"
                                            style={{
                                                fontFamily: settings.bodyFont,
                                                color: "#64748B",
                                            }}
                                        >
                                            {settings.tagline || "নির্ভরযোগ্য সংবাদ, প্রতিদিন"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-400">
                                            মঙ্গলবার, ৬ অক্টোবর ২০২৬
                                        </div>
                                        <div
                                            className="text-xs font-semibold"
                                            style={{
                                                fontFamily: settings.headlineFont,
                                                color: settings.primaryColor,
                                            }}
                                        >
                                            {settings.editionName || "ঢাকা সংস্করণ"}
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Navigation bar */}
                                <div className="flex items-center gap-3 pt-2 text-xs border-t border-slate-100 overflow-x-auto">
                                    <span
                                        className="font-bold pb-1 border-b-2 whitespace-nowrap"
                                        style={{
                                            color: settings.primaryColor,
                                            borderColor: settings.primaryColor,
                                            fontFamily: settings.headlineFont,
                                        }}
                                    >
                                        জাতীয়
                                    </span>
                                    {["রাজনীতি", "অর্থনীতি", "খেলাধুলা", "প্রযুক্তি"].map((cat) => (
                                        <span
                                            key={cat}
                                            className="text-slate-600 hover:text-slate-900 pb-1 font-medium whitespace-nowrap cursor-default"
                                            style={{ fontFamily: settings.headlineFont }}
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* ─── 2. Breaking Badge Preview ─── */}
                            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                                <div
                                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1.5 flex-shrink-0"
                                    style={{
                                        backgroundColor: settings.primaryColor,
                                        fontFamily: settings.headlineFont,
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span>ব্রেকিং</span>
                                </div>
                                <div
                                    className="text-xs text-slate-800 truncate"
                                    style={{ fontFamily: settings.bodyFont }}
                                >
                                    ঢাকায় ৭.২ মাত্রার ভূমিকম্প অনুভূত, বেশ কয়েকটি ভবনে ফাটল
                                </div>
                            </div>

                            {/* ─── 3. Sample News Card Preview ─── */}
                            <div className="rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                                <div className="relative w-full h-36 bg-slate-200 overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80"
                                        alt="ক্রিকেট ম্যাচ নমুনা"
                                        fill
                                        className="object-cover"
                                        sizes="400px"
                                    />
                                    <div
                                        className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                                        style={{
                                            backgroundColor: settings.primaryColor,
                                            fontFamily: settings.headlineFont,
                                        }}
                                    >
                                        খেলাধুলা
                                    </div>
                                </div>

                                <div className="p-3.5 space-y-2">
                                    <h3
                                        className="text-sm font-bold leading-snug line-clamp-2"
                                        style={{
                                            fontFamily: settings.headlineFont,
                                            color: "#0F172A",
                                        }}
                                    >
                                        বাংলাদেশ-পাকিস্তান টি-টোয়েন্টি: রোমাঞ্চকর জয়ে বাংলাদেশ শীর্ষে
                                    </h3>
                                    <p
                                        className="text-xs text-slate-600 line-clamp-2 leading-relaxed"
                                        style={{ fontFamily: settings.bodyFont }}
                                    >
                                        শেষ ওভারে মুস্তাফিজুর রহমানের দুর্দান্ত বোলিংয়ে পাকিস্তানকে ৫ উইকেটে হারিয়েছে টাইগাররা।
                                    </p>
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                        <span style={{ fontFamily: settings.bodyFont }}>রাহুল দে</span>
                                        <span>৩ মিনিট পড়া</span>
                                    </div>
                                </div>
                            </div>

                            {/* ─── 4. Component Palette Swatches ─── */}
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    কম্পোনেন্ট স্টাইল গাইড
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded text-xs font-semibold text-white shadow-2xs"
                                        style={{
                                            backgroundColor: settings.primaryColor,
                                            fontFamily: settings.headlineFont,
                                        }}
                                    >
                                        প্রাইমারি বাটন
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded text-xs font-semibold border bg-white"
                                        style={{
                                            borderColor: settings.primaryColor,
                                            color: settings.primaryColor,
                                            fontFamily: settings.headlineFont,
                                        }}
                                    >
                                        আউটলাইন বাটন
                                    </button>
                                    <span
                                        className="px-2 py-1 rounded text-[11px] font-medium"
                                        style={{
                                            backgroundColor: `${settings.primaryColor}15`,
                                            color: settings.primaryColor,
                                            fontFamily: settings.headlineFont,
                                        }}
                                    >
                                        ট্যাগ ব্যাজ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Toast Feedback Floating Banner ─── */}
            {toastMessage && (
                <div
                    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-xl border animate-slide-up ${
                        toastType === "success" ? "border-emerald-500/50" : "border-slate-700"
                    }`}
                    role="alert"
                >
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                            backgroundColor: toastType === "success" ? "#10B981" : settings.primaryColor,
                        }}
                    />
                    <span
                        className="text-xs sm:text-sm font-semibold"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        {toastMessage}
                    </span>
                    <button
                        type="button"
                        onClick={() => setToastMessage(null)}
                        className="ml-2 text-slate-400 hover:text-white text-xs font-bold p-1"
                        aria-label="বার্তা বন্ধ করুন"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
