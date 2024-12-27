<script lang="ts">
export let height: number;

const href = height === -1 ? '/mempool' : `/block/${height}`;
</script>

<a {href} class="block-link">
  <span>{height === -1 ? 'Mempool' : `Block #${height}`}</span>
</a>

<style>
  .block-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-colors);
  }
  .block-link:hover {
    text-decoration: underline;
  }
</style>
