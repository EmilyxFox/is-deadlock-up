<script>
import ClockCard from "$lib/components/ClockCard.svelte";
</script>

<svelte:head>
    <title>Is Deadlock up?</title>
</svelte:head>



<div class="w-11/12 m-auto">
    <h1 class="font-bold text-6xl pt-4 px-4 pb-10">Is Deadlock up?</h1>
    <div class="flex flex-col lg:flex-row justify-between">
        <ClockCard region="sa" />
        <ClockCard region="na" />
        <ClockCard region="eu" />
        <ClockCard region="as" />
        <ClockCard region="oc" />
    </div>
</div>