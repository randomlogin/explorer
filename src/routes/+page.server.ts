import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch, locals, url }) => {

    let searchParams = new URLSearchParams(url.search);

    searchParams.set('status', 'auction');
    
    if (!searchParams.get('sort'))
        searchParams.set('sort', 'ending');


    const [spaces, stats] = await Promise.all([
        fetch(`/api/spaces?${searchParams.toString()}`).then(x => x.json()),
        fetch('/api/stats').then(x => x.body ? x.json() : null)
    ]);
    return { spaces, stats };
};
