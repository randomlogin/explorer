<script lang="ts">
export let height: number;
</script>

<a href={`/block/${height}`} class="block-link">
  <span>#{height}</span>
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
