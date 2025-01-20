<script lang="ts">
    import '$lib/styles/link.css';
    import TruncatableText from '$lib/components/TruncatableText.svelte';
    
    export let txid: string;
    export let truncate = false;
    export let minLength = 8;
    export let outputIndex: number | null = null;
    
    $: href = outputIndex !== null ? `/tx/${txid}#output-${outputIndex}` : `/tx/${txid}`;
</script>

<a {href} class="link-container mono-link" title={txid}>
    {#if truncate}
        <TruncatableText text={txid} {minLength} />
    {:else}
        {txid}
    {/if}
</a>

<style>
    .link-container {
        font-family: var(--font-mono);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        vertical-align: middle;
    }
</style>
