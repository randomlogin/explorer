import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ params }) {
console.log('asking for header')
    const queryResult = await db.execute(sql `
        SELECT 
            blocks.*, 
            COALESCE(max_block.max_height, 0) as max_height,
            COALESCE(tx_count.total_transactions, 0) as total_transactions
        FROM blocks
        CROSS JOIN ( SELECT COALESCE(MAX(height), 0) as max_height FROM blocks) as max_block
        LEFT JOIN (
            SELECT COUNT(*) as total_transactions
            FROM transactions
            WHERE transactions.block_hash = (SELECT hash FROM blocks WHERE blocks.height = ${params.height})
        ) as tx_count ON true
        WHERE blocks.height = ${params.height};`)

    if (!queryResult.rows || queryResult.rows.length === 0) {
        return error(404, 'Block not found');
    }

    const blockHeader = {
        hash: queryResult.rows[0].hash.toString('hex'),
        size: queryResult.rows[0].size,
        stripped_size: queryResult.rows[0].stripped_size,
        weight: queryResult.rows[0].weight,
        height: queryResult.rows[0].height,
        version: queryResult.rows[0].version,
        hash_merkle_root: queryResult.rows[0].hash_merkle_root.toString('hex'),
        time: queryResult.rows[0].time,
        median_time: queryResult.rows[0].median_time,
        nonce: queryResult.rows[0].nonce,
        bits: queryResult.rows[0].bits.toString('hex'),
        difficulty: queryResult.rows[0].difficulty,
        chainwork: queryResult.rows[0].chainwork.toString('hex'),
        orphan: queryResult.rows[0].orphan,
        confirmations: queryResult.rows[0].max_height - queryResult.rows[0].height,
        tx_count: queryResult.rows[0].total_transactions,
    };

    return json(blockHeader);
};
