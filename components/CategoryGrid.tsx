import Link from "next/link";
import { Article } from "@/lib/mockData";
import NewsCard from "./NewsCard";

interface Props {
    categoryLabel: string;
    categorySlug?: string;
    articles: Article[];
}

export default function CategoryGrid({ categoryLabel, categorySlug, articles }: Props) {
    return (
        <section>
            {/* Section heading */}
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="section-heading text-lg font-bold"
                    style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                >
                    {categoryLabel}
                </h2>
                {categorySlug ? (
                    <Link
                        href={`/category/${categorySlug}`}
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: "var(--accent-red)", fontFamily: "var(--font-body)" }}
                    >
                        সব দেখুন →
                    </Link>
                ) : (
                    <span
                        className="text-xs font-medium cursor-default"
                        style={{ color: "var(--accent-red)", fontFamily: "var(--font-body)" }}
                    >
                        সর্বশেষ খবর
                    </span>
                )}
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}
