<script>
import ClockCard from "$lib/components/ClockCard.svelte";
</script>


<h1 class="font-bold text-6xl pt-4 px-4 pb-10">Is Deadlock up?</h1>

<div class="flex justify-evenly">
    <ClockCard region="sa" />
    <ClockCard region="na" />
    <ClockCard region="eu" />
    <ClockCard region="as" />
    <ClockCard region="oc" />
</div>