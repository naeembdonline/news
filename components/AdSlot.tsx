import { Info, ExternalLink } from "lucide-react";

interface AdSlotProps {
    format: "mid-feed" | "article-body" | "article-sidebar" | "category-grid" | "leaderboard";
    slotName?: string;
    className?: string;
}

export default function AdSlot({ format, slotName, className = "" }: AdSlotProps) {
    if (format === "mid-feed") {
        return (
            <div
                className={`w-full my-10 p-4 rounded-lg bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border border-slate-200 text-center relative overflow-hidden ${className}`}
                role="region"
                aria-label="মিড-ফিড বিজ্ঞাপন স্লট"
            >
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">
                    <span className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>বিজ্ঞাপন</span>
                    </span>
                    <span>{slotName || "হোমপেজ মিড-ফিড ব্যানার"} • ৯৭০ × ৯০</span>
                </div>
                <div className="py-6 px-4 bg-white/80 rounded-md border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                        <div
                            className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            নয়া বাংলা ডিজিটাল প্ল্যাটফর্মে আপনার পণ্যের বিজ্ঞাপন দিন
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            প্রতিদিন ৫ লাখেরও বেশি সচেতন পাঠকের কাছে পৌঁছান সেরা বিজ্ঞাপনী সুবিধায়।
                        </p>
                    </div>
                    <a
                        href="mailto:ads@noyabangla.com.bd"
                        className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <span>বিজ্ঞাপন বুকিং</span>
                        <ExternalLink className="w-3 h-3 text-slate-300" />
                    </a>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    যোগাযোগ: ads@noyabangla.com.bd | ০১৯০০-০০০০০০
                </div>
            </div>
        );
    }

    if (format === "article-sidebar") {
        return (
            <div
                className={`w-full rounded-lg bg-slate-50 border border-slate-200 p-4 text-center shadow-2xs space-y-3 ${className}`}
                role="region"
                aria-label="আর্টিকেল সাইডবার বিজ্ঞাপন"
            >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        <span>স্পনসরড</span>
                    </span>
                    <span>৩০০ × ২৫০</span>
                </div>
                <div className="p-6 bg-white rounded-md border border-slate-200 flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-black text-base border border-red-100">
                        ন
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-headline)" }}>
                            প্রাইম সাইডবার স্পট
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                            আর্টিকেলের পাঠকদের সর্বাধিক মনোযোগের জন্য নিবেদিত স্থান
                        </p>
                    </div>
                    <a
                        href="mailto:ads@noyabangla.com.bd"
                        className="px-3.5 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        বিজ্ঞাপন স্লট রিজার্ভ করুন
                    </a>
                </div>
            </div>
        );
    }

    if (format === "category-grid") {
        return (
            <div
                className={`h-full rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-5 flex flex-col justify-between shadow-2xs ${className}`}
                role="region"
                aria-label="ক্যাটাগরি ইন-গ্রিড বিজ্ঞাপন"
            >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pb-2 border-b border-slate-200">
                    <span className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>স্পনসরড অ্যাড</span>
                    </span>
                    <span>ইন-গ্রিড স্লট</span>
                </div>

                <div className="my-auto py-6 text-center space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        বিশেষ পার্টনারশিপ
                    </span>
                    <h3
                        className="text-base font-bold text-slate-900 leading-snug"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        বিভাগীয় শীর্ষ পাঠকদের কাছে আপনার ব্র্যান্ড তুলে ধরুন
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3">
                        ন্যাটিভ ফরম্যাটে বিজ্ঞাপন প্রদর্শন করে পান ৩ গুণ বেশি এনগেজমেন্ট ও ব্র্যান্ড ভিজিবিলিটি।
                    </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">ads@noyabangla.com.bd</span>
                    <a
                        href="mailto:ads@noyabangla.com.bd"
                        className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <span>বিস্তারিত</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        );
    }

    // Default: article-body (horizontal slot)
    return (
        <div
            className={`w-full rounded-lg my-8 p-4 bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center gap-1.5 shadow-2xs ${className}`}
            role="region"
            aria-label={slotName || "আর্টিকেল বডি বিজ্ঞাপন"}
        >
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <Info className="w-3 h-3 text-slate-400" />
                <span>{slotName || "বিজ্ঞাপন"}</span>
            </div>
            <div className="text-xs font-semibold text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                নয়া বাংলা কমার্শিয়াল ডেস্ক • ads@noyabangla.com.bd
            </div>
            <span className="text-[10px] text-slate-400 font-mono">আকার: ৭২০ × ১২০ পিক্সেল</span>
        </div>
    );
}
