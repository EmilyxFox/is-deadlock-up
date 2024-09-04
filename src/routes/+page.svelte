<script>
import ClockCard from "$lib/components/ClockCard.svelte";
import deadclock from "$lib/images/deadclock.webp";
</script>

<svelte:head>
    <title>Is Deadlock up?</title>
</svelte:head>



<div class="w-11/12 m-auto">
    <!-- <h1 class="font-bold text-6xl pt-4 px-4 pb-10">Is Deadlock up?</h1> -->
    <header class="pl-2 mt-4 mb-8">
        <img src={deadclock} alt="Deadclock Logo">
    </header>
    <div class="flex flex-col lg:flex-row justify-between">
        <ClockCard region="na" />
        <ClockCard region="sa" />
        <ClockCard region="eu" />
        <ClockCard region="as" />
        <ClockCard region="oc" />
    </div>
</div>