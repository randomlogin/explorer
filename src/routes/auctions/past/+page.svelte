<script lang="ts">
    import SpacesList from "$lib/components/Spaces/SpacesList.svelte";
    import '$lib/styles/mainpage.css';
    
    export let data;
    console.log('qqq')
    let currentBlockHeight = data.stats?.latest_block_height ??  undefined;
    
</script>

<SpacesList fetchUrl="/api/auctions/past" currentBlockHeight={currentBlockHeight} />

