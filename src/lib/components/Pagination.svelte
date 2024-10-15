<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let currentPage; 
    export let tx_count;  
    export let txsPerPage; 

    const dispatch = createEventDispatcher();
    const totalPages = Math.ceil(tx_count / txsPerPage);

    function changePage(page) {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            dispatch('pageChange', page);
        }
    }

    function getPages(currentPage) {
        const visibleRange = 1;
        const start = Math.max(currentPage - visibleRange, 1);
        const end = Math.min(currentPage + visibleRange, totalPages);
        const pages: number[] = [];

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (start > 1) {
            if (start > 2) {
                pages.unshift(-1); 
            }
            pages.unshift(1);
        }
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push(-2); // Represents "..."
            }
            pages.push(totalPages); // Always show the last page
        }
        return pages;
    }

    $: pages = getPages(currentPage);
</script>

<div class="pagination">
    <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1} class:inactive={currentPage === 1}>Previous</button>

    {#each pages as page}
        {#if page < 0}
            <span class="ellipsis">&hellip;</span>
        {:else if currentPage === page}
            <button class="active" on:click={() => changePage(page)}>
                {page} <!-- Display actual page number -->
            </button>
        {:else}
            <button class="inactive" on:click={() => changePage(page)}>
                {page} <!-- Display actual page number -->
            </button>
        {/if}
    {/each}

    <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} class:inactive={currentPage === totalPages}>Next</button>
</div>

<style>
    .pagination {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .pagination button, .pagination span {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        background-color: #0b0d10;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .pagination button:hover:not(:disabled) {
        background-color: #ec8e32; /* Hover effect */
    }

    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination button.active {
        background-color: #ec8e32; /* Active page button */
    }

    .pagination button.inactive {
        background-color: gray; /* Inactive page button */
        color: white;
    }

    .pagination span.ellipsis {
        padding: 0.5rem 1rem;
        color: #999;
        cursor: default;
        background-color: transparent; /* Ellipsis styling */
    }
</style>


