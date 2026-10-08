import { NextRequest, NextResponse } from "next/server";
import { db, hasDatabaseConfigured, isDbResponsive } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const DEFAULT_USERS_SEED = [
    {
        id: "usr-1",
        name: "ড. সাইদুর রহমান",
        email: "editor@noyabangla.com.bd",
        role: "editor-in-chief",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "usr-2",
        name: "তানজিমুল হাসান",
        email: "admin@noyabangla.com.bd",
        role: "super-admin",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "usr-3",
        name: "ফারহানা করিম",
        email: "farhana@noyabangla.com.bd",
        role: "sub-editor",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "usr-4",
        name: "রাহুল দে",
        email: "rahul@noyabangla.com.bd",
        role: "reporter",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "usr-5",
        name: "আহমেদ জুবায়ের",
        email: "ads@noyabangla.com.bd",
        role: "ad-manager",
        status: "inactive",
        created_at: new Date().toISOString(),
    },
];

export async function GET() {
    try {
        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const results = await db
                    .select({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        role: users.role,
                        status: users.status,
                        created_at: users.created_at,
                    })
                    .from(users)
                    .orderBy(desc(users.created_at));

                return NextResponse.json({
                    success: true,
                    source: "postgresql",
                    count: results.length,
                    data: results,
                });
            }
        }

        return NextResponse.json({
            success: true,
            source: "mock_fallback",
            count: DEFAULT_USERS_SEED.length,
            data: DEFAULT_USERS_SEED,
        });
    } catch (error) {
        console.error("[API /api/users GET Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, error: "নাম ও ইমেইল আবশ্যক (Name and Email required)" },
                { status: 400 }
            );
        }

        const id = body.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newRecord = {
            id,
            tenant_id: body.tenant_id || "tenant_default",
            name: body.name.trim(),
            email: body.email.trim(),
            password_hash: body.password_hash || null,
            role: body.role || "reporter",
            status: body.status || "active",
        };

        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const inserted = await db.insert(users).values(newRecord).returning();
                return NextResponse.json(
                    { success: true, source: "postgresql", data: inserted[0] },
                    { status: 201 }
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                source: "mock_fallback",
                data: { ...newRecord, created_at: new Date().toISOString() },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API /api/users POST Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to create user" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, role, status } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ব্যবহারকারী আইডি (id) আবশ্যক" },
                { status: 400 }
            );
        }

        const updateData: Partial<typeof users.$inferInsert> = {
            updated_at: new Date(),
        };
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        if (hasDatabaseConfigured && db) {
            const responsive = await isDbResponsive();
            if (responsive) {
                const updated = await db
                    .update(users)
                    .set(updateData)
                    .where(eq(users.id, id))
                    .returning();

                return NextResponse.json({
                    success: true,
                    source: "postgresql",
                    data: updated[0] || null,
                });
            }
        }

        return NextResponse.json({
            success: true,
            source: "mock_fallback",
            message: `ব্যবহারকারী (${id}) আপডেট সম্পন্ন হয়েছে।`,
            data: { id, ...updateData },
        });
    } catch (error) {
        console.error("[API /api/users PATCH Error]", error);
        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 }
        );
    }
}
