import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
const { Pool } = pg;
import { env } from '$env/dynamic/private';
import * as schema from '$lib/schema';

let dbUrl: string;

if (env.DB_CREDENTIALS) {
  const dbCreds = JSON.parse(env.DB_CREDENTIALS);
  dbUrl = `postgresql://${dbCreds.username}:${dbCreds.password}@${dbCreds.host}:${dbCreds.port}/${dbCreds.dbInstanceIdentifier}?sslmode=no-verify`;
} else if (env.DB_URL) {
  dbUrl = env.DB_URL;
} else {
  throw new Error('No database configuration found. Please provide either DB_CREDENTIALS or DATABASE_URL in environment variables.');
}

const pool = new Pool({ connectionString: dbUrl });
const db = drizzle(pool, { schema });
export default db;
