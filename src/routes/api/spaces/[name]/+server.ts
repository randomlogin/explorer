import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ params }) {
    let spaceName = params.name;
    
    if (spaceName.startsWith('@')) {
        spaceName = spaceName.slice(1);
    }

    const queryResult = await db.execute(sql`
WITH max_block AS (
    SELECT MAX(height) as max_height FROM blocks
)
SELECT 
    v.block_hash,
    v.txid,
    v.tx_index,
    v.outpoint_txid,
    v.outpoint_index,
    v.name,
    v.burn_increment,
    v.covenant_action,
    v.claim_height,
    v.expire_height,
    b.height AS block_height,
    b.time AS block_time,
    max_block.max_height
FROM 
    vmetaouts v
JOIN 
    blocks b ON v.block_hash = b.hash
CROSS JOIN
    max_block
WHERE
    v.name = ${spaceName}
ORDER BY 
    b.height DESC, v.tx_index DESC
    `);

    if (queryResult.rows.length === 0) {
        return error(404, "Space not found");
    }

    // Process the result to convert Buffers to hex strings
    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
        outpoint_txid: row.outpoint_txid ? row.outpoint_txid.toString('hex') : null,
    }));

    return json(processedResult);
};
