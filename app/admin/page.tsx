import Link from "next/link";
import { allArticles, CATEGORIES } from "@/lib/mockData";
import {
    Plus,
    Palette,
    ArrowRight,
    ExternalLink,
} from "lucide-react";
import { toBengaliNumber } from "@/lib/bengaliUtils";

export default function AdminDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        এডমিন ড্যাশবোর্ড (Dashboard)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        নয়া বাংলা সংবাদ পোর্টালের সামগ্রিক পরিসংখ্যান ও ব্যবস্থাপনা নিয়ন্ত্রণ কেন্দ্র।
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/admin/articles/create"
                        className="px-4 py-2 text-xs font-bold rounded-md bg-red-700 text-white hover:bg-red-800 transition-colors shadow-xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>নতুন সংবাদ লিখুন</span>
                    </Link>
                    <Link
                        href="/admin/brand-studio"
                        className="px-4 py-2 text-xs font-bold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Palette className="w-4 h-4 text-slate-600" />
                        <span>ব্র্যান্ড স্টুডিও</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "মোট প্রকাশিত সংবাদ", value: `${toBengaliNumber(allArticles.length)} টি`, change: "+৪ আজ", color: "text-blue-600" },
                    { label: "সক্রিয় বিভাগ", value: `${toBengaliNumber(CATEGORIES.length)} টি`, change: "সকল সক্রিয়", color: "text-emerald-600" },
                    { label: "অনলাইন পাঠক (লাইভ)", value: "১২.৪K", change: "+১৮% বৃদ্ধি", color: "text-purple-600" },
                    { label: "বিজ্ঞাপন স্লট অবস্থা", value: "১০০%", change: "সক্রিয় ৫/৫", color: "text-amber-600" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
                        <div className="text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                            {stat.label}
                        </div>
                        <div className={`text-2xl font-black ${stat.color} mb-2`} style={{ fontFamily: "var(--font-headline)" }}>
                            {stat.value}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400">
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Promo Card for Brand Studio */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                        নতুন ফিচার
                    </span>
                    <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                        ব্র্যান্ড স্টুডিও: পত্রিকার ব্র্যান্ড কালার ও টাইপোগ্রাফি কাস্টমাইজ করুন
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        এখন আপনি এক ক্লিকেই পত্রিকার প্রাইমারি কালার (ডিপ ক্রিমসন, নেভি ব্লু, ফরেস্ট গ্রিন), ফন্ট এবং প্রকাশনা সংস্করণ লাইভ প্রিভিউ সহ পরিবর্তন করতে পারেন।
                    </p>
                </div>
                <Link
                    href="/admin/brand-studio"
                    className="px-5 py-2.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-headline)" }}
                >
                    <span>ব্র্যান্ড স্টুডিওতে যান</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Recent Articles Table Preview */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                        সাম্প্রতিক প্রকাশিত সংবাদসমূহ
                    </h3>
                    <Link
                        href="/admin/articles"
                        className="text-xs text-red-700 hover:underline font-semibold flex items-center gap-1"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <span>সব দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                            <tr>
                                <th className="px-5 py-3">শিরোনাম</th>
                                <th className="px-5 py-3">বিভাগ</th>
                                <th className="px-5 py-3">লেখক</th>
                                <th className="px-5 py-3">তারিখ</th>
                                <th className="px-5 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allArticles.slice(0, 5).map((article) => (
                                <tr key={article.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-3.5 font-bold text-slate-800 max-w-xs truncate" style={{ fontFamily: "var(--font-headline)" }}>
                                        {article.title}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-600">{article.author}</td>
                                    <td className="px-5 py-3 text-slate-400">{article.publishedAt}</td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href={`/article/${article.slug}`}
                                            target="_blank"
                                            className="text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                                        >
                                            <span>ভিউ</span>
                                            <ExternalLink className="w-3 h-3 text-slate-400" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
