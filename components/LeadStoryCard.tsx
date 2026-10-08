import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mockData";
import ArticleBylineBadge from "@/components/ArticleBylineBadge";

interface Props {
    article: Article;
}

export default function LeadStoryCard({ article }: Props) {
    return (
        <article>
            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "16/9" }}>
                <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                />
            </div>

            {/* Content on white canvas */}
            <div className="pt-5">
                {/* Category + Breaking */}
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="cat-label"
                        style={{ background: "var(--accent-red)", color: "#FFFFFF" }}
                    >
                        {article.category}
                    </span>
                    {article.isBraking && (
                        <span
                            className="text-xs font-semibold"
                            style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)" }}
                        >
                            • ব্রেকিং
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link href={`/article/${article.slug}`}>
                    <h1
                        className="font-extrabold leading-tight mb-3 headline-link"
                        style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                            color: "var(--accent-navy)",
                            lineHeight: 1.25,
                        }}
                    >
                        {article.title}
                    </h1>
                </Link>

                {/* Subtitle / Excerpt */}
                {article.subtitle && (
                    <p
                        className="mb-4"
                        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}
                    >
                        {article.subtitle}
                    </p>
                )}

                {/* Smart Byline & Meta */}
                <div className="pt-2">
                    <ArticleBylineBadge article={article} variant="full" />
                </div>
            </div>
        </article>
    );
}
