import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler, redirect } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { ApiSearchResponse } from '$lib/types/api';
import { vmetaouts, spacesHistory, blocks, transactions } from '$lib/schema';

export const GET: RequestHandler = async function ({ request, url }) {
    const search = url.searchParams.get('q');
    if (!search)
        return json([]);

    const result = [];
    const hashRegexp = /^[a-fA-F0-9]{64}$/;
    const heightRegexp = /^\d+$/;
    if (hashRegexp.test(search)) {
        const hexString = Buffer.from(search, 'hex')
        const transaction = await db.query.transactions.findFirst({ where: sql`${transactions.txid} = ${hexString}`, })
        if (transaction) {
            result.push({type: "transaction", value: transaction})
        }

        const block = await db.query.blocks.findFirst({ where: sql`${blocks.hash} = ${hexString}`, })
        if (block) {
            result.push({type: "block", value: block})
        }
    }
    else if (heightRegexp.test(search)) {
        const height = +search
        if (height <= 2**32) {
            const block = await db.query.blocks.findFirst({ where: sql`${blocks.height} = ${height}`, })

            if (block) {
                result.push({type: "block", value: block})
            }
        }
    } 
    // gelse {
    const names = await db
    .selectDistinct({
        name: vmetaouts.name,
        similarity: sql`similarity(${vmetaouts.name}, ${search}) AS similarity_score`
    })
    .from(vmetaouts)
    .where(sql`similarity(${vmetaouts.name}, ${search}) > 0`)
    .orderBy(sql`similarity_score DESC`, sql`${vmetaouts.name} ASC`)
    .limit(3);
    for (const space of names) {
        result.push({type: "space", value: space})
    }
    console.log("mynames", names)
    // }

    // const result = await db.select().from(spaces).where(sql`similarity(${spaces.name}, ${search}) > 0`).orderBy(sql`similarity(${spaces.name}, ${search}) desc`).limit(3);

    return json(result);
}
