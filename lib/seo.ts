import type { Metadata } from "next";

export const SITE_CONFIG = {
    name: "নয়া বাংলা",
    nameEnglish: "Noya Bangla",
    tagline: "বাংলাদেশের নির্ভরযোগ্য সংবাদ ও ডিজিটাল মিডিয়া",
    description:
        "বাংলাদেশ ও বিশ্বের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদন ও প্রযুক্তি সংবাদ পড়ুন নয়া বাংলায়। নিরপেক্ষ, বিশ্লেষণধর্মী ও বস্তুনিষ্ঠ সাংবাদিকতা।",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://noyabangla.com.bd",
    defaultOgImage: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&q=80",
    locale: "bn_BD",
    language: "bn",
    twitterHandle: "@noyabangla",
    publisher: {
        name: "নয়া বাংলা",
        logoUrl: "https://noyabangla.com.bd/logo.png",
    },
};

const BENGALI_TO_ENGLISH_DIGITS: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
};

const BENGALI_MONTHS: Record<string, string> = {
    "জানুয়ারি": "01",
    "জানুয়ারি": "01",
    "ফেব্রুয়ারি": "02",
    "ফেব্রুয়ারি": "02",
    "মার্চ": "03",
    "এপ্রিল": "04",
    "মে": "05",
    "জুন": "06",
    "জুলাই": "07",
    "আগস্ট": "08",
    "সেপ্টেম্বর": "09",
    "অক্টোবর": "10",
    "নভেম্বর": "11",
    "ডিসেম্বর": "12",
};

/**
 * Normalizes any date string (ISO, timestamp, or Bengali text like "২০২৬ অক্টোবর ৬")
 * into a valid ISO 8601 string for search engine structured data.
 */
export function parseToIsoDate(dateStr?: string | Date | null): string {
    if (!dateStr) {
        return new Date().toISOString();
    }

    if (dateStr instanceof Date) {
        return isNaN(dateStr.getTime()) ? new Date().toISOString() : dateStr.toISOString();
    }

    // Try native parse first
    const nativeTime = Date.parse(dateStr);
    if (!isNaN(nativeTime)) {
        return new Date(nativeTime).toISOString();
    }

    try {
        // Replace Bengali numerals
        let normalized = dateStr.replace(/[০-৯]/g, (match) => BENGALI_TO_ENGLISH_DIGITS[match] || match);

        // Replace Bengali month names
        for (const [bnMonth, numMonth] of Object.entries(BENGALI_MONTHS)) {
            if (normalized.includes(bnMonth)) {
                normalized = normalized.replace(bnMonth, numMonth);
                break;
            }
        }

        // Match patterns like "2026 10 6" or "6 10 2026"
        const parts = normalized.match(/\d+/g);
        if (parts && parts.length >= 3) {
            let year = parts.find((p) => p.length === 4);
            const nonYears = parts.filter((p) => p !== year);
            if (!year) year = parts[0];
            const month = nonYears[0] ? nonYears[0].padStart(2, "0") : "01";
            const day = nonYears[1] ? nonYears[1].padStart(2, "0") : "01";
            const candidate = `${year}-${month}-${day}T06:00:00+06:00`;
            const testDate = new Date(candidate);
            if (!isNaN(testDate.getTime())) {
                return testDate.toISOString();
            }
        }
    } catch {
        // Fallback
    }

    return new Date().toISOString();
}

export interface SeoArticleInput {
    title: string;
    slug: string;
    excerpt?: string;
    subtitle?: string;
    imageUrl?: string;
    imageAlt?: string;
    author?: string;
    authorDesignation?: string;
    category?: string;
    categorySlug?: string;
    publishedAt?: string;
    updatedAt?: string;
}

/**
 * Construct OpenGraph & Twitter Metadata for an article
 */
export function constructArticleMetadata(article: SeoArticleInput): Metadata {
    const siteUrl = SITE_CONFIG.url.replace(/\/$/, "");
    const canonical = `${siteUrl}/article/${article.slug}`;
    const title = article.title;
    const description = article.excerpt || article.subtitle || SITE_CONFIG.description;

    const rawImage = article.imageUrl || SITE_CONFIG.defaultOgImage;
    const ogImage = rawImage.startsWith("http")
        ? rawImage
        : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

    const publishedIso = parseToIsoDate(article.publishedAt);
    const modifiedIso = parseToIsoDate(article.updatedAt || article.publishedAt);

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            type: "article",
            publishedTime: publishedIso,
            modifiedTime: modifiedIso,
            authors: [article.author || SITE_CONFIG.name],
            section: article.category,
            tags: [article.category || "সংবাদ", "বাংলাদেশ", "নয়া বাংলা"],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 675,
                    alt: article.imageAlt || article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
            creator: SITE_CONFIG.twitterHandle,
            site: SITE_CONFIG.twitterHandle,
        },
    };
}

/**
 * Generate Google News & Discover compliant NewsArticle JSON-LD Schema
 */
export function generateNewsArticleSchema(article: SeoArticleInput) {
    const siteUrl = SITE_CONFIG.url.replace(/\/$/, "");
    const articleUrl = `${siteUrl}/article/${article.slug}`;

    const rawImage = article.imageUrl || SITE_CONFIG.defaultOgImage;
    const imageUrl = rawImage.startsWith("http")
        ? rawImage
        : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

    const publishedIso = parseToIsoDate(article.publishedAt);
    const modifiedIso = parseToIsoDate(article.updatedAt || article.publishedAt);

    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        headline: article.title,
        description: article.excerpt || article.subtitle || article.title,
        image: [imageUrl],
        datePublished: publishedIso,
        dateModified: modifiedIso,
        author: {
            "@type": "Person",
            name: article.author || SITE_CONFIG.name,
            jobTitle: article.authorDesignation || "প্রতিবেদক",
            url: siteUrl,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_CONFIG.publisher.name,
            url: siteUrl,
            logo: {
                "@type": "ImageObject",
                url: SITE_CONFIG.publisher.logoUrl,
                width: 600,
                height: 60,
            },
        },
        articleSection: article.category || "জাতীয়",
        inLanguage: SITE_CONFIG.locale,
    };
}

/**
 * Generate BreadcrumbList JSON-LD Schema for Google Search hierarchy
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    const siteUrl = SITE_CONFIG.url.replace(/\/$/, "");

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => {
            const absoluteUrl = item.url.startsWith("http")
                ? item.url
                : `${siteUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`;

            return {
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: absoluteUrl,
            };
        }),
    };
}
