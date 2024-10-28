<script lang="ts">
    import { onMount } from 'svelte';
    import { numberFormatter, calculateTimeRemaining, formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/Rollout.css';
    
    export let currentHeight: number;
    /* export let rollouts: Rollout[] = []; */
    let rollouts = []
    let loading = false;
    let error: string | null = null;
    
    async function fetchRollouts() {
        try {
            const response = await fetch('/api/actions/rollout');
            if (!response.ok) throw new Error('Failed to fetch rollouts');
            rollouts = await response.json();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load rollouts';
        } finally {
            loading = false;
        }
        console.log(rollouts)
        console.log(calculateTimeRemaining(rollouts[0].releaseHeight, 1233))
    }

    onMount(() => {
        fetchRollouts();
    });
</script>

<div class="rollouts-wrapper">
    <h2 class="rollouts-title">Upcoming Rollouts</h2>
    
    <div class="rollouts-container">
        {#if loading}
            <div class="rollouts-list">
                {#each Array(4) as _}
                    <div class="rollout-card skeleton-card">
                        <div class="skeleton-text-medium"></div>
                        <div class="skeleton-text-short"></div>
                        <div class="skeleton-text-short"></div>
                    </div>
                {/each}
            </div>
        {:else if error}
            <div class="error">{error}</div>
        {:else}
            <div class="rollouts-list">
                {#each rollouts as rollout}
                    <div class="rollout-card">
                        <a href="/spaces/{rollout.name}" class="space-name">
                            {rollout.name}
                        </a>
                        <div class="bid-amount">
                          Bid  {formatBTC(rollout.bid)}
                        </div>
                        <div class="time-remaining">
                          In  {calculateTimeRemaining(rollout.releaseHeight, currentHeight)}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

