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
),
name_burns AS (
    SELECT 
        name,
        MAX(total_burned) as name_total_burned
    FROM vmetaouts
    WHERE script_error IS NULL 
        AND name IS NOT NULL
    GROUP BY name
)
SELECT 
    lb.height as latest_block_height,
    lb.time as latest_block_time,
    (SELECT COUNT(DISTINCT name) FROM vmetaouts WHERE name IS NOT NULL) as unique_names_count,
    (SELECT COUNT(*) FROM vmetaouts) as valid_vmetaouts_count,
    (SELECT SUM(name_total_burned) FROM name_burns) as total_burned_sum,
    (SELECT COUNT(*) FROM vmetaouts WHERE action = 'RESERVE') as reserve_count,
    (SELECT COUNT(*) FROM vmetaouts WHERE action = 'BID') as bid_count,
    (SELECT COUNT(*) FROM vmetaouts WHERE action = 'TRANSFER') as transfer_count,
    (SELECT COUNT(*) FROM vmetaouts WHERE action = 'ROLLOUT') as rollout_count,
    (SELECT COUNT(*) FROM vmetaouts WHERE action = 'REVOKE') as revoke_count
FROM latest_block lb;
    `);

    return json(queryResult.rows[0])
}
