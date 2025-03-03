<script lang="ts">
  import { goto } from "$app/navigation";
  import Spinner from "$lib/components/Spinner.svelte";
  import { onMount } from "svelte";
  import { blockStore } from '$lib/stores/blockStore';
  import { ROUTES } from '$lib/routes';

  let search = "";
  let timeout: any;
  let searching = false;
  let searchResults: any[] = [];
  let showSearchResults = false;
  let navigatingToSpacePage = false;
  let searchBar: HTMLElement;
  let highlightedResultIdx = -1;

  function handleSearch() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(getResults, 250);
  }

  async function getResults() {
    if (!search.length) return;

    searching = true;
    showSearchResults = false;
    highlightedResultIdx = -1;
    searchResults = await fetch(ROUTES.api.search(search)).then((x) => x.json());
    searching = false;
    if (!navigatingToSpacePage) {
      showSearchResults = true;
    }
  }

  function highlightResult(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      navigatingToSpacePage = false;
    }

    switch(event.key) {
      case 'ArrowDown':
        if (highlightedResultIdx < searchResults.length - 1) {
          highlightedResultIdx++;
        }
        break;
      case 'ArrowUp':
        if (highlightedResultIdx > 0) {
          highlightedResultIdx--;
        }
        break;
      case 'Enter':
        showSearchResults = false;
        if (highlightedResultIdx >= 0) {
          navigateToResult(searchResults[highlightedResultIdx]);
        } else if (search.length > 0 && search !== '@') {
          navigatingToSpacePage = true;
          showSearchResults = false;
          goto(`/space/${search}`).then(() => { search = ""; });
        }
        break;
    }
  }

  async function navigateToResult(result: any) {
    const { type, value } = result;
    let path = '';

    switch(type) {
      case "transaction":
        path = `/tx/${value.txid}`;
        break;
      case "block":
        const identifier = value.hash || value.height;
        await blockStore.fetchBlockData(identifier);
        path = `/block/${identifier}`;
        break;
      case "space":
        path = `/space/${value.name}`;
        break;
      /* case "address": */
      /*   path = `/address/${value.address}`; */
      /*   break; */
    }

    if (path) {
      await goto(path);
      search = "";
    }
  }

  function clearSearch() {
    search = '';
    showSearchResults = false;
  }

  onMount(() => {
    const handler = (e: MouseEvent) => {
      if (!searchBar.contains(e.target as Node) && showSearchResults) {
        showSearchResults = false;
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });
</script>

<label bind:this={searchBar} class="h-[40px] grow input input-bordered !outline-none flex items-center gap-2 relative" >
  <input on:keydown={highlightResult}
         on:focus={() => {
         navigatingToSpacePage = false;
         showSearchResults = searchResults.length > 0 && search.length > 0;
         }}
         bind:value={search}
         on:input={handleSearch}
         type="text"
         class="grow"
         placeholder="Search"
         />


         {#if !navigatingToSpacePage && (searching || showSearchResults)}
           <div 
             role="listbox"
             aria-label="Search results"
             class="text-sm text-gray-500 flex flex-col px-4 py-2 gap-1 bg-black light:bg-primary light:text-primary-content border border-primary w-full absolute top-[calc(100%+5px)] left-0"
             >
             {#if searching}
               <div class="flex p-1 py-2 items-center">
                 <Spinner size={2.5} />
               </div>
             {:else if showSearchResults && searchResults.length > 0}
               {#each searchResults as result, idx}
                 <button 
                   role="option"
                   aria-selected={highlightedResultIdx === idx}
                   tabindex={highlightedResultIdx === idx ? 0 : -1}
                   class="text-left p-1 hover:bg-gray-800 light:hover:bg-gray-500 light:hover:text-white {highlightedResultIdx == idx ? 'bg-gray-800 light:bg-gray-500' : ''}"
                   on:click={() => {
                   showSearchResults = false;
                   navigateToResult(result);
                   }}
                   on:keydown={(e) => {
                   if (e.key === 'Enter') {
                   showSearchResults = false;
                   navigateToResult(result);
                   }
                   }}
                   >
                   {#if result.type === "transaction"}
                     Transaction: {result.value.txid}
                   {:else if result.type === "block"}
                     {#if result.value.height == -2 }
                     Orphaned block: {result.value.hash}
                     {:else }
                     Block #{result.value.height}: {result.value.hash}
                     {/if}
                   {:else if result.type === "space"}
                     Space: {result.value.name}
                   {:else if result.type === "address"}
                     Address: {result.value.address}
                   {/if}
                 </button>
               {/each}
             {:else if showSearchResults}
               <div>No results</div>
             {/if}
           </div>
         {/if}
         {#if search.length}
           <button
             on:click={clearSearch}
             on:keydown={(e) => e.key === 'Enter' && clearSearch()}
             type="button"
             class="flex items-center justify-center hover:opacity-100 opacity-70"
             aria-label="Clear search"
             >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512"
               fill="currentColor"
               class="h-4 w-4"
               >
               <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
             </svg>
           </button>
         {/if}

         <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 16 16"
           fill="currentColor"
           class="h-4 w-4 opacity-70"
           aria-hidden="true"
           >
           <path
             fill-rule="evenodd"
             d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
             clip-rule="evenodd"
             />
         </svg>
</label>
