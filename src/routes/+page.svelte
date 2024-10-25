<script lang="ts">
  import SpaceCard from "$lib/components/SpaceCard.svelte";  // Adjust the import path as needed
  import SortSelector from "$lib/components/SortSelector.svelte";
  import { goto } from '$app/navigation';
  import { navigating } from '$app/stores';
  
  export let data;
  
  /* let currentBlockHeight = data.blockStats?.height; */
  let currentBlockHeight = 15006
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

<div class="flex flex-col justify-center">
  <div class="w-full flex flex-col md:flex-row justify-between items-center md:pr-4 mt-5 mb-10 md:mb-16 gap-8 md:gap-0">
    <div class="hidden md:block md:w-1/3"></div>
    <h1 class="w-full md:w-1/3 text-center text-3xl font-semibold">Spaces in Auction</h1>
    <div class='w-[220px] md:w-[160px] mx-auto md:ml-auto md:mr-0 md:w-1/3 flex justify-center md:justify-end'>
      <SortSelector on:change={onSortChange} options={sortOptions} />
    </div>
  </div>
  <div class="grid gap-5" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
    {#if $navigating}
      <div class='w-full text-center'>Loading...</div>
    {:else}
      {#each data.spaces as space}
        <SpaceCard {space} {currentBlockHeight} />
      {/each}
    {/if}
  </div>
</div>
