import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { addressToScriptPubKey } from '$lib/utils/address-parsers';

export const GET: RequestHandler = async function ({ url }) {
    const search = url.searchParams.get('q');
    if (!search)
        return json([]);
    const result = [];
    const hashRegexp = /^[a-fA-F0-9]{64}$/;
    const heightRegexp = /^\d+$/;

    // Try to parse as address first
    // try {
    //     const scriptPubKey = Buffer.from(addressToScriptPubKey(search), 'hex');
    //     
    //     const addressTx = await db.execute(sql`
    //         SELECT 1 FROM tx_outputs 
    //         WHERE scriptPubKey = ${scriptPubKey} 
    //         LIMIT 1
    //     `);
    //
    //     if (addressTx.rows[0]) {
    //         result.push({
    //             type: "address",
    //             value: {
    //                 address: search
    //             }
    //         });
    //     }
    // } catch (e) {
    //     // Not a valid address, continue with other searches
    // }

    //looks like hash, search for txid or block hash
    if (hashRegexp.test(search)) {
        const hexString = Buffer.from(search, 'hex');
        
        const transaction = await db.execute(sql`
            SELECT transactions.txid, transactions.block_hash 
            FROM transactions 
            WHERE txid = ${hexString} 
            LIMIT 1
        `);
        if (transaction.rows[0]) {
            result.push({ 
                type: "transaction", 
                value: {
                    ...transaction.rows[0],
                    txid: transaction.rows[0].txid.toString('hex'),
                    block_hash: transaction.rows[0].block_hash.toString('hex')
                }
            });
        }
        const block = await db.execute(sql`
            SELECT blocks.hash, blocks.height 
            FROM blocks 
            WHERE hash = ${hexString} 
            LIMIT 1
        `);
        if (block.rows[0]) {
            result.push({ 
                type: "block", 
                value: {
                    ...block.rows[0],
                    hash: block.rows[0].hash.toString('hex'),
                    height: block.rows[0].height
                }
            });
        }
    }
    //looks like height
    else if (heightRegexp.test(search)) {
        const height = +search;
        if (height <= 2**32) {
            const block = await db.execute(sql`
                SELECT blocks.hash, blocks.height
                FROM blocks 
                WHERE height = ${height} 
                LIMIT 1
            `);
            if (block.rows[0]) {
                result.push({ 
                    type: "block", 
                    value: {
                        ...block.rows[0],
                        hash: block.rows[0].hash.toString('hex'),
                        height: block.rows[0].height
                    }
                });
            }
        }
    }

    // the rest should be a space
    const strippedSpace = search.startsWith('@') ? search.substring(1) : search;
    const names = await db.execute(sql`
        SELECT DISTINCT 
            name,
            similarity(name, ${strippedSpace}) AS similarity_score
        FROM vmetaouts
        WHERE similarity(name, ${strippedSpace}) > 0
        ORDER BY similarity_score DESC, name ASC
        LIMIT 3
    `);
    for (const space of names.rows) {
        result.push({ type: "space", value: space });
    }
    
    return json(result);
}
