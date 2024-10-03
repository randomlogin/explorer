import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { blocks, getMaxBlockHeight } from '$lib/schema';

export const GET: RequestHandler = async function ({ params }) {
    const bufHash = Buffer.from(params.hash, 'hex')
    const block  = await db.query.blocks.findFirst({
        where: sql`${blocks.hash} = ${bufHash}`,
        with: {
            transactions: { 
                with: {
                    tx_inputs: {
                        columns: {
                            block_hash: false
                        }
                    },  
                    // vmetaouts: {
                    //     columns: {
                    //         block_hash: false
                    //     }, 
                    // },
                    tx_outputs: {
                        columns: {
                            block_hash: false
                        }, 
                    },

                },
            },
        },
        extras: {
            max_height: sql`(SELECT COALESCE(MAX(height), -1) FROM blocks)::integer`.as('max_height'),
        }
    })

    // block.max_height = await getMaxBlockHeight()

    if (!block)
        return error(404, 'Block not found');
    return json(block);
};
