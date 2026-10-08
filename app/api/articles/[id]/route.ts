import { NextRequest, NextResponse } from "next/server";
import { db, hasDatabaseConfigured, isDbResponsive } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { allArticles, getArticleBySlug } from "@/lib/mockData";
import { eq, or } from "drizzle-orm";

interface RouteParams {
    params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const id = params.id;

        // 1. Try Drizzle PostgreSQL
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const found = await db
                    .select()
                    .from(articles)
                    .where(or(eq(articles.id, id), eq(articles.slug, id)))
                    .limit(1);

                if (found.length > 0) {
                    return NextResponse.json({
                        success: true,
                        source: "postgresql",
                        data: found[0],
                    });
                }
            }
        }

        // 2. Fallback check from mock data
        const mock = allArticles.find((a) => a.id === id) || getArticleBySlug(id);
        if (mock) {
            return NextResponse.json({
                success: true,
                source: "mock_fallback",
                data: {
                    id: mock.id,
                    title: mock.title,
                    slug: mock.slug,
                    sub_headline: mock.subtitle || null,
                    content: Array.isArray(mock.body) ? mock.body.join("\n\n") : mock.body,
                    hero_image: mock.imageUrl,
                    image_caption: mock.imageAlt || null,
                    author_name: mock.author,
                    category_slug: mock.categorySlug,
                    status: "published",
                },
            });
        }

        return NextResponse.json(
            { success: false, error: "সংবাদটি পাওয়া যায়নি (Article not found)" },
            { status: 404 }
        );
    } catch (error) {
        console.error("[API /api/articles/[id] GET Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch article" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const id = params.id;
        const body = await request.json();

        const updateData: Partial<typeof articles.$inferInsert> = {
            updated_at: new Date(),
        };

        if (body.title) updateData.title = body.title.trim();
        if (body.slug) updateData.slug = body.slug.trim();
        if (body.sub_headline !== undefined) updateData.sub_headline = body.sub_headline;
        if (body.content !== undefined) updateData.content = body.content;
        if (body.hero_image !== undefined) updateData.hero_image = body.hero_image;
        if (body.image_caption !== undefined) updateData.image_caption = body.image_caption;
        if (body.image_credit !== undefined) updateData.image_credit = body.image_credit;
        if (body.byline_type !== undefined) updateData.byline_type = body.byline_type;
        if (body.author_name !== undefined) updateData.author_name = body.author_name;
        if (body.district !== undefined) updateData.district = body.district;
        if (body.is_breaking !== undefined) updateData.is_breaking = Boolean(body.is_breaking);
        if (body.is_lead !== undefined) updateData.is_lead = Boolean(body.is_lead);
        if (body.is_opinion !== undefined) updateData.is_opinion = Boolean(body.is_opinion);
        if (body.category_slug !== undefined) updateData.category_slug = body.category_slug;
        if (body.status !== undefined) updateData.status = body.status;

        // Try updating in PostgreSQL
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const updated = await db
                    .update(articles)
                    .set(updateData)
                    .where(eq(articles.id, id))
                    .returning();

                if (updated.length > 0) {
                    return NextResponse.json({
                        success: true,
                        source: "postgresql",
                        data: updated[0],
                    });
                }
            }
        }

        // Fallback response
        return NextResponse.json({
            success: true,
            source: "mock_fallback",
            data: { id, ...updateData, updated_at: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[API /api/articles/[id] PUT Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to update article" },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const id = params.id;

        // Try deleting from PostgreSQL
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                await db.delete(articles).where(eq(articles.id, id));
            }
        }

        return NextResponse.json({
            success: true,
            message: `সংবাদটি (${id}) সফলভাবে অপসারণ করা হয়েছে।`,
        });
    } catch (error) {
        console.error("[API /api/articles/[id] DELETE Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete article" },
            { status: 500 }
        );
    }
}
