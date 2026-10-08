"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    ExternalLink,
    ChevronRight,
    Info,
} from "lucide-react";
import { toBengaliNumber } from "@/lib/bengaliUtils";

interface AdSlotItem {
    id: string;
    name: string;
    location: string;
    size: string;
    status: "সক্রিয়" | "খালি";
    advertiser: string;
    rate: string;
    previewUrl: string;
}

const INITIAL_SLOTS: AdSlotItem[] = [
    {
        id: "ad-1",
        name: "হোমপেজ মিড-ফিড ব্যানার",
        location: "হোমপেজ — লিড স্টোরি ও ক্যাটাগরির মধ্যবর্তী অবস্থান",
        size: "৯৭০ × ৯০ / ৭২৮ × ৯০ (রেসপনসিভ)",
        status: "সক্রিয়",
        advertiser: "নয়া বাংলা সেলস ডেস্ক / কর্পোরেট স্পনসর",
        rate: "৳ ২৫,০০০ / সপ্তাহ",
        previewUrl: "/",
    },
    {
        id: "ad-2",
        name: "আর্টিকেল ১ম বডি স্লট",
        location: "আর্টিকেল ডিটেইলস — ৩য় অনুচ্ছেদের পরে",
        size: "৭২০ × ১২০ (ইন-আর্টিকেল ব্যানার)",
        status: "সক্রিয়",
        advertiser: "কমার্শিয়াল পার্টনার",
        rate: "৳ ১৮,০০০ / সপ্তাহ",
        previewUrl: "/article/bangladesh-cricket-series-preparation-2026",
    },
    {
        id: "ad-3",
        name: "আর্টিকেল ২য় বডি স্লট (লোয়ার)",
        location: "আর্টিকেল ডিটেইলস — শেষ অনুচ্ছেদের পূর্বে",
        size: "৭২০ × ১২০ (ইন-আর্টিকেল ব্যানার)",
        status: "সক্রিয়",
        advertiser: "ডিজিটাল ক্যাম্পেইন",
        rate: "৳ ১৫,০০০ / সপ্তাহ",
        previewUrl: "/article/bangladesh-cricket-series-preparation-2026",
    },
    {
        id: "ad-4",
        name: "আর্টিকেল ডেস্কটপ সাইডবার",
        location: "আর্টিকেল ডিটেইলস — ডেস্কটপ ডানদিকের স্টিকি সাইডবার",
        size: "৩০০ × ২৫০ (মিডিয়াম রেকট্যাঙ্গেল)",
        status: "সক্রিয়",
        advertiser: "স্পনসরড প্লেসমেন্ট",
        rate: "৳ ২০,০০০ / সপ্তাহ",
        previewUrl: "/article/bangladesh-cricket-series-preparation-2026",
    },
    {
        id: "ad-5",
        name: "ক্যাটাগরি ইন-গ্রিড ন্যাটিভ স্লট",
        location: "ক্যাটাগরি আর্কাইভ পেজ — নিউজ গ্রিডের ভেতর ৩য় কার্ড হিসেবে",
        size: "রেসপনসিভ ন্যাটিভ কার্ড (ইন-গ্রিড)",
        status: "সক্রিয়",
        advertiser: "পার্টনারশিপ ব্র্যান্ড",
        rate: "৳ ১২,০০০ / সপ্তাহ",
        previewUrl: "/category/national",
    },
    {
        id: "ad-6",
        name: "হোমপেজ টপ ব্যানার",
        location: "হোমপেজ — মাস্টহেড ও ন্যাভবারের ঠিক নিচে",
        size: "৭২৮ × ৯০ (লিডারবোর্ড)",
        status: "খালি",
        advertiser: "বুকিং উন্মুক্ত",
        rate: "৳ ৩০,০০০ / সপ্তাহ",
        previewUrl: "/",
    },
];

export default function AdminAdsPage() {
    const [slots, setSlots] = useState<AdSlotItem[]>(INITIAL_SLOTS);

    const toggleSlotStatus = (id: string) => {
        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, status: s.status === "সক্রিয়" ? ("খালি" as const) : ("সক্রিয়" as const) }
                    : s
            )
        );
    };

    const activeCount = slots.filter((s) => s.status === "সক্রিয়").length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Link href="/admin" className="hover:text-slate-800">ড্যাশবোর্ড</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 font-semibold">বিজ্ঞাপন স্লট</span>
                    </nav>
                    <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        বিজ্ঞাপন স্লট ব্যবস্থাপনা (Ad Slots Management)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        ওয়েবসাইটের হোমপেজ মিড-ফিড, আর্টিকেলের ভেতর একাধিক স্লট, সাইডবার ও ক্যাটাগরি গ্রিড বিজ্ঞাপন অবস্থান।
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>সক্রিয় স্লট: {toBengaliNumber(activeCount)} / {toBengaliNumber(slots.length)} টি</span>
                    </span>
                </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((item) => {
                    const isActive = item.status === "সক্রিয়";

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className="font-bold text-slate-900 text-base"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        {item.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleSlotStatus(item.id)}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                                            isActive
                                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                        }`}
                                    >
                                        {item.status}
                                    </button>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {item.location}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="text-slate-400">সাইজ:</span>
                                    <span className="font-mono font-medium">{item.size}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="text-slate-400">বিজ্ঞাপনদাতা:</span>
                                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{item.advertiser}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="text-slate-400">আনুমানিক রেট:</span>
                                    <span className="font-bold text-red-700">{item.rate}</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={item.previewUrl}
                                    target="_blank"
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                                >
                                    <span>সাইটে দেখুন</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                </Link>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    ID: {item.id}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info notice */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    বিজ্ঞাপন স্লটগুলো স্বয়ংক্রিয়ভাবে রেসপনসিভ গ্রিড ও আর্টিকেলের নির্ধারিত পজিশনে লোড হয়। Google AdSense বা ডিরেক্ট স্পনসরড ইমেজ কোড সংযোগের জন্য হেড ট্যাগ ও স্লট আইডি ব্যবহার করা যায়।
                </p>
            </div>
        </div>
    );
}
