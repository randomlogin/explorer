import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import {  transactions } from '$lib/schema';

export const GET: RequestHandler = async function ({  params }) {
    // const blockDb  = await db.query.blocks.findFirst({
    //
    //     where: sql`${blocks.height} = ${params.height}`,
    //     with: {
    //         transactions: { 
    //             with: {
    //                 tx_inputs: {
    //                     columns: {
    //                         block_hash: false,
    //                         txid: false
    //                     }
    //                 },  
    //                 tx_outputs: {
    //                     columns: {
    //                         block_hash: false,
    //                         txid: false
    //                     }, 
    //                 },
    //
    //             },
    //         },
    //     }
    // })
    const txid = Buffer.from(params.txid, 'hex')

    const transaction = await db.query.transactions.findFirst({
        where: sql`${transactions.txid} = ${txid}`,
        with: {
            block: {
                columns: {
                    time: true,
                    height: true,
                },
            },
            tx_inputs: {
                columns: {
                    block_hash: false
                }
            },  
            tx_outputs: {
                columns: {
                    block_hash: false
                }, 
            },
        },
        extras: {
            max_height: sql`( SELECT COALESCE(MAX(height), -1) FROM blocks)::integer`.as('max_height'),
        }
    });

    if (!transaction)
        return error(404, 'Transaction not found');

    //TODO add to the schema field spender
    transaction.confirmations = transaction.max_height - transaction.block.height
    for (const [index, tx_output] of transaction.tx_outputs.entries()) {
        const spender_txid = await db.query.tx_inputs.findFirst({
            where: sql`hash_prevout = ${txid} and index_prevout = ${index}`,
            columns: {
                txid: true
            },
        })
        if (spender_txid) {
            tx_output.spender = spender_txid.txid
        }
    }

    return json(transaction);
}
