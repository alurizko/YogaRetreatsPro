import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
export var pool = new Pool({ connectionString: process.env.DATABASE_URL });
export var db = drizzle(pool, { schema: schema });
