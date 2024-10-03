import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql, asc, desc } from 'drizzle-orm';
// import { spaces, spacesHistory, blockStats } from '$lib/schema';
import { vmetaouts, blocks,  spacesHistory } from '$lib/schema';

export const GET: RequestHandler = async function ({ request, url }) {
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sort');
    const direction = url.searchParams.get('direction');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any;

    // if (sortBy == 'ending') {
    //     orderBy = sql`case when ${spaces.claimHeight} > (select block_height from ${blockStats}) then 1 else 2 end, ${spaces.claimHeight}`
    // } else if (sortBy == 'price') {
    //     orderBy = [direction === 'desc' ? desc(spaces.bid_amount) : asc(spaces.bid_amount)];
    // } else if (sortBy == 'register_date') {
    //     orderBy = [direction === 'desc' ? desc(spaces.spacesHistoryId) : asc(spaces.spacesHistoryId)];
    // }

const latestVmetaouts = await db.query.vmetaouts.findMany({
    limit: 5,
    // with: {
    //     blocks: true
    // },
});
  //   blockHash: vmetaouts.block_hash,
  //   txid: vmetaouts.txid,
  //   txIndex: vmetaouts.tx_index,
  //   name: vmetaouts.name,
  //   covenantAction: vmetaouts.covenant_action,
  //   claimHeight: vmetaouts.claim_height,
  //   expireHeight: vmetaouts.expire_height,
  //   blockHeight: blocks.height
  // })
  // .from(vmetaouts)
  //
  // // .innerJoin(blocks, blocks.hash.eq(vmetaouts.block_hash))
  // // .orderBy(blocks.height.desc())
  // .limit(10);

    // const spacesDb = await db.query.vmetaouts.findMany({
    //     where: status ? sql`${vmetaouts.status} = ${status}`: sql`1=1`,
    //     extras: { rank: sql`dense_rank() over(order by ${spaces.bid_amount} desc, ${spaces.nameSha256})`.as('rank') },
    //     with: {
    //         history: {
    //             columns: { id: true, action: true, bid_amount: true },
    //             with: {
    //                 transaction: {
    //                     columns: { id: true, txid: true },
    //                     with: {
    //                         block: { columns: { time: true } }
    //                     }
    //                 }
    //             },
    //             orderBy: (history) =>  history.id,
    //         },
    //     },
    //     orderBy
    // });
// console.log(latestVmetaouts)
  return json(latestVmetaouts ?? []);
    // return json(spacesDb ?? []);
}
