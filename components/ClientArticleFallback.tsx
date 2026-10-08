"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import { getStoredArticles, NewsArticleItem } from "@/lib/articleStorage";
import ArticleBylineBadge from "@/components/ArticleBylineBadge";
import { FileText } from "lucide-react";

interface Props {
    slug: string;
}

export default function ClientArticleFallback({ slug }: Props) {
    const [article, setArticle] = useState<NewsArticleItem | null | undefined>(undefined);

    useEffect(() => {
        const stored = getStoredArticles();
        const found = stored.find((a) => a.slug === slug);
        setArticle(found || null);
    }, [slug]);

    if (article === undefined) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <BreakingTicker />
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-20 text-slate-400">
                    সংবাদ লোড হচ্ছে...
                </main>
                <Footer />
            </div>
        );
    }

    if (article === null) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <BreakingTicker />
                <Navbar />
                <main className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-headline)" }}>
                        সংবাদটি পাওয়া যায়নি
                    </h1>
                    <p className="text-sm text-slate-600">
                        আপনার অনুরোধকৃত সংবাদটি অপসারিত হয়েছে অথবা লিংকটি সঠিক নয়।
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-5 py-2.5 rounded-lg bg-red-700 text-white font-bold text-xs"
                    >
                        হোমপেজে ফিরে যান
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const paragraphs = article.body.split("\n\n").filter(Boolean);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <BreakingTicker />
            <Navbar />

            <main className="flex-1">
                <div className="max-w-[720px] mx-auto px-4 md:px-6 py-10">
                    {/* Breadcrumb */}
                    <nav
                        className="flex items-center gap-2 text-xs mb-6 text-slate-400"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        <Link href="/" className="hover:text-red-700 transition-colors">হোম</Link>
                        <span>›</span>
                        <Link
                            href={`/category/${article.categorySlug}`}
                            className="hover:text-red-700 transition-colors font-medium text-red-700"
                        >
                            {article.category}
                        </Link>
                    </nav>

                    {/* Category Label */}
                    <Link href={`/category/${article.categorySlug}`}>
                        <span
                            className="cat-label mb-4 inline-block hover:opacity-90 transition-opacity bg-red-700 text-white px-2 py-0.5 text-xs font-bold rounded"
                        >
                            {article.category}
                        </span>
                    </Link>

                    {/* Headline */}
                    <h1
                        className="font-extrabold mb-4 text-slate-900"
                        style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                            lineHeight: 1.2,
                        }}
                    >
                        {article.title}
                    </h1>

                    {/* Subtitle */}
                    {article.subtitle && (
                        <p
                            className="mb-5 text-slate-700 text-lg leading-relaxed"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            {article.subtitle}
                        </p>
                    )}

                    {/* Smart Byline & Meta */}
                    <ArticleBylineBadge article={article} variant="full" />

                    {/* Hero Image */}
                    {article.imageUrl && (
                        <div className="mb-8">
                            <div className="relative w-full h-[380px] rounded-lg overflow-hidden bg-slate-100">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.imageCaption || article.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 720px"
                                    priority
                                />
                            </div>
                            {article.imageCaption && (
                                <p className="mt-2 text-xs text-slate-500 italic">
                                    {article.imageCaption} {article.photoCredit ? `— ${article.photoCredit}` : ""}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Body Content */}
                    <div className="space-y-6 text-slate-800 text-lg leading-loose font-normal">
                        {paragraphs.map((para, idx) => {
                            const trimmed = para.trim();
                            if (trimmed.startsWith("### ")) {
                                return (
                                    <h3 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                                        {trimmed.replace(/^###\s*/, "")}
                                    </h3>
                                );
                            }
                            if (trimmed.startsWith("## ")) {
                                return (
                                    <h2 key={idx} className="text-2xl font-black text-slate-900 mt-8 mb-3 border-b pb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                        {trimmed.replace(/^##\s*/, "")}
                                    </h2>
                                );
                            }
                            if (trimmed.startsWith("> ")) {
                                return (
                                    <blockquote key={idx} className="pl-4 py-2 border-l-4 border-red-600 bg-red-50/60 rounded-r text-lg font-semibold text-slate-800 italic my-6">
                                        {trimmed.replace(/^>\s*/, "").replace(/^"|"$/g, "")}
                                    </blockquote>
                                );
                            }
                            if (trimmed.startsWith("- ")) {
                                const listItems = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
                                return (
                                    <ul key={idx} className="list-disc list-inside space-y-2 text-slate-800 pl-4">
                                        {listItems.map((li, liIdx) => (
                                            <li key={liIdx}>{li.replace(/^-\s*/, "")}</li>
                                        ))}
                                    </ul>
                                );
                            }
                            return <p key={idx}>{trimmed}</p>;
                        })}
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-bold text-slate-500">ট্যাগ:</span>
                            {article.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
