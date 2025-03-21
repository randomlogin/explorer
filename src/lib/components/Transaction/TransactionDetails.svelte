<script lang="ts">
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import TransactionSpaces from '$lib/components/Transaction/TransactionSpaces.svelte';
    import TruncatableText from '$lib/components/TruncatableText.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    import CopyButton from '$lib/components/CopyButton.svelte';
    import { formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/link.css';
    import { onMount } from 'svelte';
    
    export let transaction;
    export let showAllInputsOutputs = false;
    export let maxInputsOutputs = showAllInputsOutputs ? Infinity : 5;
    export let highlightedOutputIndex: number | null = null;

    onMount(() => {
        // Check URL for output-index fragment
        const hash = window.location.hash;
        if (hash && hash.startsWith('#output-')) {
            highlightedOutputIndex = parseInt(hash.substring(8));
            console.log("Highlighting output:", highlightedOutputIndex);
            
            // Scroll to highlighted element after a short delay
            setTimeout(() => {
                const element = document.getElementById(`output-${highlightedOutputIndex}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    });
</script>

{#if transaction.vmetaouts?.length > 0}
    <TransactionSpaces vmetaouts={transaction.vmetaouts} />
{/if}

<div class="transaction-io">
    <div class="io-section inputs">
        <h2 class="section-title">Inputs</h2>
        <div class="section-content">
            {#each transaction.inputs.slice(0, maxInputsOutputs) as input, index}
                <div class="item-wrapper">
                    <div class="item">
                        {#if input.coinbase}
                            <span class="coinbase-input">Coinbase input</span>
                        {:else}
                            <div class="input-details">
                                <div class="input-left">
                                    {#if input.sender_address}
                                        <div class="address">
                                            <span class="text">Address</span>
                                            <div class="truncate-wrapper">
                                                <div class="content-wrapper">
                                                    <AddressLink address={input.sender_address} truncate={true} />
                                                </div>
                                                <CopyButton value={input.sender_address} size={14} />
                                            </div>
                                        </div>
                                    {/if}
                                    <div class="transaction-status">
                                        <span class="label">Created in:</span>
                                        <div class="truncate-wrapper">
                                            <div class="content-wrapper">
                                                <TransactionLink txid={input.hash_prevout} truncate={true} />
                                            </div>
                                        </div>
                                    </div>
                                    {#if Array.isArray(input.txinwitness) && input.txinwitness.length > 0}
                                        <details class="witness-details">
                                            <summary class="witness-summary">Witness</summary>
                                            <div class="witness-content">
                                                {#each input.txinwitness as witness, i}
                                                    <div class="witness-item">
                                                        <span class="witness-index">#{i}</span>
                                                        <span class="witness-data">{witness}</span>
                                                    </div>
                                                {/each}
                                            </div>
                                        </details>
                                    {/if}
                                </div>
                                <div class="input-right">
                                    <span class="value">{formatBTC(input.prev_value)}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                {#if index < transaction.inputs.slice(0, maxInputsOutputs).length - 1}
                    <div class="separator"></div>
                {/if}
            {/each}
            {#if transaction.inputs.length > maxInputsOutputs}
                <div class="more-items">... other inputs omitted</div>
            {/if}
        </div>
    </div>

    <div class="io-section outputs">
        <h2 class="section-title">Outputs</h2>
        <div class="section-content">
            {#each transaction.outputs.slice(0, maxInputsOutputs) as output, index}
                <div 
                    class="item-wrapper {highlightedOutputIndex === index ? 'highlighted-output' : ''}"
                    id={`output-${index}`}
                >
                    <div class="output-item">
                        <div class="output-details">
                            <div class="output-left">
                                <div class="address">
                                    <span class="text">
                                        {output.address ? 'Address' : 'Scriptpubkey'}
                                    </span>
                                    <div class="truncate-wrapper">
                                        <div class="content-wrapper">
                                            {#if output.address}
                                                <AddressLink address={output.address} truncate={true} />
                                            {:else}
                                                <TruncatableText text={output.scriptpubkey} />
                                            {/if}
                                        </div>
                                        <CopyButton value={output.address || output.scriptpubkey} size={14} />
                                    </div>
                                </div>
                                <div class="transaction-status">
                                    {#if output.spender}
                                        <span class="label">Spent in:</span>
                                        <div class="truncate-wrapper">
                                            <div class="content-wrapper">
                                                <TransactionLink txid={output.spender.txid} truncate={true} />
                                            </div>
                                        </div>
                                    {:else}
                                        <span class="label">Unspent</span>
                                    {/if}
                                </div>
                            </div>
                            <div class="output-right">
                                <span class="value">{formatBTC(output.value)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {#if index < transaction.outputs.slice(0, maxInputsOutputs).length - 1}
                    <div class="separator"></div>
                {/if}
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Highlight styles */
    .highlighted-output {
        background-color: var(--bg-highlight); /* Light yellow/orange background */
        padding: var(--space-2);
        border-radius: var(--border-radius-md);
        border-left: 4px solid var(--color-primary);
        margin-bottom: var(--space-2);
    }
    
    
    .output-index {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
    }
    
    .index-label {
        color: var(--text-muted);
    }
    
    .index-value {
        font-family: var(--font-mono, monospace);
        color: var(--color-primary);
        font-weight: 600;
    }

    /* Existing styles */
    .transaction-io {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-2);
        width: 100%;
    }

    .io-section {
        min-width: 0;
    }

    .section-title {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
        padding-bottom: var(--space-2);
        border-bottom: var(--border-width-1) solid var(--text-muted);
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .item-wrapper {
        margin-bottom: 0;
    }

    .item,
    .output-item {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .input-details,
    .output-details {
        display: flex;
        justify-content: space-between;
        gap: var(--space-2);
        width: 100%;
        min-width: 0;
        align-items: baseline;
    }

    .input-left,
    .output-left {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
        flex: 1;
    }

    .input-right,
    .output-right {
        flex-shrink: 0;
    }

    .address,
    .transaction-status {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: var(--space-2);
        align-items: baseline;
        min-width: 0;
    }

    .label {
        white-space: nowrap;
        color: var(--text-muted);
        font-size: var(--text-base);
    }

    .truncate-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
    }

    .content-wrapper {
        flex: 1;
        min-width: 0;
        margin-right: var(--space-2);
    }

    .content-wrapper :global(.link-container) {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        font-size: var(--text-base);
    }

    .value {
        color: var(--color-primary);
        font-weight: 600;
        white-space: nowrap;
    }

    .separator {
        height: 1px;
        background-color: var(--border-color);
        margin: var(--space-1) 0;
    }

    .more-items {
        color: var(--text-muted);
        font-style: italic;
    }

    .witness-details {
        margin-top: var(--space-2);
        font-size: var(--text-sm);
    }

    .witness-summary {
        cursor: pointer;
        padding: var(--space-2);
        color: var(--text-muted);
        background: var(--bg-primary);
        border-radius: var(--border-radius);
    }

    .witness-content {
        margin-top: var(--space-2);
        padding: var(--space-2);
        background: var(--bg-primary);
        border-radius: var(--border-radius);
        overflow-x: auto;
    }

    .witness-item {
        display: flex;
        gap: var(--space-2);
        padding: var(--space-2) 0;
    }

    .witness-index {
        color: var(--text-muted);
        flex-shrink: 0;
    }

    .witness-data {
        font-family: var(--font-mono);
        word-break: break-all;
        font-size: var(--text-sm);
    }

    @media (max-width: 768px) {
        .transaction-io {
            grid-template-columns: 1fr;
            gap: var(--space-2);
        }

        .input-details,
        .output-details {
            flex-direction: column;
            gap: var(--space-2);
        }

        .address,
        .transaction-status {
            grid-template-columns: auto minmax(0, 1fr);
        }

        .truncate-wrapper {
            width: 100%;
        }

        .content-wrapper {
            flex: 1;
            min-width: 0;
        }

        .value {
            margin-top: var(--space-2);
        }

        .witness-content {
            max-width: 100%;
        }
    }
</style>
