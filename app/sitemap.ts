import { MetadataRoute } from "next";
import { allArticles, CATEGORIES } from "@/lib/mockData";
import { SITE_CONFIG, parseToIsoDate } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");

    // 1. Home page
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "always",
            priority: 1.0,
        },
    ];

    // 2. Category pages
    CATEGORIES.forEach((category) => {
        routes.push({
            url: `${baseUrl}/category/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.8,
        });
    });

    // 3. All Published Articles
    allArticles.forEach((article) => {
        let lastMod = new Date();
        try {
            const iso = parseToIsoDate(article.publishedAt);
            const parsed = new Date(iso);
            if (!isNaN(parsed.getTime())) {
                lastMod = parsed;
            }
        } catch {
            lastMod = new Date();
        }

        routes.push({
            url: `${baseUrl}/article/${article.slug}`,
            lastModified: lastMod,
            changeFrequency: "daily",
            priority: 0.9,
        });
    });

    return routes;
}
