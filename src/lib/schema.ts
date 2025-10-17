import  db  from "$lib/db";
import { sql } from "drizzle-orm";

// const bytea = customType({
//   dataType() { return "bytea" },
//   fromDriver(value: unknown): string {
//     if (typeof value === 'string' && value.startsWith('\\x')) {
//         return value.slice(2)
//     }
// 		return value.toString('hex')
//   },
//   toDriver(value: Buffer): Buffer {
// 		return Buffer.from(value, 'hex')
//   },
// });

export async function getMaxBlockHeight() {
	const result = await db.execute(sql`
	SELECT COALESCE(MAX(height), -1)::integer AS max_height
	FROM blocks
	`);

	return result.rows[0].max_height;
}
