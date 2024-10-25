import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function ({ url }) {
    const search = url.searchParams.get('q');
    if (!search)
        return json([]);
    const result = [];
    const hashRegexp = /^[a-fA-F0-9]{64}$/;
    const heightRegexp = /^\d+$/;
    if (hashRegexp.test(search)) {
        const hexString = Buffer.from(search, 'hex');
        
        const transaction = await db.execute(sql`SELECT * FROM transactions WHERE txid = ${hexString} LIMIT 1`);
        if (transaction.rows[0]) {
            result.push({ 
                type: "transaction", 
                value: {
                    ...transaction.rows[0],
                    txid: transaction.rows[0].txid.toString('hex'),
                    tx_hash: transaction.rows[0].tx_hash.toString('hex'),
                    block_hash: transaction.rows[0].block_hash.toString('hex')
                }
            });
        }
        const block = await db.execute(sql`SELECT * FROM blocks WHERE hash = ${hexString} LIMIT 1`);
        if (block.rows[0]) {
            result.push({ 
                type: "block", 
                value: {
                    ...block.rows[0],
                    hash: block.rows[0].hash.toString('hex'),
                    hash_merkle_root: block.rows[0].hash_merkle_root.toString('hex'),
                    bits: block.rows[0].bits.toString('hex'),
                    chainwork: block.rows[0].chainwork.toString('hex')
                }
            });
        }
    }
    else if (heightRegexp.test(search)) {
        const height = +search;
        if (height <= 2**32) {
            const block = await db.execute( sql`SELECT * FROM blocks WHERE height = ${height} LIMIT 1`);
            if (block.rows[0]) {
                result.push({ 
                    type: "block", 
                    value: {
                        ...block.rows[0],
                        hash: block.rows[0].hash.toString('hex'),
                        hash_merkle_root: block.rows[0].hash_merkle_root.toString('hex'),
                        bits: block.rows[0].bits.toString('hex'),
                        chainwork: block.rows[0].chainwork.toString('hex')
                    }
                });
            }
        }
    }
    // Raw SQL for name search with similarity
    const names = await db.execute(sql`
        SELECT DISTINCT 
            name,
            similarity(name, ${search}) AS similarity_score
        FROM vmetaouts
        WHERE similarity(name, ${search}) > 0
        ORDER BY similarity_score DESC, name ASC
        LIMIT 3
    `);
    for (const space of names.rows) {
        result.push({ type: "space", value: space });
    }
    return json(result);
}
