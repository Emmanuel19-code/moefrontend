import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/schema";

const client = postgres("postgresql://postgres:y3F9zd282vYLFG9c@db.oauzkikdyqrtzqkawvas.supabase.co:5432/postgres");
export const db = drizzle(client, { schema });