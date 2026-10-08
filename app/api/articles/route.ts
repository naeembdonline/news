import { NextRequest, NextResponse } from "next/server";
import { db, hasDatabaseConfigured, isDbResponsive } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { allArticles } from "@/lib/mockData";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");

        // 1. Try Drizzle PostgreSQL if configured & responsive
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                let query = db.select().from(articles).orderBy(desc(articles.created_at));

                if (category) {
                    // @ts-expect-error dynamic condition
                    query = query.where(eq(articles.category_slug, category));
                }
                if (status) {
                    // @ts-expect-error dynamic condition
                    query = query.where(eq(articles.status, status));
                }

                const results = await query;
                return NextResponse.json({
                    success: true,
                    source: "postgresql",
                    count: results.length,
                    data: results,
                });
            }
        }

        // 2. Graceful Mock Dataset Fallback
        let fallbackData = allArticles.map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            sub_headline: a.subtitle || null,
            content: Array.isArray(a.body) ? a.body.join("\n\n") : a.body,
            hero_image: a.imageUrl,
            image_caption: a.imageAlt || null,
            image_credit: null,
            byline_type: a.bylineType || "online-desk",
            author_name: a.author,
            district: a.districtName || null,
            is_breaking: Boolean(a.isBraking),
            is_lead: false,
            is_opinion: a.contentType === "opinion",
            category_slug: a.categorySlug,
            status: "published",
            view_count: 1420,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }));

        if (category) {
            fallbackData = fallbackData.filter((a) => a.category_slug === category);
        }

        return NextResponse.json({
            success: true,
            source: "mock_fallback",
            count: fallbackData.length,
            data: fallbackData,
        });
    } catch (error) {
        console.error("[API /api/articles GET Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.title || !body.title.trim()) {
            return NextResponse.json(
                { success: false, error: "শিরোনাম (Title) আবশ্যক" },
                { status: 400 }
            );
        }

        const id = body.id || `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const slug = body.slug || `article-${Date.now()}`;
        const newRecord = {
            id,
            tenant_id: body.tenant_id || "tenant_default",
            title: body.title.trim(),
            slug,
            sub_headline: body.sub_headline || body.subtitle || null,
            content: body.content || body.body || "",
            hero_image: body.hero_image || body.imageUrl || null,
            image_caption: body.image_caption || body.imageCaption || null,
            image_credit: body.image_credit || body.photoCredit || null,
            byline_type: body.byline_type || body.bylineMode || "online-desk",
            author_name: body.author_name || body.author || "অনলাইন ডেস্ক",
            district: body.district || body.districtName || null,
            is_breaking: Boolean(body.is_breaking || body.isBreaking),
            is_lead: Boolean(body.is_lead || body.isLead),
            is_opinion: Boolean(body.is_opinion || body.contentType === "opinion"),
            category_slug: body.category_slug || body.categorySlug || "national",
            status: body.status || "published",
            view_count: 0,
        };

        // Try inserting into PostgreSQL
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const inserted = await db.insert(articles).values(newRecord).returning();
                return NextResponse.json(
                    { success: true, source: "postgresql", data: inserted[0] },
                    { status: 201 }
                );
            }
        }

        // Return successfully with the constructed record
        return NextResponse.json(
            {
                success: true,
                source: "mock_fallback",
                data: { ...newRecord, created_at: new Date().toISOString() },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API /api/articles POST Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to create article" },
            { status: 500 }
        );
    }
}
