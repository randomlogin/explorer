import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ url }) {
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    const mempoolBlockHash = Buffer.from('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'hex');

    // Get total count (vmetaouts + commitments)
    const countResult = await db.execute(sql`
        SELECT
            (SELECT COUNT(*) FROM vmetaouts WHERE block_hash = ${mempoolBlockHash} AND name IS NOT NULL) +
            (SELECT COUNT(*) FROM commitments WHERE block_hash = ${mempoolBlockHash}) as total
    `);

    const total = Number(countResult.rows[0].total);

    // Get paginated results (vmetaouts + commitments)
    const queryResult = await db.execute(sql`
        WITH all_events AS (
            SELECT
                action::text as action,
                name,
                encode(txid, 'hex') as txid,
                -1 as height,
                NULL::bigint as time,
                total_burned,
                NULL as revocation,
                'vmetaout' as event_type
            FROM vmetaouts
            WHERE block_hash = ${mempoolBlockHash}
            AND name IS NOT NULL

            UNION ALL

            SELECT
                CASE WHEN revocation THEN 'COMMITMENT REVOCATION' ELSE 'COMMITMENT' END as action,
                name,
                encode(txid, 'hex') as txid,
                -1 as height,
                NULL::bigint as time,
                NULL as total_burned,
                revocation,
                'commitment' as event_type
            FROM commitments
            WHERE block_hash = ${mempoolBlockHash}
        )
        SELECT *
        FROM all_events
        ORDER BY name DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `);

    return json({
        items: queryResult.rows,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            itemsPerPage: limit
        }
    });
};
