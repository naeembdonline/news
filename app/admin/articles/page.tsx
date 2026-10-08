"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ExternalLink,
    X,
    CheckCircle2,
    Newspaper,
    Landmark,
    PenTool,
    Building,
    ChevronRight,
} from "lucide-react";
import {
    getCombinedArticles,
    deleteStoredArticle,
    NewsArticleItem,
} from "@/lib/articleStorage";
import { toBengaliNumber } from "@/lib/bengaliUtils";

function ArticlesManagementContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [articlesList, setArticlesList] = useState<NewsArticleItem[]>([]);
    const [selectedTab, setSelectedTab] = useState<"all" | "published" | "review" | "draft">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Refresh articles from storage
    const loadArticles = () => {
        const loaded = getCombinedArticles();
        setArticlesList(loaded);
    };

    useEffect(() => {
        loadArticles();
    }, []);

    // Check query params for saved/updated toast
    useEffect(() => {
        const savedStatus = searchParams.get("saved");
        const articleTitle = searchParams.get("title");

        if (savedStatus) {
            let msg = "সংবাদটি সফলভাবে সংরক্ষিত হয়েছে!";
            if (savedStatus === "published") {
                msg = `সংবাদটি সফলভাবে প্রকাশিত হয়েছে: "${articleTitle || "নতুন সংবাদ"}"`;
            } else if (savedStatus === "updated") {
                msg = `সংবাদটি সফলভাবে হালনাগাদ করা হয়েছে: "${articleTitle || "সংবাদ"}"`;
            } else if (savedStatus === "draft") {
                msg = `সংবাদটি খসড়া হিসেবে সংরক্ষিত হয়েছে: "${articleTitle || "খসড়া সংবাদ"}"`;
            } else if (savedStatus === "review") {
                msg = `সংবাদটি পর্যালোচনার জন্য জমা দেওয়া হয়েছে: "${articleTitle || "পর্যালোচনাধীন সংবাদ"}"`;
            }
            setToastMessage(msg);
            loadArticles();
            router.replace("/admin/articles");
        }
    }, [searchParams, router]);

    // Auto dismiss toast
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    // Handle delete article
    const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`আপনি কি নিশ্চিতভাবে "${title}" সংবাদটি মুছে ফেলতে চান?`)) {
            deleteStoredArticle(id);
            setArticlesList((prev) => prev.filter((a) => a.id !== id));
            setToastMessage("সংবাদটি সফলভাবে অপসারণ করা হয়েছে।");
        }
    };

    // Filter by tab, category, search
    const filteredArticles = articlesList.filter((item) => {
        if (selectedTab !== "all" && item.status !== selectedTab) return false;
        if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = item.title.toLowerCase().includes(q);
            const matchAuthor = (item.author || "").toLowerCase().includes(q);
            const matchCategory = item.category.toLowerCase().includes(q);
            if (!matchTitle && !matchAuthor && !matchCategory) return false;
        }
        return true;
    });

    // Counts
    const totalCount = articlesList.length;
    const publishedCount = articlesList.filter((a) => a.status === "published").length;
    const reviewCount = articlesList.filter((a) => a.status === "review").length;
    const draftCount = articlesList.filter((a) => a.status === "draft").length;
    const categoriesList = Array.from(new Set(articlesList.map((a) => a.category)));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* ─── Page Top Bar ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Link href="/admin" className="hover:text-slate-800">ড্যাশবোর্ড</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 font-semibold">সংবাদ ব্যবস্থাপনা</span>
                    </nav>
                    <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        সংবাদ ব্যবস্থাপনা (Article Management)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        সমস্ত প্রকাশনা, খসড়া ও রিভিউ পর্যায়ের সংবাদ পর্যবেক্ষণ, সম্পাদনা ও মুছে ফেলা নিয়ন্ত্রণ করুন।
                    </p>
                </div>

                {/* Primary Action: Add Article Button with Lucide Plus */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/articles/create"
                        className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-red-700 hover:bg-red-800 text-white transition-all shadow-sm flex items-center gap-2"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>সংবাদ যোগ করুন</span>
                    </Link>
                </div>
            </div>

            {/* ─── Toast Notification Banner with Lucide Icons ─── */}
            {toastMessage && (
                <div
                    className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-2xs animate-fade-in"
                    role="alert"
                >
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                            {toastMessage}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToastMessage(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1 rounded flex items-center"
                        aria-label="বার্তা বন্ধ করুন"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ─── Metric Counter Cards ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "মোট সংবাদ", count: totalCount, color: "text-slate-900", bg: "bg-white" },
                    { label: "প্রকাশিত", count: publishedCount, color: "text-emerald-700", bg: "bg-white" },
                    { label: "পর্যালোচনাধীন", count: reviewCount, color: "text-amber-700", bg: "bg-white" },
                    { label: "খসড়া সংরক্ষিত", count: draftCount, color: "text-blue-700", bg: "bg-white" },
                ].map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} p-4 rounded-lg border border-slate-200 shadow-2xs`}>
                        <div className="text-xs text-slate-500 font-medium" style={{ fontFamily: "var(--font-headline)" }}>
                            {stat.label}
                        </div>
                        <div className={`text-2xl font-black ${stat.color} mt-1`} style={{ fontFamily: "var(--font-headline)" }}>
                            {toBengaliNumber(stat.count)} টি
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Filters, Tabs & Search Controls ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                        {[
                            { id: "all", label: "সকল সংবাদ", count: totalCount },
                            { id: "published", label: "প্রকাশিত", count: publishedCount },
                            { id: "review", label: "পর্যালোচনাধীন", count: reviewCount },
                            { id: "draft", label: "খসড়া", count: draftCount },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedTab(tab.id as "all" | "published" | "review" | "draft")}
                                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                    selectedTab === tab.id
                                        ? "bg-slate-900 text-white shadow-2xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedTab === tab.id ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"
                                }`}>
                                    {toBengaliNumber(tab.count)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search & Category Filter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        {/* Search input with Lucide Search */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="শিরোনাম বা লেখক খুঁজুন..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>

                        {/* Category filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="বিভাগ অনুযায়ী ফিল্টার করুন"
                            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700"
                        >
                            <option value="all">সকল বিভাগ</option>
                            {categoriesList.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ─── Articles Table ─── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                            <tr>
                                <th className="px-5 py-3.5">শিরোনাম ও মেটাডাটা</th>
                                <th className="px-4 py-3.5">বিভাগ</th>
                                <th className="px-4 py-3.5">লেখক</th>
                                <th className="px-4 py-3.5">অবস্থা (Status)</th>
                                <th className="px-4 py-3.5">তারিখ</th>
                                <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                        <div className="max-w-sm mx-auto space-y-3">
                                            <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
                                            <div className="text-sm font-bold text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                                                কোনো সংবাদ পাওয়া যায়নি
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                আপনার ফিল্টার বা সার্চে কোনো মিল পাওয়া যায়নি। নতুন একটি সংবাদ তৈরি করতে পারেন।
                                            </p>
                                            <Link
                                                href="/admin/articles/create"
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors"
                                                style={{ fontFamily: "var(--font-headline)" }}
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>নতুন সংবাদ তৈরি করুন</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredArticles.map((article) => {
                                    return (
                                        <tr key={article.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Title & flags */}
                                            <td className="px-5 py-4 max-w-md">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    {article.isBreaking && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                                                            ব্রেকিং
                                                        </span>
                                                    )}
                                                    {article.isLead && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                                                            লিড
                                                        </span>
                                                    )}
                                                    {article.contentType === "editorial" && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white inline-flex items-center gap-1">
                                                            <Landmark className="w-2.5 h-2.5" />
                                                            <span>সম্পাদকীয়</span>
                                                        </span>
                                                    )}
                                                    {article.contentType === "opinion" && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                                                            <PenTool className="w-2.5 h-2.5" />
                                                            <span>মতামত</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/article/${article.slug}`}
                                                    target="_blank"
                                                    className="font-bold text-slate-900 hover:text-red-700 transition-colors block text-sm leading-snug line-clamp-2"
                                                    style={{ fontFamily: "var(--font-headline)" }}
                                                >
                                                    {article.title}
                                                </Link>
                                                <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                                                    /{article.slug}
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                                                    {article.category}
                                                </span>
                                            </td>

                                            {/* Smart Byline / Author with Lucide icons */}
                                            <td className="px-4 py-4 whitespace-nowrap font-medium text-xs">
                                                {article.author === "সম্পাদকীয়" || article.contentType === "editorial" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                                                        <Landmark className="w-3 h-3" />
                                                        <span>সম্পাদকীয়</span>
                                                    </span>
                                                ) : article.contentType === "opinion" || article.category === "মতামত" ? (
                                                    <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                                                        <PenTool className="w-3 h-3 text-red-700" />
                                                        <span>{article.author}</span>
                                                    </span>
                                                ) : article.author === "অনলাইন ডেস্ক" || (article.author && article.author.includes("ডেস্ক")) ? (
                                                    <span className="inline-flex items-center gap-1 text-slate-600">
                                                        <Building className="w-3 h-3 text-slate-400" />
                                                        <span>{article.author}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600">{article.author}</span>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {article.status === "published" && (
                                                    <span className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                                        <span>প্রকাশিত</span>
                                                    </span>
                                                )}
                                                {article.status === "review" && (
                                                    <span className="px-2 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                                        <span>পর্যালোচনাধীন</span>
                                                    </span>
                                                )}
                                                {article.status === "draft" && (
                                                    <span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                        <span>খসড়া</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                                                {article.publishedAt}
                                            </td>

                                            {/* Actions: View, Edit, Delete (Task 4) */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* View in new tab */}
                                                    <Link
                                                        href={`/article/${article.slug}`}
                                                        target="_blank"
                                                        className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors flex items-center gap-1 text-[11px]"
                                                        title="লাইভ সাইটে দেখুন"
                                                    >
                                                        <span>ভিউ</span>
                                                        <ExternalLink className="w-3 h-3 text-slate-400" />
                                                    </Link>

                                                    {/* Edit Button -> /admin/articles/[id]/edit */}
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors flex items-center gap-1 text-[11px]"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Pencil className="w-3 h-3 text-slate-600" />
                                                        <span>সম্পাদনা</span>
                                                    </Link>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDelete(article.id, article.title, e)}
                                                        className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                        title="মুছে ফেলুন"
                                                        aria-label="সংবাদ মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function ArticlesManagementPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">লোড হচ্ছে...</div>}>
            <ArticlesManagementContent />
        </Suspense>
    );
}
