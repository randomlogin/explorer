<script lang="ts">
    import dayjs from 'dayjs';
    import Block from '$lib/components/Block.svelte';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);

    const numberFormatter = new Intl.NumberFormat();
    export let data;
</script>

<Block {data}/>
