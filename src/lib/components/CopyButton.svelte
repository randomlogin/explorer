<!-- $lib/components/CopyButton.svelte -->
<script>
    import { fade } from 'svelte/transition';
    import { Check, Copy } from 'lucide-svelte';
    import { onDestroy } from 'svelte'
    
    export let value = '';
    export let size = 16;
    
    let copied = false;
    let timeoutId;
    
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(value);
            copied = true;
            
            if (timeoutId) clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                copied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
    
    onDestroy(() => {
        if (timeoutId) clearTimeout(timeoutId);
    });
</script>

<button
    class="copy-button"
    on:click={copyToClipboard}
    title="Copy to clipboard"
>
    <div class="copy-button__icon-container">
        {#if copied}
            <div class="copy-button__icon copy-button__icon--success" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <Check {size} />
            </div>
        {:else}
            <div class="copy-button__icon" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <Copy {size} />
            </div>
        {/if}
    </div>
</button>
<style>
/* $lib/styles/CopyButton.css */

.copy-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
    border: none;
    background: transparent;
    cursor: pointer;
}

.copy-button:hover {
    background-color: rgba(209, 213, 219, 0.5);
}

.copy-button:focus {
    outline: none;
}

.copy-button__icon-container {
    position: relative;
    display: grid;
    place-items: center;
}

.copy-button__icon-container > div {
    grid-area: 1 / 1;
}

.copy-button__icon {
    transition: opacity 0.2s ease;
}

.copy-button__icon--success {
    color: #f97316;
}
</style>
