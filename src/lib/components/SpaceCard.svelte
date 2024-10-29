<script lang="ts">
  import Countdown from "$lib/components/Countdown.svelte";
  import statusMeta from "$lib/statusMeta";
  import dayjs from "dayjs";
  import LocalizedFormat from "dayjs/plugin/localizedFormat";

  dayjs.extend(LocalizedFormat);

  export let space: {
    name: string;
    claimHeight: number;
    status: string;
    history: Array<{
      action: string;
      bid_amount: number;
      transaction: {
        block: {
          time: number;
        };
      };
    }>;
  };
  export let currentBlockHeight: number;

  const numberFormatter = new Intl.NumberFormat();
</script>

<a href={`/space/${space.name.slice(1)}`} class="space-card">
  <div class="space-card-container">
    <div class="space-card-content">
      <span title={space.name} class="space-name">{space.name}</span>
      
      {#if space.claimHeight > currentBlockHeight}
        <div class="countdown-container">
          Ends in:
          <div class="countdown-badge" style="background-color: {statusMeta[space.status].color}">
            <Countdown seconds={(space.claimHeight - currentBlockHeight) * 10 * 60} />
          </div>
        </div>
      {:else}
        <div class="awaiting-claim">
          <span class="awaiting-claim-badge">Awaiting claim</span>
          <span class="awaiting-claim-note">(still open for bidding)</span>
        </div>
      {/if}
      
      <div class="bid-info">
        Number of bids: 
        <span class="bid-value">{space.history.filter((x) => x.action == "bid").length}</span>
      </div>
      
      <div class="bid-info">
        Highest bid:
        <span class="bid-value">{numberFormatter.format(space.history.filter((x) => x.action == "bid").pop()?.bid_amount)}</span>
        <span class="sat-label">sat</span>
      </div>
    </div>

  </div>
</a>
<style>
@import '$lib/styles/variables.css';

.space-card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) 0;
  gap: var(--space-2);
  border-radius: var(--border-radius-3xl);
  border: var(--border-width-1) solid var(--color-primary);
  border-bottom-width: var(--border-width-8);
  width: 100%;
  max-width: 220px;
  cursor: pointer;
  background: var(--bg-primary-light);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.space-card-container:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}
</style>
