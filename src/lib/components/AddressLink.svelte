<script lang="ts">
    import '$lib/styles/link.css';
    
    export let address: string;
    export let truncate = false;
    export let maxLength: number | undefined = undefined;

    $: displayAddress = truncate 
        ? `${address.slice(0, 8)}...${address.slice(-8)}`
        : maxLength && address.length > maxLength 
            ? `${address.slice(0, maxLength)}...` 
            : address;
</script>

<a href="/address/{address}" class="mono-link" title={truncate || maxLength ? address : undefined} >
    {displayAddress}
</a>
