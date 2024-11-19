import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ url }) {
    const startTime = performance.now();
    
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Count query remains the same
    const countResult = await db.execute(sql`
        WITH latest_actions AS (
            SELECT 
                v.name,
                v.action,
                b.height,
                ROW_NUMBER() OVER (PARTITION BY v.name ORDER BY b.height DESC) as rn
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE NOT b.orphan
        ),
        bid_spaces AS (
            SELECT DISTINCT name
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE v.action = 'BID' AND NOT b.orphan
        ),
        rollout_spaces AS (
            SELECT DISTINCT name
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE v.action = 'ROLLOUT' AND NOT b.orphan
        )
        SELECT COUNT(*) as total
        FROM bid_spaces b
        WHERE NOT EXISTS (
            SELECT 1 FROM rollout_spaces r
            WHERE r.name = b.name
        )
        AND EXISTS (
            SELECT 1 FROM latest_actions la
            WHERE la.name = b.name
            AND la.rn = 1
            AND la.action = 'BID'
        );
    `);

    const total = Number(countResult.rows[0].total);

    // Modified query with updated ordering
    const queryResult = await db.execute(sql`
        WITH latest_bid_info AS (
            SELECT 
                v.name,
                v.total_burned as winning_bid,
                b.height as bid_height,
                ROW_NUMBER() OVER (PARTITION BY v.name ORDER BY b.height DESC) as rn
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE v.action = 'BID' 
            AND NOT b.orphan
        ),
        rollout_spaces AS (
            SELECT DISTINCT name
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE v.action = 'ROLLOUT' AND NOT b.orphan
        ),
        eligible_spaces AS (
            SELECT 
                name,
                winning_bid,
                bid_height
            FROM latest_bid_info
            WHERE rn = 1
            AND NOT EXISTS (
                SELECT 1 FROM rollout_spaces r
                WHERE r.name = latest_bid_info.name
            )
            ORDER BY bid_height ASC, winning_bid DESC
            LIMIT ${limit}
            OFFSET ${offset}
        ),
        latest_actions AS (
            SELECT 
                v.*,
                b.height,
                b.time,
                ROW_NUMBER() OVER (PARTITION BY v.name ORDER BY b.height DESC) as rn
            FROM vmetaouts v
            JOIN blocks b ON v.block_hash = b.hash
            WHERE v.name IN (SELECT name FROM eligible_spaces)
            AND NOT b.orphan
        )
        SELECT 
            la.*,
            b.height as block_height,
            b.time as block_time,
            es.winning_bid
        FROM latest_actions la
        JOIN blocks b ON la.block_hash = b.hash
        JOIN eligible_spaces es ON es.name = la.name
        WHERE la.rn = 1
        ORDER BY es.bid_height ASC, es.winning_bid DESC
    `);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
        winning_bid: row.winning_bid,
    }));

    const endTime = performance.now();
    console.log(`Rollout API response time: ${(endTime - startTime).toFixed(2)}ms`);

    return json({
        items: processedResult,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            itemsPerPage: limit
        }
    });
};
