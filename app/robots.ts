import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
            {
                userAgent: "Googlebot-News",
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
