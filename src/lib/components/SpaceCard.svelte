<script lang="ts">
  import Countdown from "$lib/components/Countdown.svelte";
  import dayjs from "dayjs";
  import LocalizedFormat from "dayjs/plugin/localizedFormat";
  import { formatBTC } from "$lib/utils/formatters";
  dayjs.extend(LocalizedFormat);

  export let space;
  export let currentBlockHeight: number;
</script>

<a href={`/space/${space.name}`} class="space-card">
  <div class="space-card-container">
    <div class="space-card-content">
      <span title={space.name} class="space-name">{space.name}</span>

      {#if space.claim_height > currentBlockHeight}
        <div class="countdown-container">
          <span class="countdown-label">Claim in:</span>
          <div class="countdown-badge">
            <Countdown seconds={(space.claim_height - currentBlockHeight) * 10 * 60} />
          </div>
        </div>
      {:else}
        <div class="awaiting-claim">
          <span class="awaiting-claim-badge">Can be claimed</span>
          <span class="awaiting-claim-note">(open for bidding)</span>
        </div>
      {/if}

      <div class="bid-stats">
        <div class="bid-info">
          <span class="bid-label">Bids:</span>
          <span class="bid-value">{space.bid_count}</span>
        </div>
      </div>
      <div class="bid-info">
        <span class="bid-label">Highest bid:</span>
        <span class="bid-value"> {formatBTC(space.total_burned)} </span>
      </div>
    </div>
  </div>
</a>

<style>
  .space-card {
    text-decoration: none;
    color: inherit;
    width: 100%;
    display: block;
  }

  .space-card-container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--space-6);
    gap: var(--space-3);
    border-radius: var(--border-radius-3xl);
    border: var(--border-width-1) solid var(--color-primary);
    border-bottom-width: var(--border-width-8);
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: var(--bg-primary-light);
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .space-card-container:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .space-card-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .space-name {
    font-weight: 600;
    font-size: var(--font-size-lg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .countdown-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .countdown-label {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .countdown-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--border-radius-lg);
    font-weight: 500;
    color: var(--color-white);
  }

  .awaiting-claim {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .awaiting-claim-badge {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-warning);
    color: var(--color-white);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--border-radius-lg);
    font-weight: 500;
  }

  .awaiting-claim-note {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .bid-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    border-top: var(--border-width-1) solid var(--border-color);
  }

  .bid-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .bid-label {
    color: var(--text-muted);
  }

  .bid-value {
    font-weight: 500;
  }

  .sat-label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-left: var(--space-1);
  }

  @media (max-width: 640px) {
    .space-card-container {
      padding: var(--space-4);
    }
  }
</style>
