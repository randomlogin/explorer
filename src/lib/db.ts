import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
const { Pool } = pg;
import { env } from '$env/dynamic/private';
import * as schema from '$lib/schema';

let dbUrl: string;
if (env.DB_CREDENTIALS) {
  const dbCreds = JSON.parse(env.DB_CREDENTIALS);
  dbUrl = `postgresql://${dbCreds.username}:${dbCreds.password}@${dbCreds.host}:${dbCreds.port}/${dbCreds.dbClusterIdentifier}?sslmode=no-verify&hot_standby_feedback=on`;
} else if (env.DB_URL) {
    dbUrl = env.DB_URL;
  } else {
    throw new Error('No database configuration found.');
  }

  // const pool = new Pool({ 
  //   connectionString: dbUrl,
  //   query_timeout: 3000,
  // });
  //
  const pool = new Pool({ 
    connectionString: dbUrl,
    query_timeout: 3000,         // 3 seconds (was 30000)
    statement_timeout: 3000,     // PostgreSQL statement timeout
    connectionTimeoutMillis: 5000, // Connection acquisition timeout
    idleTimeoutMillis: 30000,    // How long connections stay idle
    max: 15,                     // Max connections in pool
    min: 5,                      // Min connections to maintain
  });

  pool.on('error', (err, client) => {
    console.error('Database pool error:', {
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString()
    });

    if (err.message?.includes('conflict with recovery') || 
        err.message?.includes('canceling statement due to conflict')) {
      console.warn('Replica conflict detected - this is expected behavior');
    return;
    }

  });

  const db = drizzle(pool, { schema });
  export default db;
