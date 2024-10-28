import { error, type Actions, type ServerLoad } from '@sveltejs/kit';
export const load: ServerLoad = async ({ fetch, locals, params }) => {
    const spaceName = params.name;
    // const [space, blockStats] = await Promise.all([
    //     fetch(`/api/spaces/${spaceName}`).then(x => x.body ? x.json() : null),
    //     fetch('/api/blocks/stats').then(x => x.json())
    // ]);
    //
    const resp = await fetch(`/api/spaces/${spaceName}`)

    if (resp.status != 200)
        error(resp.status, { message: 'Space not found'});
    
    const space = await resp.json();
    console.log(space)

    return { space };
};
