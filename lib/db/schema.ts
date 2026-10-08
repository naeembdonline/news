import {
    pgTable,
    text,
    varchar,
    timestamp,
    boolean,
    integer,
    jsonb,
} from "drizzle-orm/pg-core";

// ─── 1. TENANTS TABLE ───
export const tenants = pgTable("tenants", {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    custom_domain: varchar("custom_domain", { length: 255 }),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 2. USERS TABLE ───
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    tenant_id: text("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password_hash: text("password_hash"),
    role: varchar("role", { length: 50 }).notNull().default("reporter"),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 3. ARTICLES TABLE ───
export const articles = pgTable("articles", {
    id: text("id").primaryKey(),
    tenant_id: text("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    sub_headline: text("sub_headline"),
    content: text("content").notNull(),
    hero_image: text("hero_image"),
    image_caption: text("image_caption"),
    image_credit: text("image_credit"),
    byline_type: varchar("byline_type", { length: 50 }).default("online-desk"),
    author_name: varchar("author_name", { length: 255 }),
    district: varchar("district", { length: 100 }),
    is_breaking: boolean("is_breaking").default(false).notNull(),
    is_lead: boolean("is_lead").default(false).notNull(),
    is_opinion: boolean("is_opinion").default(false).notNull(),
    category_slug: varchar("category_slug", { length: 100 }).notNull(),
    status: varchar("status", { length: 50 }).default("draft").notNull(),
    view_count: integer("view_count").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 4. BRAND SETTINGS TABLE ───
export const brandSettings = pgTable("brand_settings", {
    id: text("id").primaryKey(),
    tenant_id: text("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" })
        .unique(),
    publication_name: varchar("publication_name", { length: 255 }).notNull(),
    tagline: text("tagline"),
    edition: varchar("edition", { length: 100 }),
    colors_json: jsonb("colors_json"),
    typography_json: jsonb("typography_json"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 5. ADVERTISEMENTS TABLE ───
export const advertisements = pgTable("advertisements", {
    id: text("id").primaryKey(),
    tenant_id: text("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" }),
    slot_key: varchar("slot_key", { length: 100 }).notNull(),
    type: varchar("type", { length: 50 }).notNull().default("banner"),
    image_url: text("image_url"),
    target_url: text("target_url"),
    script_code: text("script_code"),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Export Type Inferences
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type BrandSetting = typeof brandSettings.$inferSelect;
export type NewBrandSetting = typeof brandSettings.$inferInsert;

export type Advertisement = typeof advertisements.$inferSelect;
export type NewAdvertisement = typeof advertisements.$inferInsert;
