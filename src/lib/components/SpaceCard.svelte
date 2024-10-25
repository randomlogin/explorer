<script lang="ts">
  import Countdown from "$lib/components/Countdown.svelte";
  import statusMeta from "$lib/statusMeta";
  import dayjs from "dayjs";
  import LocalizedFormat from "dayjs/plugin/localizedFormat";
  import "$lib/styles//SpaceCard.css";  

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

    <div class="history-container">
      <div class="history-divider"></div>
      <div class="history-grid">
        {#each space.history.filter((x) => x.action == "bid") as bid}
          <span class="history-amount">{bid.bid_amount}</span>
          <span class="history-sat">SAT</span>
          <span class="history-time">
            {dayjs.unix(bid.transaction.block.time).format("MMM DD, HH:MM")}
          </span>
        {/each}
      </div>
    </div>
  </div>
</a>
