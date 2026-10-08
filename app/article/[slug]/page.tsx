import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { getArticleBySlug, allArticles, Article } from "@/lib/mockData";
import ClientArticleFallback from "@/components/ClientArticleFallback";
import ArticleBylineBadge from "@/components/ArticleBylineBadge";
import { PenTool, ArrowLeft, Clock } from "lucide-react";
import {
    constructArticleMetadata,
    generateNewsArticleSchema,
    generateBreadcrumbSchema,
} from "@/lib/seo";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return allArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);
    if (!article) {
        return {
            title: "সংবাদটি পাওয়া যায়নি",
            robots: { index: false, follow: false },
        };
    }
    return constructArticleMetadata(article);
}

export default function ArticlePage({ params }: Props) {
    const article = getArticleBySlug(params.slug);
    if (!article) {
        return <ClientArticleFallback slug={params.slug} />;
    }

    const newsSchema = generateNewsArticleSchema(article);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "হোম", url: "/" },
        { name: article.category, url: `/category/${article.categorySlug}` },
        { name: article.title, url: `/article/${article.slug}` },
    ]);

    const body =
        article.body.length > 0
            ? article.body
            : [
                article.excerpt,
                "এই প্রতিবেদনের বিস্তারিত তথ্য সংগ্রহ করা হচ্ছে। শিগগিরই আরো তথ্য যোগ করা হবে।",
                "আমাদের প্রতিনিধিরা ঘটনাস্থলে রয়েছেন এবং হালনাগাদ প্রতিবেদন পাঠাচ্ছেন।",
            ];

    // Related sidebar articles
    const relatedArticles = allArticles
        .filter((a) => a.slug !== article.slug)
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Google News & SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <BreakingTicker />
            <Navbar />

            <main className="flex-1">
                {/* ─── Responsive Article Container with Desktop Sidebar (Task 6) ─── */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* ─── Main Article Column (8 cols) ─── */}
                        <div className="lg:col-span-8 max-w-[720px] mx-auto lg:mx-0 w-full">
                            {/* Breadcrumb */}
                            <nav
                                className="flex items-center gap-2 text-xs mb-6"
                                style={{ color: "var(--text-faint)", fontFamily: "var(--font-body)" }}
                            >
                                <Link href="/" className="hover:text-red-700 transition-colors">হোম</Link>
                                <span>›</span>
                                <Link
                                    href={`/category/${article.categorySlug}`}
                                    className="hover:text-red-700 transition-colors font-medium"
                                    style={{ color: "var(--accent-red)" }}
                                >
                                    {article.category}
                                </Link>
                            </nav>

                            {/* Category */}
                            <Link href={`/category/${article.categorySlug}`}>
                                <span
                                    className="cat-label mb-4 inline-block hover:opacity-90 transition-opacity"
                                    style={{ background: "var(--accent-red)", color: "#FFFFFF" }}
                                >
                                    {article.category}
                                </span>
                            </Link>

                            {/* Headline */}
                            <h1
                                className="font-extrabold mb-4"
                                style={{
                                    fontFamily: "var(--font-headline)",
                                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                                    lineHeight: 1.2,
                                    color: "var(--accent-navy)",
                                }}
                            >
                                {article.title}
                            </h1>

                            {/* Subtitle */}
                            {article.subtitle && (
                                <p
                                    className="mb-5"
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "1.1rem",
                                        lineHeight: 1.65,
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {article.subtitle}
                                </p>
                            )}

                            {/* Smart Byline & Meta */}
                            <ArticleBylineBadge article={article} variant="full" />

                            {/* Featured Image */}
                            <div className="relative w-full overflow-hidden rounded-sm mb-8" style={{ aspectRatio: "16/9" }}>
                                <Image
                                    src={article.imageUrl}
                                    alt={article.imageAlt}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 720px"
                                />
                            </div>

                            {/* ─── Article Body ─── */}
                            <div className="article-body">
                                {/* First 3 paragraphs */}
                                {body.slice(0, 3).map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}

                                {/* ─── Article 1st Ad Slot ─── */}
                                <AdSlot format="article-body" slotName="আর্টিকেল ১ম বিজ্ঞাপন স্লট" />

                                {/* Pull Quote */}
                                {article.pullQuote && (
                                    <blockquote className="pull-quote my-8 px-6 py-5 rounded-sm">
                                        <p
                                            className="text-xl md:text-2xl font-semibold leading-relaxed"
                                            style={{
                                                fontFamily: "var(--font-headline)",
                                                color: "var(--accent-navy)",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            &ldquo;{article.pullQuote}&rdquo;
                                        </p>
                                    </blockquote>
                                )}

                                {/* Remaining paragraphs */}
                                {body.slice(3).map((para, i) => (
                                    <p key={i + 3}>{para}</p>
                                ))}

                                {/* ─── EXPANDED AD SLOT: Article 2nd Ad Slot (Task 6) ─── */}
                                <AdSlot format="article-body" slotName="আর্টিকেল ২য় বিজ্ঞাপন স্লট" />
                            </div>

                            {/* ─── Tags ─── */}
                            <div className="flex flex-wrap gap-2 mt-8 pt-6" style={{ borderTop: "1px solid var(--border-primary)" }}>
                                {["বাংলাদেশ", article.category, "বিশেষ প্রতিবেদন"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-3 py-1 rounded-sm cursor-pointer transition-colors hover:bg-slate-200"
                                        style={{
                                            background: "var(--bg-surface)",
                                            color: "var(--text-muted)",
                                            fontFamily: "var(--font-body)",
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* ─── Editorial Correction (with Lucide icon) ─── */}
                            {article.editorialCorrection && (
                                <div
                                    className="correction-box mt-10 p-5 rounded-sm"
                                    role="note"
                                    aria-label="সম্পাদকীয় সংশোধন"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                                            style={{ background: "#FEF3C7", color: "#92400E" }}
                                        >
                                            <PenTool className="w-3.5 h-3.5" />
                                        </span>
                                        <div>
                                            <h3
                                                className="text-sm font-bold mb-1"
                                                style={{ color: "#92400E", fontFamily: "var(--font-headline)" }}
                                            >
                                                সম্পাদকীয় সংশোধন
                                            </h3>
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                                            >
                                                {article.editorialCorrection}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── Back Link with Lucide ArrowLeft ─── */}
                            <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border-primary)" }}>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
                                    style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)" }}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>হোমপেজে ফিরুন</span>
                                </Link>
                            </div>
                        </div>

                        {/* ─── Right Desktop Sidebar (4 cols) with Sticky Ad (Task 6) ─── */}
                        <aside className="lg:col-span-4 hidden lg:flex flex-col gap-8 sticky top-20">
                            {/* ─── EXPANDED AD SLOT: Article Sidebar Ad (Task 6) ─── */}
                            <AdSlot format="article-sidebar" />

                            {/* Sidebar Related Stories */}
                            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
                                <h3
                                    className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    <span>আরও পড়ুন</span>
                                    <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider">শীর্ষ খবর</span>
                                </h3>
                                <div className="divide-y divide-slate-100">
                                    {relatedArticles.map((rel: Article) => (
                                        <div key={rel.id} className="py-3 first:pt-0 last:pb-0">
                                            <Link
                                                href={`/article/${rel.slug}`}
                                                className="text-xs font-bold text-slate-800 hover:text-red-700 line-clamp-2 leading-snug transition-colors"
                                                style={{ fontFamily: "var(--font-headline)" }}
                                            >
                                                {rel.title}
                                            </Link>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                                <span>{rel.author}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-0.5">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    <span>{rel.publishedAt}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
