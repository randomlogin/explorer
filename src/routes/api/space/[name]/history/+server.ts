import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { SpaceData, Vmetaout } from '$lib/types/space';

const ITEMS_PER_PAGE = 10;

export const GET: RequestHandler = async function ({ params, url }) {
    let spaceName = params.name.toLowerCase();
    const page = Number(url.searchParams.get('page')) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    if (spaceName.startsWith('@')) {
        spaceName = spaceName.slice(1);
    }

    // Query 1: Get latest state and current height
    const latestResult = await db.execute(sql`
    WITH max_block AS (
        SELECT MAX(height) as max_height 
        FROM blocks
    ),
    latest_action AS (
        SELECT 
            v.block_hash,
            v.txid,
            v.name,
            v.burn_increment,
            v.total_burned,
            v.value,
            v.action,
            v.claim_height,
            v.expire_height,
            v.reason,
            v.script_error,
            b.height AS block_height,
            b.time AS block_time,
            t.index as tx_index
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        JOIN transactions t ON t.txid = v.txid AND t.block_hash = v.block_hash
        WHERE v.name = ${spaceName} AND b.orphan is false AND v.action != 'REJECT'
        ORDER BY b.height DESC, t.index DESC
        LIMIT 1
    )
    SELECT 
        l.*,
        m.max_height as current_height
    FROM latest_action l
    CROSS JOIN max_block m
    `);

    // Query 2: Get paginated history (vmetaouts + commitments) and counts
    const historyResult = await db.execute(sql`
    WITH counts AS (
        SELECT
            (SELECT COUNT(*) FROM vmetaouts v JOIN blocks b ON v.block_hash = b.hash WHERE v.name = ${spaceName} AND b.orphan is false) +
            (SELECT COUNT(*) FROM commitments c JOIN blocks b ON c.block_hash = b.hash WHERE c.name = ${spaceName} AND b.orphan is false) as total_actions,
            COUNT(CASE WHEN action = 'BID' THEN 1 END) as bid_count
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        WHERE v.name = ${spaceName} AND b.orphan is false
    ),
    all_events AS (
        SELECT
            v.block_hash,
            v.txid,
            v.name,
            v.burn_increment,
            v.total_burned,
            v.value,
            v.action::text as action,
            v.claim_height,
            v.expire_height,
            v.reason,
            v.script_error,
            NULL::bytea as state_root,
            false as revocation,
            'vmetaout' as event_type,
            b.height AS block_height,
            b.time AS block_time,
            t.index as tx_index
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        JOIN transactions t ON t.txid = v.txid AND t.block_hash = v.block_hash
        WHERE v.name = ${spaceName} AND b.orphan is false

        UNION ALL

        SELECT
            c.block_hash,
            c.txid,
            c.name,
            NULL as burn_increment,
            NULL as total_burned,
            NULL as value,
            CASE WHEN c.revocation THEN 'COMMITMENT REVOCATION' ELSE 'COMMITMENT' END as action,
            NULL as claim_height,
            NULL as expire_height,
            NULL as reason,
            NULL as script_error,
            c.state_root,
            c.revocation,
            'commitment' as event_type,
            b.height AS block_height,
            b.time AS block_time,
            t.index as tx_index
        FROM commitments c
        JOIN blocks b ON c.block_hash = b.hash
        JOIN transactions t ON t.txid = c.txid AND t.block_hash = c.block_hash
        WHERE c.name = ${spaceName} AND b.orphan is false
    )
    SELECT
        e.*,
        c.total_actions,
        c.bid_count
    FROM all_events e
    CROSS JOIN counts c
    ORDER BY
    CASE
        WHEN e.block_height = -1 THEN 1
        ELSE 0
    END DESC,
    e.block_height DESC,
    e.tx_index DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
    `);


    const processVmetaout = (row: any): Vmetaout => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
        state_root: row.state_root ? row.state_root.toString('hex') : null,
    });

    const total = historyResult.rows[0]?.total_actions || 0;

    // If no data found
    if (total === 0) {
        return json({
            latest: null,
            items: [],
            stats: {
                total: 0,
                bidCount: 0,
            },
            pagination: {
                total: 0,
                page: 1,
                totalPages: 0,
                itemsPerPage: ITEMS_PER_PAGE
            },
            currentHeight: latestResult.rows[0]?.current_height || 0
        });
    }

    const items = historyResult.rows.map(processVmetaout);
    
    return json({
        latest: latestResult.rows[0] ? processVmetaout(latestResult.rows[0]) : null,
        items,
        stats: {
            total,
            bidCount: historyResult.rows[0].bid_count
        },
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / ITEMS_PER_PAGE),
            itemsPerPage: ITEMS_PER_PAGE
        },
        currentHeight: latestResult.rows[0]?.current_height || 0
    });
};
