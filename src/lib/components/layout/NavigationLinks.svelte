<script lang="ts">
  import { page } from "$app/stores";

  const links = [
    { href: "/", label: "Current Auctions" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/past", label: "Past" },
    { href: "https://spacesprotocol.org", label: "Help", external: true }
  ];
</script>

<div class="md:flex hidden">
  {#each links as { href, label, external }}
    <a
      {href}
      class="btn {$page.url.pathname === href ? 'btn-primary' : 'btn-ghost'} btn-sm"
      target={external ? "_blank" : undefined}
    >
      {label}
    </a>
  {/each}
</div>

