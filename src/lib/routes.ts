export const API_ROUTES = {
    space: {
        history: (name: string, page?: number) => `/api/space/${name}/history${page ? `?page=${page}` : ''}`,
        stats: (name: string) => `/api/space/${name}/stats`,
        info: (name: string) => `/api/space/${name}`,
    },
    address: (address: string) => `/api/address/${address}`,
    actions: () => `/api/actions/rollout`,
    auctions: {
        current: () => `/api/auctions/current`,
        past: () => `/api/auctions/past`,
        recent: () => `/api/auctions/recent`,
    },
    block: {
        txs: (identifier) => `/api/block/${identifier}`,
        header: (identifier) => `/api/block/${identifier}`,
    },
    search:() => `/api/search`, 
    transaction: {
        get: (txid: string) => `/api/tx/${txid}`,
        list: (page?: number) => `/api/transactions${page ? `?page=${page}` : ''}`
    },
    stats: {
        overview: () => '/api/stats'
    }
} as const;
