import { allArticles, Article } from "@/lib/mockData";

export interface NewsArticleItem {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    body: string;
    category: string;
    categorySlug: string;
    tags: string[];
    isBreaking: boolean;
    isLead: boolean;
    imageUrl: string;
    imageCaption?: string;
    photoCredit?: string;
    author: string;
    authorDesignation?: string;
    authorPhotoUrl?: string;
    contentType?: "standard" | "breaking" | "opinion" | "editorial";
    bylineType?: "online-desk" | "own-reporter" | "special-correspondent" | "district-correspondent" | "named-reporter" | "opinion-author" | "editorial";
    districtName?: string;
    publishedAt: string;
    readingTimeMin: number;
    status: "draft" | "review" | "published";
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = "craftera_newsroom_articles";
const DELETED_KEY = "craftera_deleted_article_ids";

export function getStoredArticles(): NewsArticleItem[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse articles from localStorage", e);
        return [];
    }
}

export function getDeletedArticleIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(DELETED_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse deleted article ids", e);
        return [];
    }
}

export function getCombinedArticles(): NewsArticleItem[] {
    const stored = getStoredArticles();
    const deletedIds = new Set(getDeletedArticleIds());

    const mockItems: NewsArticleItem[] = allArticles
        .filter((m: Article) => !deletedIds.has(m.id))
        .map((m: Article) => ({
            id: m.id,
            slug: m.slug,
            title: m.title,
            subtitle: m.subtitle,
            excerpt: m.excerpt,
            body: Array.isArray(m.body) ? m.body.join("\n\n") : m.body,
            category: m.category,
            categorySlug: m.categorySlug,
            tags: ["#জাতীয়", "#বাংলাদেশ"],
            isBreaking: m.isBraking || false,
            isLead: false,
            imageUrl: m.imageUrl,
            author: m.author,
            authorDesignation: m.authorDesignation,
            authorPhotoUrl: m.authorPhotoUrl,
            contentType: m.contentType || "standard",
            bylineType: m.bylineType,
            districtName: m.districtName,
            publishedAt: m.publishedAt,
            readingTimeMin: m.readingTimeMin || 3,
            status: "published" as const,
            createdAt: "2026-10-06T00:00:00.000Z",
            updatedAt: "2026-10-06T00:00:00.000Z",
        }));

    // Filter out mock items that have been overridden by stored items with same ID or slug
    const storedIds = new Set(stored.map((s) => s.id));
    const storedSlugs = new Set(stored.map((s) => s.slug));

    const nonOverriddenMocks = mockItems.filter(
        (m) => !storedIds.has(m.id) && !storedSlugs.has(m.slug)
    );

    return [...stored, ...nonOverriddenMocks];
}

export function getArticleById(id: string): NewsArticleItem | null {
    if (typeof window === "undefined") {
        const mock = allArticles.find((a) => a.id === id);
        if (!mock) return null;
        return {
            id: mock.id,
            slug: mock.slug,
            title: mock.title,
            subtitle: mock.subtitle,
            excerpt: mock.excerpt,
            body: Array.isArray(mock.body) ? mock.body.join("\n\n") : mock.body,
            category: mock.category,
            categorySlug: mock.categorySlug,
            tags: ["#জাতীয়", "#বাংলাদেশ"],
            isBreaking: mock.isBraking || false,
            isLead: false,
            imageUrl: mock.imageUrl,
            author: mock.author,
            authorDesignation: mock.authorDesignation,
            authorPhotoUrl: mock.authorPhotoUrl,
            contentType: mock.contentType || "standard",
            bylineType: mock.bylineType,
            districtName: mock.districtName,
            publishedAt: mock.publishedAt,
            readingTimeMin: mock.readingTimeMin || 3,
            status: "published" as const,
            createdAt: "2026-10-06T00:00:00.000Z",
            updatedAt: "2026-10-06T00:00:00.000Z",
        };
    }

    const all = getCombinedArticles();
    return all.find((a) => a.id === id) || null;
}

export function saveArticle(article: NewsArticleItem): void {
    if (typeof window === "undefined") return;
    try {
        const existing = getStoredArticles();
        const index = existing.findIndex((a) => a.id === article.id);
        let updated: NewsArticleItem[];
        if (index >= 0) {
            updated = [...existing];
            updated[index] = { ...article, updatedAt: new Date().toISOString() };
        } else {
            updated = [article, ...existing];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save article to localStorage", e);
    }
}

export function deleteStoredArticle(id: string): void {
    if (typeof window === "undefined") return;
    try {
        const existing = getStoredArticles();
        const updated = existing.filter((a) => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Also track in deleted IDs so mock articles are removed from view
        const deletedIds = getDeletedArticleIds();
        if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
        }
    } catch (e) {
        console.error("Failed to delete article from localStorage", e);
    }
}
