<script lang="ts">
    import AddressHeader from '$lib/components/AddressHeader.svelte';
    import BlockTxs from '$lib/components/BlockTxs.svelte';
    export let data;

    let currentPage = 1;
    let hasMore = data.hasMore;
    let nextCursor = data.nextCursor;
    let cursors: string[] = []; // Store cursors for each page
    let transactions = data.transactions;
    let totalPages = hasMore ? 2 : 1; // Initialize with at least 1 page

    async function handlePageChange(page: number) {
        if (page === currentPage) return;

        const cursor = page > currentPage 
            ? nextCursor 
            : cursors[page - 1];

        try {
            const response = await fetch(`/api/address/${data.address}?limit=25${cursor ? `&cursor=${cursor}` : ''}`);
            if (!response.ok) throw new Error('Failed to fetch transactions');
            
            const newData = await response.json();
            transactions = newData.transactions;
            hasMore = newData.hasMore;
            nextCursor = newData.nextCursor;
            
            // Store cursor for this page
            cursors[page] = nextCursor;
            
            currentPage = page;
            totalPages = hasMore ? page + 1 : page;
            
            // Scroll to top of transactions
            document.querySelector('.transactions-container')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching page:', error);
        }
    }

    $: pagination = {
        currentPage,
        totalPages,
        limit: 25,
        offset: (currentPage - 1) * 25
    };
</script>

<AddressHeader address={data.address} stats={data.stats}/>
<BlockTxs {transactions} {pagination} onPageChange={handlePageChange} />
