<script lang="ts">
    import SpaceCard from "$lib/components/SpaceCard.svelte";
    import SortSelector from "$lib/components/SortSelector.svelte";
    import RecentActions from "$lib/components/RecentActions.svelte";
    import Rollout from '$lib/components/Rollout.svelte';
    import Stats from '$lib/components/Stats.svelte';
    import { goto } from '$app/navigation';
    import { navigating } from '$app/stores';
    import '$lib/styles/mainpage.css';
    
    export let data;
    let currentBlockHeight = 50006;
    let sortOptions = [
        { name: "Ending soonest", key: "ending", direction: "asc" }, 
        { name: "Highest price", key: "price", direction: "desc" }, 
        { name: "Lowest price", key: "price", direction: "asc" }, 
    ];
    function onSortChange(sortBy: any) {
        const { key, direction } = sortBy.detail;
        let query = new URLSearchParams();
        query.set('sort', key);
        query.set('direction', direction);
        goto(`?${query.toString()}`);
    }
</script>

<Stats />
<div class="layout-container">
    <div class="recent-actions">
        <RecentActions />
    </div>

    <div class="rollouts-section">
        <Rollout currentHeight={currentBlockHeight} />
    </div>

    <div class="auctions-section">
        <div class="header">
            <h1 class="text-3xl font-semibold">Spaces in Auction</h1>
            <div class="w-[160px]">
                <SortSelector on:change={onSortChange} options={sortOptions} />
            </div>
        </div>

        <div class="grid-container">
            {#if $navigating}
                <div class="w-full text-center">Loading...</div>
            {:else}
            {/if}
        </div>
    </div>
</div>
