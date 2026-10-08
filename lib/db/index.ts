import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Cache database instance and pool across hot reloads in development
declare global {
    // eslint-disable-next-line no-var
    var __db_pool__: Pool | undefined;
    // eslint-disable-next-line no-var
    var __drizzle_db__: NodePgDatabase<typeof schema> | undefined;
}

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;

export const hasDatabaseConfigured = Boolean(
    connectionString && connectionString.trim().length > 0 && !connectionString.includes("localhost:5432/bangla_news_placeholder")
);

if (hasDatabaseConfigured && connectionString) {
    try {
        if (!globalThis.__db_pool__) {
            globalThis.__db_pool__ = new Pool({
                connectionString,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 4000,
            });

            // Prevent unhandled errors from crashing the Node process
            globalThis.__db_pool__.on("error", (err) => {
                console.warn("[PostgreSQL Pool Error (Handled)]", err.message);
            });
        }

        pool = globalThis.__db_pool__;

        if (!globalThis.__drizzle_db__) {
            globalThis.__drizzle_db__ = drizzle(pool, { schema });
        }
        db = globalThis.__drizzle_db__;
    } catch (err) {
        console.warn("[Database Initialization Warning - Operating in Fallback Mode]", err);
        pool = null;
        db = null;
    }
}

/**
 * Checks if the PostgreSQL connection is actively responsive
 */
export async function isDbResponsive(): Promise<boolean> {
    if (!pool) return false;
    try {
        const client = await pool.connect();
        try {
            await client.query("SELECT 1");
            return true;
        } finally {
            client.release();
        }
    } catch {
        return false;
    }
}

export { db, pool, schema };
