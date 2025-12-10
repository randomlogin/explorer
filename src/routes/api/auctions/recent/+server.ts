import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ url }) {
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.execute(sql`
        SELECT COUNT(*) as total
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        WHERE b.height >= 0 AND v.name IS NOT NULL;
    `);

    const total = Number(countResult.rows[0].total);

    // Get paginated results
    const queryResult = await db.execute(sql`
        SELECT 
            v.*,
            b.height,
            b.time
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        WHERE b.height >= 0 AND v.name IS NOT NULL
        ORDER BY b.height DESC
        LIMIT ${limit}
        OFFSET ${offset};
    `);

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
            totalPages: Math.ceil(total / limit),
            itemsPerPage: limit
        }
    });
};
