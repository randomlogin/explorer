import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const GET: RequestHandler = async function ({ request, url }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT));
    
    if (isNaN(page) || page < 1) {
        throw error(400, 'Invalid page parameter');
    }
    if (isNaN(limit) || limit < 1) {
        throw error(400, 'Invalid limit parameter');
    }
    
    limit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * limit;

    const queryResult = await db.execute(sql`
        WITH LatestVMetaouts AS (
            SELECT
                name,
                action,
                identifier,
                ROW_NUMBER() OVER (PARTITION BY name ORDER BY identifier DESC) as rn
            FROM vmetaouts
            WHERE name IS NOT NULL
        ),
        bid_counts AS (
        SELECT
            name,
            COUNT(*) as bid_count
        FROM vmetaouts
        WHERE action = 'BID'
        GROUP BY name
        )
        SELECT
            v.*,
            b.height as block_height,
            COALESCE(bc.bid_count, 0) as bid_count,
            COUNT(*) OVER() as total_count
        FROM LatestVMetaouts latest_vmetaouts
        JOIN vmetaouts v ON v.name = latest_vmetaouts.name AND v.identifier = latest_vmetaouts.identifier
        JOIN transactions t ON t.block_hash = v.block_hash AND t.txid = v.txid
        JOIN blocks b ON b.hash = t.block_hash
        LEFT JOIN bid_counts bc ON bc.name = v.name
        WHERE latest_vmetaouts.rn = 1
        AND (latest_vmetaouts.action = 'BID' OR latest_vmetaouts.action = 'ROLLOUT')
        ORDER BY v.value DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `);

    const totalCount = queryResult.rows[0]?.total_count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return json({
        items: processedResult,
        pagination: {
            page,
            limit,
            total_items: totalCount,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
        }
    });
}
