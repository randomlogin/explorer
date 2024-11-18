import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ request, url }) {
    // const status = url.searchParams.get('status');
    // const sortBy = url.searchParams.get('sort');
    // const direction = url.searchParams.get('direction');
    //
    // let orderBy: any;
    const limit = 10;

    const queryResult = await db.execute(sql`
        SELECT 
        v.*,
        b.height,
        b.time
        FROM vmetaouts v
        JOIN blocks b ON v.block_hash = b.hash
        WHERE NOT b.orphan and v.name is not null
        ORDER BY b.height DESC
        LIMIT ${limit};
    `);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return json(processedResult)

}
