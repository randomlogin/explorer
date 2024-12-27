<script lang="ts">
  import { page } from "$app/stores";
  import { menuLinks } from "$lib/links";
  export let isOpen = false;
</script>

<nav class="fixed top-0 left-0 w-screen h-screen z-[500] flex transition-transform ease-in-out {isOpen ? 'translate-x-0' : 'translate-x-full'}">
  <div class="w-[20%] bg-black bg-opacity-30 h-full"></div>
  <ul class="w-[80%] bg-[#b0661d] flex flex-col gap-10 pt-20">
    {#each menuLinks as { href, label, external }}
      <li class="text-center">
        <a
          on:click={() => isOpen = false}
          {href}
          class="!text-lg btn {$page.url.pathname === href ? 'light:bg-primary light:border-primary bg-[#25292e] border-[#25292e]' : 'btn-ghost'} btn-sm"
          target={external ? "_blank" : undefined}
        >
          {label}
        </a>
      </li>
    {/each}
    <!--
    <li class="mt-20 !text-lg">
      <ThemeToggle showName={true} />
    </li>
    -->
  </ul>
</nav>
