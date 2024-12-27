import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ url }) {
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    // const mempoolBlockHash = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"

    const mempoolBlockHash = Buffer.from('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'hex');
    console.log(limit, "limit")
    console.log(offset, "offset")

    // Get total count
    const countResult = await db.execute(sql`
        SELECT COUNT(*) as total
        FROM vmetaouts 
        WHERE block_hash = ${mempoolBlockHash}
        AND name IS NOT NULL;
    `);

    const total = Number(countResult.rows[0].total);

    // Get paginated results
    const queryResult = await db.execute(sql`
        SELECT 
            *,
            -1 as height
        FROM vmetaouts 
        WHERE block_hash = ${mempoolBlockHash}
        AND name IS NOT NULL
        ORDER BY name DESC
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
