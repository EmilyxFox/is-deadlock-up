<script lang="ts">
type ValidRegion = "sa" | "na" | "eu" | "oc" | "as";
interface RegionInfo {
	prettyName: string;
	startTimeUTC: number;
	endTimeUTC: number;
}
const regions: Record<ValidRegion, RegionInfo> = {
	sa: {
		prettyName: "South America",
		startTimeUTC: 18,
		endTimeUTC: 7,
	},
	na: {
		prettyName: "North America",
		startTimeUTC: 20,
		endTimeUTC: 9,
	},
	eu: {
		prettyName: "Europe",
		startTimeUTC: 12,
		endTimeUTC: 1,
	},
	oc: {
		prettyName: "Oceania",
		startTimeUTC: 3,
		endTimeUTC: 16,
	},
	as: {
		prettyName: "Asia",
		startTimeUTC: 6,
		endTimeUTC: 20,
	},
};

interface Props {
	region: ValidRegion;
}

const { region: propRegion }: Props = $props();

const region = regions[propRegion];
if (!region) {
	console.error("No such region: ", region);
}

const startTime = new Date();
startTime.setUTCHours(region.startTimeUTC, 0, 0, 0);
const endTime = new Date();
endTime.setUTCHours(region.endTimeUTC, 0, 0, 0);
const startTimeString = startTime.toLocaleTimeString("en-GB", {
	timeStyle: "short",
});
const endTimeString = endTime.toLocaleTimeString("en-GB", {
	timeStyle: "short",
});

let isOpen: boolean = $state(false);
let countdownString: string = $state("");

const calculateOpen = (region: RegionInfo) => {
	const now = new Date();
	const currentTime = now.getTime();

	const openingTime = new Date();
	openingTime.setUTCHours(region.startTimeUTC, 0, 0, 0);
	const closingTime = new Date();
	closingTime.setUTCHours(region.endTimeUTC, 0, 0, 0);

	if (closingTime.getTime() <= openingTime.getTime()) {
		closingTime.setUTCDate(closingTime.getUTCDate() + 1);
	}

	if (
		currentTime >= openingTime.getTime() &&
		currentTime < closingTime.getTime()
	) {
		isOpen = true;
	} else {
		isOpen = false;
		let nextOpeningTime: Date;
		if (currentTime < openingTime.getTime()) {
			nextOpeningTime = openingTime;
		} else {
			nextOpeningTime = new Date(openingTime);
			nextOpeningTime.setUTCDate(openingTime.getUTCDate() + 1);
		}

		const timeUntilOpen = nextOpeningTime.getTime() - currentTime;

		const hours = Math.floor(timeUntilOpen / (1000 * 60 * 60));
		const minutes = Math.floor(
			(timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60),
		);
		const seconds = Math.floor((timeUntilOpen % (1000 * 60)) / 1000);

		countdownString = "";
		if (hours > 0) {
			countdownString += `${hours}h`;
		}
		if (minutes > 0) {
			countdownString += `${minutes}m`;
		}
		countdownString += `${seconds}s`;
	}
};

calculateOpen(region);
setInterval(() => {
	calculateOpen(region);
}, 1000);
</script>


<div class="flex flex-col w-full lg:w-1/6 bg-cardBackground rounded-md mb-8">
    <h2 class="text-4xl font-bold text-center my-4">{region.prettyName}</h2>
    <div class="flex flex-row justify-around">
        <h3 class="text-center text-xl">Start</h3>
        <h3 class="text-center text-xl">End</h3>
    </div>
    <div class="flex flex-row justify-around">
        <p class="text-center text-xl">{startTimeString}</p>
        <p class="text-center text-xl">{endTimeString}</p>
    </div>
    <div class="h-4 my-4">
        <p class="text-center text-xl">{countdownString}</p>
    </div>
    <div class="bg-cardHighlight rounded-b-md py-1">
        <p class="text-center text-xl" class:text-confirm={isOpen} class:text-deny={!isOpen}>{isOpen ? "Open" : "Closed"}</p>
    </div>
</div>