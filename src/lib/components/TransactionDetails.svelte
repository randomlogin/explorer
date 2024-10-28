<script lang="ts">
    import TransactionLink from '$lib/components/TransactionLink.svelte';
 import AddressLink from '$lib/components/AddressLink.svelte';
    export let transaction;
    export let showAllInputsOutputs = false;
    export let maxInputsOutputs = showAllInputsOutputs ? Infinity : 5;
    import { formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/TransactionDetails.css';
</script>

<div class="transaction-io">
    <div class="io-section inputs">
        <h2 class="section-title">Inputs</h2>
        <div class="section-content">
            {#each transaction.inputs.slice(0, maxInputsOutputs) as input, index}
                <div class="item-wrapper">
                    <div class="item">
                        {#if input.coinbase}
                            <span class="text-gray-500">Coinbase input</span>
                        {:else}
                            <TransactionLink txid={input.hash_prevout} truncate={false} maxLength={30} />
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
                            <span class="output-address" title={output.address || output.scriptpubkey}>
                                {#if output.address}
                                    <AddressLink address={output.address} />
                                {:else}
                                    <span class="font-mono">Scriptpubkey: {output.scriptpubkey.slice(0, 20)}...</span>
                                {/if}
                            </span>
                            <div class="output-value-container">
                                <span class="output-value">{formatBTC(output.value)}</span>
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
                </div>
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>
