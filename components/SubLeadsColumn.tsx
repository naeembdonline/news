import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mockData";
import { isEditorialArticle, isOpinionArticle, isDeskByline } from "@/components/ArticleBylineBadge";

interface Props {
    articles: Article[];
}

export default function SubLeadsColumn({ articles }: Props) {
    return (
        <div className="flex flex-col">
            {articles.map((article, index) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group block">
                    <article
                        className="sub-lead-item py-4 px-1 transition-colors"
                        style={{
                            borderBottom: index < articles.length - 1 ? "1px solid var(--border-primary)" : "none",
                        }}
                    >
                        <div className="flex gap-4 items-start justify-between">
                            <div className="flex-1 min-w-0">
                                {/* Category */}
                                <span
                                    className="text-xs font-semibold mb-1 block"
                                    style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)", fontSize: "0.7rem" }}
                                >
                                    {article.category}
                                </span>

                                {/* Title */}
                                <h3
                                    className="font-bold leading-snug mb-1.5 headline-link"
                                    style={{
                                        fontFamily: "var(--font-headline)",
                                        fontSize: "0.95rem",
                                        color: "var(--accent-navy)",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {article.title}
                                </h3>

                                {/* Excerpt */}
                                <p
                                    className="text-sm leading-relaxed mb-2"
                                    style={{
                                        color: "var(--text-muted)",
                                        fontFamily: "var(--font-body)",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {article.excerpt}
                                </p>

                                {/* Smart Byline Meta */}
                                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-faint)", fontFamily: "var(--font-body)" }}>
                                    {isEditorialArticle(article) ? (
                                        <span className="font-bold text-slate-900 inline-flex items-center gap-1">🏛️ সম্পাদকীয়</span>
                                    ) : isOpinionArticle(article) ? (
                                        <span className="font-medium text-slate-800 inline-flex items-center gap-1">✒️ {article.author}</span>
                                    ) : isDeskByline(article) ? (
                                        <span className="text-slate-600 inline-flex items-center gap-1">🏢 {article.author}</span>
                                    ) : (
                                        <span>{article.author}</span>
                                    )}
                                    <span>•</span>
                                    <span>{article.publishedAt}</span>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {article.imageUrl && (
                                <div
                                    className="relative w-24 h-20 sm:w-28 sm:h-20 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100"
                                    style={{ aspectRatio: "4/3" }}
                                >
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.imageAlt || article.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 96px, 112px"
                                    />
                                </div>
                            )}
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    );
}
