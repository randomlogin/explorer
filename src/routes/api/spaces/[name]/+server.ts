import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

const ITEMS_PER_PAGE = 10;

export const GET: RequestHandler = async function ({ params, url }) {
    let spaceName = params.name;
    const page = Number(url.searchParams.get('page')) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    if (spaceName.startsWith('@')) {
        spaceName = spaceName.slice(1);
    }

    // First get total count
    const countResult = await db.execute(sql`
        SELECT COUNT(*) as total
        FROM vmetaouts
        WHERE name = ${spaceName}
    `);
    const total = Number(countResult.rows[0].total);

    if (total === 0) {
        return json({
            items: [],
            pagination: {
                total: 0,
                page: 1,
                totalPages: 0,
                itemsPerPage: ITEMS_PER_PAGE
            }
        });
    }

    // Then get paginated data
    const queryResult = await db.execute(sql`
    WITH max_block AS (
        SELECT MAX(height) as max_height FROM blocks
    )
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
        max_block.max_height as current_height
    FROM 
        vmetaouts v
    JOIN 
        blocks b ON v.block_hash = b.hash
    CROSS JOIN
        max_block
    WHERE
        v.name = ${spaceName}
    ORDER BY 
        b.height DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
    `);

    // Process the result to convert Buffers to hex strings
    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return json({
        items: processedResult,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / ITEMS_PER_PAGE),
            itemsPerPage: ITEMS_PER_PAGE
        }
    });
};
