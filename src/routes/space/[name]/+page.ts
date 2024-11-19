import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
    const response = await fetch(`/api/space/${params.name}`);
    const data = await response.json();
    return data;
};
