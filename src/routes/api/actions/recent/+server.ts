// src/routes/api/spaces/recent/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
// import type { RecentSpaceActionsResponse } from '$lib/types/recentSpaceActions';

export const GET: RequestHandler = async () => {
    const mockData = {
        actions: [
            {
                name: "fakeMockName1",
                type: "transfer",
                address: "tb1q55ecnuunvpue2tpz06ehyc6ms6y9xhrl9rak7z",
                block: {
                    height: 49007,
                    time: 1723908277,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f9"
                },
                transaction: {
                    txid: "75006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1e",
                    index: 0,
                    output_index: 1
                }
            },
            {
                name: "fakeMockName1",
                type: "transfer",
                address: "tb1q55ecnuunvpue2tpz06ehyc6ms6y9xhrl9rak7z",
                block: {
                    height: 49007,
                    time: 1723908277,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f9"
                },
                transaction: {
                    txid: "75006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1e",
                    index: 0,
                    output_index: 1
                }
            },
            {
                name: "fakeMockName1",
                type: "transfer",
                address: "tb1q55ecnuunvpue2tpz06ehyc6ms6y9xhrl9rak7z",
                block: {
                    height: 49007,
                    time: 1723908277,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f9"
                },
                transaction: {
                    txid: "75006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1e",
                    index: 0,
                    output_index: 1
                }
            },

            {
                name: "fakeMockName2",
                type: "bid",
                value: 1000000,
                block: {
                    height: 49006,
                    time: 1723908200,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f8"
                },
                transaction: {
                    txid: "65006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1d",
                    index: 2,
                    output_index: 0
                }
            },
            {
                name: "fakeMockName3",
                type: "register",
                block: {
                    height: 49005,
                    time: 1723908100,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f7"
                },
                transaction: {
                    txid: "55006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1c",
                    index: 1,
                    output_index: 1
                }
            },
            {
                name: "fakeMockName4",
                type: "reserve",
                block: {
                    height: 49004,
                    time: 1723908000,
                    hash: "0000000000000017fc36f62134c8631f15b20f2f585f56478adbdd05e523e0f6"
                },
                transaction: {
                    txid: "45006cbdc1f1c0a3f9bcd480493148aa2334efb8c8e6bbf396e2a05d0167ff1b",
                    index: 3,
                    output_index: 0
                }
            }
        ]
    };

    return json(mockData);
};
