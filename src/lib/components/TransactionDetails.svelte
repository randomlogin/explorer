<script lang="ts">
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    export let transaction;
    export let showAllInputsOutputs = false;
    export let maxInputsOutputs = showAllInputsOutputs ? Infinity : 5;
    import { formatBTC } from '$lib/utils/formatters';
</script>
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
                                            Address <AddressLink address={input.sender_address} truncate={false}  />
                                        </div>
                                    {/if}
                                    <div class="transaction">
                                       Tx <TransactionLink txid={input.hash_prevout} truncate={false} maxLength={30} />
                                    </div>
                                </div>
                                <div class="input-right">
                                    <span class="value">{formatBTC(input.prev_value)}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                    {#if index < transaction.inputs.slice(0, maxInputsOutputs).length - 1}
                        <div class="separator"></div>
                    {/if}
                </div>
            {/each}
            {#if transaction.inputs.length > maxInputsOutputs}
                <div class="more-items">... other inputs omitted </div>
            {/if}
        </div>
    </div>

    <div class="io-section outputs">
        <h2 class="section-title">Outputs</h2>
        <div class="section-content">
            {#each transaction.outputs.slice(0, maxInputsOutputs) as output, index}
                <div class="item-wrapper">
                    <div class="output-item">
                        <div class="output-details">
                            <div class="output-left">
                                <div class="address">
                                    {#if output.address}
                                        Address <AddressLink address={output.address} />
                                    {:else}
                                        <span class="font-mono">Scriptpubkey: {output.scriptpubkey.slice(0, 20)}...</span>
                                    {/if}
                                </div>
                                    <div class="transaction">
                                {#if output.spender}
                                        Spent in: <TransactionLink txid={output.spender.txid} truncate={false} maxLength={30} />
                                {:else}
                                    Unspent
                                {/if}
                                    </div>
                            </div>
                            <div class="output-right">
                                <span class="value">{formatBTC(output.value)}</span>
                            </div>
                        </div>
                        {#if output.space_action}
                            <div class="space-action">
                                <div class="space-action-details">
                                    <span>Spaces action: </span>
                                    {output.space_action.type} <a href="/space/{output.space_action.name}" class="space-action-name">{output.space_action.name}</a>
                                </div>
                                {#if output.space_action.value || output.space_action.address}
                                    <div class="space-action-additional">
                                        {#if output.space_action.value}
                                            <span>Value: {formatBTC(output.space_action.value)}</span>
                                        {/if}
                                        {#if output.space_action.address}
                                            <span>To: <AddressLink address={output.space_action.address} /></span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    {#if index < transaction.outputs.slice(0, maxInputsOutputs).length - 1}
                        <div class="separator"></div>
                    {/if}
                </div>
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>
<style>
@import '$lib/styles/variables.css';


.section-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width-1) solid var(--text-muted);
}

.section-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.item, .output-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.output-item {
    display: flex;
    flex-direction: column;
}

.output-details {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
}

.separator {
    display: none;
}

.transaction-io {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
    margin-top: var(--space-10);
}

.io-section {
    flex: 1;
}


.more-items {
    color: var(--text-muted);
    margin-top: var(--space-2);
}

.item-wrapper {
    margin-bottom: var(--space-4);
}

.item-wrapper:last-child {
    margin-bottom: 0;
}

@media (max-width: 768px) {
    .transaction-io {
        grid-template-columns: 1fr;
    }
}
/* Replace `text-gray-500` in the template */
.coinbase-input {
    color: var(--text-muted);
}

/* Space action styles need dark theme support */
.space-action {
    font-size: 0.875rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: var(--space-action-bg);
    color: var(--space-action-text);
    padding: 0.5rem;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
}

.space-action-name {
    font-weight: 500;
    color: var(--space-action-text);
    text-decoration: none;
}

.space-action-details {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.25rem;
}


.space-action-additional {
    margin-top: 0.25rem;
}

.space-action-name:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
}

.input-details,
.output-details {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: var(--space-4);
}

.input-left,
.output-left {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    flex: 1;
    min-width: 0;
}
.address,
.transaction {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
}

.address {
    font-size: var(--text-base);
}

.transaction {
    font-size: var(--text-sm);
    color: var(--text-muted);
}

/* Add these new styles to handle the link text overflow */
:global(.address a),
:global(.transaction a) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}


</style>
