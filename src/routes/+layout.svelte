<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import '$lib/styles/variables.css';

</script>

<Header />

<div class="container mx-auto pb-10">
  <slot />
</div>

<Footer />
