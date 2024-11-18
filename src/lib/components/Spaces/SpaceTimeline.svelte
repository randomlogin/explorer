<script lang="ts">
  import { formatDuration } from "$lib/utils/formatters";
  import type { SpaceTimelineEvent } from "$lib/types/timeline";
  import type { Vmetaout } from "$lib/types/space";

  export let vmetaout: Vmetaout;
  export let currentBlockHeight: number;
  
  $: timeline = computeTimeline(vmetaout, currentBlockHeight);
  /* $: console.log(timeline) */

  function computeTimeline(vmetaout: Vmetaout, currentHeight: number): SpaceTimelineEvent[] {
    const blockTimeInSeconds = 600; // 10 minutes per block
    const status = vmetaout?.action;
    const claimHeight = vmetaout?.claim_height;
    const expireHeight = vmetaout?.expire_height;

    return [
      {
        name: "Open",
        description: "Submit an open transaction to propose the space for auction",
        done: !['REVOKE'].includes(status),
        current: status === 'REVOKE'
      },
      {
        name: "Pre-auction",
        description: "Top 10 highest-bid spaces advance to auctions daily",
        done: status === 'BID' && claimHeight !== undefined || ['TRANSFER', 'ROLLOUT'].includes(status),
        current: status === 'RESERVE' || (status === 'BID' && !claimHeight)
      },
      {
        name: "Auction",
        description: claimHeight 
          ? currentBlockHeight > claimHeight 
            ? `Auction ended at <a href="/block/${claimHeight}" class="text-link">block #${claimHeight}</a>`
            : `Auction ends at block #${claimHeight}`
          : "Auction has ended",
        done: status === 'TRANSFER' || status === 'BID' || status === 'ROLLOUT' && (currentBlockHeight > claimHeight && claimHeight !== undefined),
        current: (status === 'BID' || status === 'ROLLOUT') && claimHeight !== undefined && (currentBlockHeight <  claimHeight ),
        estimatedTime: (status === 'BID' || status === 'ROLLOUT') && claimHeight !== undefined && (currentBlockHeight <  claimHeight )
          ? ((claimHeight - currentHeight) > 0 
              ? (claimHeight - currentHeight) * blockTimeInSeconds 
              : undefined) 
          : undefined
      },
      {
        name: "Awaiting claim",
        description: "Winner can claim the space, but the space can still be outbid",
        done: status === 'TRANSFER',
        current: (status === 'BID' || status === 'ROLLOUT') && claimHeight !== undefined && claimHeight <= currentHeight,
        elapsedTime: (status === 'BID' && claimHeight !== undefined && claimHeight <= currentHeight)
          ? (currentHeight - claimHeight) * blockTimeInSeconds
          : undefined
      },
      {
        name: "Registered",
        description: expireHeight 
          ? currentBlockHeight > expireHeight
            ? `Registration expired at <a href="/block/${expireHeight}" class="text-link">block #${expireHeight}</a>`
            : `Registration expires at block #${expireHeight}`
          : "Space is registered",
        done: status === 'TRANSFER',
        current: status === 'TRANSFER',
        estimatedTime: (expireHeight !== undefined && ['TRANSFER', 'ROLLOUT'].includes(status))
          ? (expireHeight - currentHeight) * blockTimeInSeconds 
          : undefined
      }
    ];
  }
</script>

<nav class="timeline-nav">
  <ol role="list" class="timeline-list">
    {#each timeline as event, idx}
      <li class="timeline-item {idx < timeline.length - 1 ? 'with-connector' : ''}">
        {#if idx < timeline.length - 1}
          <div
            class="timeline-connector"
            class:connector-done={event.done}
            class:connector-pending={!event.done}
          />
        {/if}

        <div class="timeline-content">
          <span class="timeline-indicator">
            <span 
              class="timeline-dot" 
              class:dot-done={event.done} 
              class:dot-current={event.current} 
              class:dot-pending={!event.done && !event.current}
            >
              {#if event.done}
                <svg class="checkmark" viewBox="0 0 20 20">
                  <path 
                    fill="currentColor" 
                    fill-rule="evenodd" 
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" 
                    clip-rule="evenodd"
                  />
                </svg>
              {:else}
                <span 
                  class="dot-inner" 
                  class:dot-inner-current={event.current}
                />
              {/if}
            </span>
          </span>

          <div class="timeline-text">
            <span class="timeline-title" class:title-current={event.current}>
              {event.name}
              {#if event.estimatedTime !== undefined && event.estimatedTime > 0}
                <span class="timeline-time">
                  (ends in {formatDuration(event.estimatedTime)})
                </span>
              {/if}
              {#if event.elapsedTime !== undefined}
                <span class="timeline-time">
                  ({formatDuration(event.elapsedTime)} ago)
                </span>
              {/if}
            </span>
            {#if event.description}
              <span class="timeline-description">
                {@html event.description}
              </span>
            {/if}
          </div>
        </div>
      </li>
    {/each}
  </ol>
</nav>

<style>
  .timeline-nav {
    background: var(--bg-secondary);
    padding: var(--space-6);
    border-radius: var(--border-radius-lg);
    border: var(--border-width-1) solid var(--border-color);
  }

  .timeline-list {
    overflow: hidden;
  }

  .timeline-item {
    position: relative;
  }

  .timeline-item.with-connector {
    padding-bottom: var(--space-10);
  }

  .timeline-connector {
    position: absolute;
    left: 0.9375rem;
    top: 2rem;
    bottom: 0;
    width: 0.125rem;
    margin-left: -0.0625rem;
  }

  .connector-done {
    background-color: var(--color-primary);
  }

  .connector-pending {
    background-color: var(--color-gray-600);
  }

  .timeline-content {
    position: relative;
    display: flex;
    gap: var(--space-4);
    min-height: 2rem;
  }

  .timeline-indicator {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .timeline-time {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-left: var(--space-2);
  }

  .timeline-dot {
    display: flex;
    height: 2rem;
    width: 2rem;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-3xl);
    background-color: var(--bg-secondary);
    transition: var(--transition-all);
  }

  .timeline-text {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .timeline-title {
    font-size: var(--text-sm);
    font-weight: 500;
    transition: var(--transition-colors);
    padding-top: 0.375rem;
  }

  .timeline-description {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-top: var(--space-2);
  }

  .text-link {
    color: var(--color-primary);
    text-decoration: none;
  }

  .text-link:hover {
    text-decoration: underline;
  }

  .dot-done {
    background-color: var(--color-primary);
    color: var(--bg-primary);
  }

  .dot-current {
    border: 0.125rem solid var(--color-primary);
  }

  .dot-pending {
    border: 0.125rem solid var(--color-gray-600);
  }

  .dot-inner {
    height: 0.625rem;
    width: 0.625rem;
    border-radius: var(--border-radius-3xl);
  }

  .dot-inner-current {
    background-color: var(--color-primary);
  }

  .checkmark {
    height: 1.25rem;
    width: 1.25rem;
  }

  .title-current {
    color: var(--color-primary);
  }

  .block-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-colors);
  }

  .block-link:hover {
    text-decoration: underline;
  }


</style>
