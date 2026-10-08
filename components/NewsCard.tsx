import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mockData";
import ArticleBylineBadge from "@/components/ArticleBylineBadge";

interface Props {
    article: Article;
}

export default function NewsCard({ article }: Props) {
    return (
        <Link href={`/article/${article.slug}`}>
            <article
                className="news-card rounded-sm overflow-hidden flex flex-col h-full bg-white"
                style={{ border: "1px solid var(--border-primary)" }}
            >
                {/* 16:9 Thumbnail */}
                <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
                    <Image
                        src={article.imageUrl}
                        alt={article.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                    {/* Category tag */}
                    <span
                        className="text-xs font-semibold self-start"
                        style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)", fontSize: "0.68rem" }}
                    >
                        {article.category}
                    </span>

                    {/* Headline */}
                    <h2
                        className="font-bold leading-snug headline-link"
                        style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "0.95rem",
                            color: "var(--accent-navy)",
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                        className="text-sm flex-1"
                        style={{
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-body)",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {article.excerpt}
                    </p>

                    {/* Footer meta / Smart Byline */}
                    <div
                        className="mt-auto pt-3"
                        style={{ borderTop: "1px solid var(--border-light)", color: "var(--text-faint)", fontFamily: "var(--font-body)" }}
                    >
                        <ArticleBylineBadge article={article} variant="card" />
                    </div>
                </div>
            </article>
        </Link>
    );
}
