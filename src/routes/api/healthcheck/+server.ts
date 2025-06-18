import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ request, url }) {

    const queryResult = await db.execute(sql`
WITH latest_block AS (
    SELECT height, time
    FROM blocks 
    WHERE NOT orphan 
    ORDER BY height DESC 
    LIMIT 1
)
SELECT 
    lb.height as latest_block_height
FROM latest_block lb;
    `);

    return json(queryResult.rows[0])
}

