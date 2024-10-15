<script lang="ts">
    export let txid: string;
    export let truncate: boolean = false;
    export let maxLength: number = 20;
    export let outputIndex: number | null = null;

    $: displayTxid = truncate ? `${txid.slice(0, maxLength)}...` : txid;
    $: href = outputIndex !== null ? `/tx/${txid}#output-${outputIndex}` : `/tx/${txid}`;
</script>

<a {href} class="text-gray-500 hover:text-[#ec8e32]" title={txid}>
    {displayTxid}
</a>
