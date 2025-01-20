<script lang="ts">
    import '$lib/styles/link.css';
    export let text: string;

    $: truncatedText = text;
    export let minLength = 8;
    export let minEndLength = 6;
</script>


<span class="truncatable-text mono-link" title={text}>
    {truncatedText}
</span>

<style>
    .truncatable-text {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        font-family: monospace;
        font-size: var(--text-sm);
    }
</style>

