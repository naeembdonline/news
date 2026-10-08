import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import {
    CATEGORIES,
    getCategoryInfo,
    getArticlesByCategory,
    Article,
} from "@/lib/mockData";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_CONFIG, generateBreadcrumbSchema } from "@/lib/seo";

interface Props {
    params: { slug: string };
    searchParams?: { page?: string };
}

const ITEMS_PER_PAGE = 6;

// Helper to convert numbers to Bengali numerals
function toBengaliNumber(num: number): string {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
        .toString()
        .split("")
        .map((digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
        .join("");
}

export async function generateStaticParams() {
    return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = getCategoryInfo(params.slug);
    if (!category) return {};

    const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");
    const canonical = `${baseUrl}/category/${category.slug}`;

    return {
        title: `${category.name} সংবাদ`,
        description: category.description,
        alternates: {
            canonical,
        },
        openGraph: {
            title: `${category.name} সংবাদ — ${SITE_CONFIG.name}`,
            description: category.description,
            url: canonical,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            type: "website",
            images: [
                {
                    url: SITE_CONFIG.defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: `${category.name} - ${SITE_CONFIG.name}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.name} সংবাদ — ${SITE_CONFIG.name}`,
            description: category.description,
            images: [SITE_CONFIG.defaultOgImage],
            creator: SITE_CONFIG.twitterHandle,
        },
    };
}

export default function CategoryPage({ params, searchParams }: Props) {
    const category = getCategoryInfo(params.slug);
    if (!category) notFound();

    const allCategoryArticles: Article[] = getArticlesByCategory(params.slug);
    const totalArticles = allCategoryArticles.length;

    // Pagination calculations
    const currentPage = Math.max(
        1,
        parseInt(searchParams?.page || "1", 10) || 1
    );
    const totalPages = Math.max(1, Math.ceil(totalArticles / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalArticles);
    const paginatedArticles = allCategoryArticles.slice(startIndex, endIndex);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "হোম", url: "/" },
        { name: category.name, url: `/category/${category.slug}` },
    ]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <BreakingTicker />
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
                {/* ─── Breadcrumb ─── */}
                <nav
                    className="flex items-center gap-2 text-xs mb-6"
                    style={{ color: "var(--text-faint)", fontFamily: "var(--font-body)" }}
                    aria-label="ব্রেডক্রাম্ব"
                >
                    <Link href="/" className="hover:text-red-700 transition-colors">
                        হোম
                    </Link>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span style={{ color: "var(--text-muted)" }}>বিভাগ</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span
                        className="font-semibold"
                        style={{ color: "var(--accent-red)" }}
                    >
                        {category.name}
                    </span>
                </nav>

                {/* ─── Category Header ─── */}
                <header
                    className="pb-6 mb-8 border-b"
                    style={{ borderColor: "var(--border-primary)" }}
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span
                                className="cat-label mb-2 inline-block"
                                style={{ background: "var(--accent-red)", color: "#FFFFFF" }}
                            >
                                বিভাগীয় সংবাদ
                            </span>
                            <h1
                                className="section-heading text-2xl md:text-3xl font-extrabold tracking-tight"
                                style={{
                                    fontFamily: "var(--font-headline)",
                                    color: "var(--accent-navy)",
                                }}
                            >
                                {category.name}
                            </h1>
                            <p
                                className="mt-2 text-sm max-w-2xl"
                                style={{
                                    fontFamily: "var(--font-body)",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {category.description}
                            </p>
                        </div>

                        {/* Article count & page status */}
                        <div
                            className="text-xs px-3 py-1.5 rounded-sm self-start md:self-end border"
                            style={{
                                background: "var(--bg-surface)",
                                borderColor: "var(--border-primary)",
                                color: "var(--text-secondary)",
                                fontFamily: "var(--font-headline)",
                            }}
                        >
                            মোট {toBengaliNumber(totalArticles)} টি সংবাদ • পৃষ্ঠা{" "}
                            {toBengaliNumber(safePage)} / {toBengaliNumber(totalPages)}
                        </div>
                    </div>
                </header>

                {/* ─── 3-Column Responsive News Grid with In-Grid Ad Slot (Task 6) ─── */}
                {paginatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* First 2 news cards */}
                        {paginatedArticles.slice(0, 2).map((article) => (
                            <NewsCard key={article.id} article={article} />
                        ))}

                        {/* ─── EXPANDED AD SLOT: Category In-Grid Ad ─── */}
                        <AdSlot format="category-grid" />

                        {/* Remaining news cards */}
                        {paginatedArticles.slice(2).map((article) => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-16 px-4 rounded-sm border"
                        style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-primary)",
                        }}
                    >
                        <p
                            className="text-base font-medium mb-4"
                            style={{
                                color: "var(--text-muted)",
                                fontFamily: "var(--font-headline)",
                            }}
                        >
                            এই বিভাগে বর্তমানে কোনো সংবাদ পাওয়া যায়নি।
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                            style={{
                                color: "var(--accent-red)",
                                fontFamily: "var(--font-headline)",
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>হোমপেজে ফিরে যান</span>
                        </Link>
                    </div>
                )}

                {/* ─── Pagination Controls ─── */}
                {totalPages > 1 && (
                    <nav
                        className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
                        style={{ borderColor: "var(--border-primary)" }}
                        aria-label="পৃষ্ঠাসংখ্যা"
                    >
                        {/* Summary */}
                        <div
                            className="text-xs"
                            style={{
                                color: "var(--text-muted)",
                                fontFamily: "var(--font-body)",
                            }}
                        >
                            {toBengaliNumber(startIndex + 1)} থেকে{" "}
                            {toBengaliNumber(endIndex)} টি সংবাদ দেখানো হচ্ছে (মোট{" "}
                            {toBengaliNumber(totalArticles)} টির মধ্যে)
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-1.5">
                            {/* Previous Button */}
                            {safePage > 1 ? (
                                <Link
                                    href={`/category/${category.slug}?page=${safePage - 1}`}
                                    className="px-3.5 py-1.5 text-xs font-semibold rounded-sm border transition-colors hover:bg-slate-100 flex items-center gap-1"
                                    style={{
                                        borderColor: "var(--border-primary)",
                                        color: "var(--text-primary)",
                                        fontFamily: "var(--font-headline)",
                                    }}
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>পূর্ববর্তী</span>
                                </Link>
                            ) : (
                                <span
                                    className="px-3.5 py-1.5 text-xs font-semibold rounded-sm border opacity-40 cursor-not-allowed flex items-center gap-1"
                                    style={{
                                        borderColor: "var(--border-primary)",
                                        color: "var(--text-faint)",
                                        fontFamily: "var(--font-headline)",
                                    }}
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>পূর্ববর্তী</span>
                                </span>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (pageNum) => {
                                    const isActive = pageNum === safePage;
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/category/${category.slug}?page=${pageNum}`}
                                            className={`min-w-[34px] h-[32px] flex items-center justify-center text-xs font-semibold rounded-sm border transition-colors ${
                                                isActive
                                                    ? "text-white shadow-sm"
                                                    : "hover:bg-slate-100"
                                            }`}
                                            style={{
                                                backgroundColor: isActive
                                                    ? "var(--accent-red)"
                                                    : "#FFFFFF",
                                                borderColor: isActive
                                                    ? "var(--accent-red)"
                                                    : "var(--border-primary)",
                                                color: isActive
                                                    ? "#FFFFFF"
                                                    : "var(--text-secondary)",
                                                fontFamily: "var(--font-headline)",
                                            }}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {toBengaliNumber(pageNum)}
                                        </Link>
                                    );
                                }
                            )}

                            {/* Next Button */}
                            {safePage < totalPages ? (
                                <Link
                                    href={`/category/${category.slug}?page=${safePage + 1}`}
                                    className="px-3.5 py-1.5 text-xs font-semibold rounded-sm border transition-colors hover:bg-slate-100 flex items-center gap-1"
                                    style={{
                                        borderColor: "var(--border-primary)",
                                        color: "var(--text-primary)",
                                        fontFamily: "var(--font-headline)",
                                    }}
                                >
                                    <span>পরবর্তী</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <span
                                    className="px-3.5 py-1.5 text-xs font-semibold rounded-sm border opacity-40 cursor-not-allowed flex items-center gap-1"
                                    style={{
                                        borderColor: "var(--border-primary)",
                                        color: "var(--text-faint)",
                                        fontFamily: "var(--font-headline)",
                                    }}
                                >
                                    <span>পরবর্তী</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </div>
                    </nav>
                )}
            </main>

            <Footer />
        </div>
    );
}
