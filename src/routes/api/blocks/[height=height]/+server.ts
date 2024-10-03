import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { blocks, vmetaouts, getMaxBlockHeight } from '$lib/schema';

export const GET: RequestHandler = async function ({ params }) {
    const block  = await db.query.blocks.findFirst({
        
        where: sql`${blocks.height} = ${params.height}`,
        with: {
            transactions: { 
                with: {
                    tx_inputs: {
                        columns: {
                            block_hash: false,
                            txid: false
                        }
                    },  
                    // vmetaouts: {
                    //     columns: {
                    //         block_hash: false
                    //     }, 
                    // },
                    tx_outputs: {
                        columns: {
                            block_hash: false,
                            txid: false
                        }, 
                    },

                },
            },
        }
    })
    block.max_height = await getMaxBlockHeight()

    if (!block)
        return error(404, 'Block not found');

    return json(block);
};
