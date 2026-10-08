import Image from "next/image";
import { toBengaliNumber } from "@/lib/bengaliUtils";
import { Landmark, PenTool, Building2 } from "lucide-react";

export interface ArticleLike {
    author: string;
    publishedAt: string;
    readingTimeMin?: number;
    category?: string;
    categorySlug?: string;
    slug?: string;
    contentType?: "standard" | "breaking" | "opinion" | "editorial";
    bylineType?: "online-desk" | "own-reporter" | "special-correspondent" | "district-correspondent" | "named-reporter" | "opinion-author" | "editorial";
    authorDesignation?: string;
    authorPhotoUrl?: string;
    districtName?: string;
}

interface BylineProps {
    article: ArticleLike;
    variant?: "full" | "card" | "lead";
}

export function isEditorialArticle(article: ArticleLike): boolean {
    return (
        article.contentType === "editorial" ||
        article.bylineType === "editorial" ||
        article.author === "সম্পাদকীয়" ||
        article.category === "সম্পাদকীয়" ||
        (article.slug ? article.slug.startsWith("editorial-") && !article.authorDesignation : false)
    );
}

export function isOpinionArticle(article: ArticleLike): boolean {
    if (isEditorialArticle(article)) return false;
    return (
        article.contentType === "opinion" ||
        article.bylineType === "opinion-author" ||
        article.category === "মতামত" ||
        article.categorySlug === "opinion" ||
        Boolean(article.authorDesignation)
    );
}

export function isDeskByline(article: ArticleLike): boolean {
    if (isEditorialArticle(article) || isOpinionArticle(article)) return false;
    const author = article.author || "";
    return (
        article.bylineType === "online-desk" ||
        article.bylineType === "own-reporter" ||
        article.bylineType === "special-correspondent" ||
        article.bylineType === "district-correspondent" ||
        author === "অনলাইন ডেস্ক" ||
        author === "নিজস্ব প্রতিবেদক" ||
        author === "বিশেষ সংবাদদাতা" ||
        author.includes("প্রতিনিধি") ||
        author.includes("ডেস্ক")
    );
}

export default function ArticleBylineBadge({ article, variant = "full" }: BylineProps) {
    const isEditorial = isEditorialArticle(article);
    const isOpinion = isOpinionArticle(article);
    const isDesk = isDeskByline(article);

    const readingTime = article.readingTimeMin
        ? `${toBengaliNumber(article.readingTimeMin)} মিনিটে পড়ুন`
        : null;

    // ─── 1. EDITORIAL STAMP ───
    if (isEditorial) {
        if (variant === "card") {
            return (
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px] tracking-wide">
                        <Landmark className="w-3 h-3" />
                        <span>সম্পাদকীয়</span>
                    </span>
                    {article.readingTimeMin && (
                        <span className="text-slate-400 text-[11px] ml-auto">
                            {toBengaliNumber(article.readingTimeMin)} মি পড়া
                        </span>
                    )}
                </div>
            );
        }

        // Full article view editorial seal
        return (
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-lg shadow-xs border border-slate-700">
                        <Landmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-2">
                            <span
                                className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                নয়া বাংলা সম্পাদকীয়
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 uppercase">
                                প্রাতিষ্ঠানিক অভিমত
                            </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                            সম্পাদকীয় পরিষদ • নীতি ও মূল্যায়ন সেল
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>{article.publishedAt}</span>
                    {readingTime && (
                        <>
                            <span className="text-slate-300">|</span>
                            <span>{readingTime}</span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ─── 2. OPINION & COLUMN AUTHOR PROMINENT BYLINE ───
    if (isOpinion) {
        if (variant === "card") {
            return (
                <div className="flex items-center justify-between text-xs w-full">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate max-w-[75%]">
                        <PenTool className="w-3.5 h-3.5 text-red-700" />
                        <span className="truncate">{article.author}</span>
                    </div>
                    {article.readingTimeMin && (
                        <span className="text-slate-400 text-[11px] whitespace-nowrap">
                            {toBengaliNumber(article.readingTimeMin)} মি পড়া
                        </span>
                    )}
                </div>
            );
        }

        // Full article view opinion profile
        const photoUrl =
            article.authorPhotoUrl ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80";

        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-6 rounded-xl bg-gradient-to-r from-red-50/70 via-slate-50 to-white border border-red-100/80 shadow-2xs">
                <div className="flex items-center gap-3.5">
                    <div className="relative w-13 h-13 rounded-full overflow-hidden ring-2 ring-red-700 shadow-xs flex-shrink-0 bg-slate-200">
                        <Image
                            src={photoUrl}
                            alt={article.author}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-2">
                            <span
                                className="font-extrabold text-base text-slate-900 tracking-tight"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                {article.author}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-700 text-white">
                                কলামিস্ট / মতামত
                            </span>
                        </div>
                        <span className="text-xs text-slate-600 mt-1 font-medium">
                            {article.authorDesignation || "বিশ্লেষক ও মুক্ত লেখক"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pl-1 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <span>{article.publishedAt}</span>
                    {readingTime && (
                        <>
                            <span className="text-slate-300">|</span>
                            <span>{readingTime}</span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ─── 3. INSTITUTIONAL DESK BYLINE (NO INDIVIDUAL AVATAR) ───
    if (isDesk) {
        if (variant === "card") {
            return (
                <div className="flex items-center justify-between text-xs w-full">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.author}</span>
                    </span>
                    {article.readingTimeMin && (
                        <span className="text-slate-400 text-[11px]">
                            {toBengaliNumber(article.readingTimeMin)} মি পড়া
                        </span>
                    )}
                </div>
            );
        }

        // Full article view desk badge
        return (
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 mb-6 border-y border-slate-200 text-xs">
                <div className="flex items-center gap-2.5">
                    <div className="px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shadow-2xs">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span style={{ fontFamily: "var(--font-headline)" }}>{article.author}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                        নয়া বাংলা সংবাদকক্ষ
                    </span>
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span>{article.publishedAt}</span>
                    {readingTime && (
                        <>
                            <span className="text-slate-300">|</span>
                            <span>{readingTime}</span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ─── 4. NAMED INDIVIDUAL REPORTER (STANDARD) ───
    if (variant === "card") {
        return (
            <div className="flex items-center justify-between text-xs w-full">
                <span className="text-slate-600 font-medium truncate max-w-[75%]">{article.author}</span>
                {article.readingTimeMin && (
                    <span className="text-slate-400 text-[11px]">
                        {toBengaliNumber(article.readingTimeMin)} মি পড়া
                    </span>
                )}
            </div>
        );
    }

    // Full article named reporter
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 mb-6 border-y border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {article.author ? article.author[0] : "ন"}
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="font-bold text-sm text-slate-900">{article.author}</span>
                    <span className="text-[10px] text-slate-400">প্রতিবেদক</span>
                </div>
            </div>

            <div className="flex items-center gap-3 font-medium">
                <span>{article.publishedAt}</span>
                {readingTime && (
                    <>
                        <span className="text-slate-300">|</span>
                        <span>{readingTime}</span>
                    </>
                )}
            </div>
        </div>
    );
}
