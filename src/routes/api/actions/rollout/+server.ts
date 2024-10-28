import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
// import type { RecentSpaceActionsResponse } from '$lib/types/recentSpaceActions';

export const GET: RequestHandler = async () => {
    const mockData = [
        {
            name: 'fakeMockName1',
            bid: 1500000,
            releaseHeight: 54500,
        },
        {
            name: 'fakeMockName2',
            bid: 2000000,
            releaseHeight: 54500,
        },
        {
            name: 'fakeMockName3',
            bid: 10000,
            releaseHeight: 54500,
        },
        {
            name: 'fakeMockName4',
            bid: 11222,
            releaseHeight: 54500,
        },
    ];

    return json(mockData);
};
