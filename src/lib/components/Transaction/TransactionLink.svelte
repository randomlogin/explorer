<script lang="ts">
    import '$lib/styles/link.css';
    
    export let txid: string;
    export let truncate: boolean = false;
    export let maxLength: number = 20;
    export let outputIndex: number | null = null;
    
    $: displayTxid = truncate ? `${txid.slice(0, maxLength)}...` : txid;
    $: href = outputIndex !== null ? `/tx/${txid}#output-${outputIndex}` : `/tx/${txid}`;
</script>

<a {href} class="mono-link" title={txid}>
    {displayTxid}
</a>
<style>
@import '$lib/styles/variables.css';
</style>
