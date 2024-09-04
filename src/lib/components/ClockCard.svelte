<script lang="ts">
type ValidRegion = "sa" | "na" | "eu" | "oc" | "as";

interface TimeInfo {
	startTimeUTC: number;
	endTimeUTC: number;
}

interface RegionInfo {
	prettyName: string;
	weekday: TimeInfo;
	weekend: TimeInfo;
}

const regions: Record<ValidRegion, RegionInfo> = {
	sa: {
		prettyName: "South America",
		weekday: { startTimeUTC: 18, endTimeUTC: 7 },
		weekend: { startTimeUTC: 16, endTimeUTC: 5 },
	},
	na: {
		prettyName: "North America",
		weekday: { startTimeUTC: 20, endTimeUTC: 9 },
		weekend: { startTimeUTC: 18, endTimeUTC: 7 },
	},
	eu: {
		prettyName: "Europe",
		weekday: { startTimeUTC: 12, endTimeUTC: 1 },
		weekend: { startTimeUTC: 10, endTimeUTC: 23 },
	},
	oc: {
		prettyName: "Oceania",
		weekday: { startTimeUTC: 3, endTimeUTC: 16 },
		weekend: { startTimeUTC: 2, endTimeUTC: 14 },
	},
	as: {
		prettyName: "Asia",
		weekday: { startTimeUTC: 6, endTimeUTC: 20 },
		weekend: { startTimeUTC: 5, endTimeUTC: 19 },
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

// Reactive variables for the UI
let isOpen: boolean = $state(false);
let countdownString: string = $state("");
let startTimeString: string = $state("");
let endTimeString: string = $state("");

const calculateOpen = (region: RegionInfo) => {
	const now = new Date();
	const currentTime = now.getTime();
	const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 6 = Saturday

	const timeInfo =
		dayOfWeek === 0 || dayOfWeek === 6 ? region.weekend : region.weekday;

	const openingTime = new Date();
	openingTime.setUTCHours(timeInfo.startTimeUTC, 0, 0, 0);
	const closingTime = new Date();
	closingTime.setUTCHours(timeInfo.endTimeUTC, 0, 0, 0);

	if (closingTime.getTime() <= openingTime.getTime()) {
		closingTime.setUTCDate(closingTime.getUTCDate() + 1);
	}

	if (
		currentTime >= openingTime.getTime() &&
		currentTime < closingTime.getTime()
	) {
		isOpen = true;
		countdownString = ""; // Clear the countdown string when the shop is open
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

		countdownString = `${hours}h ${minutes}m ${seconds}s`;
	}

	startTimeString = openingTime.toLocaleTimeString("en-GB", {
		timeStyle: "short",
	});
	endTimeString = closingTime.toLocaleTimeString("en-GB", {
		timeStyle: "short",
	});
};

const updateUI = () => {
	calculateOpen(region);
};

// Initialize UI and start interval
updateUI();
setInterval(updateUI, 1000);
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
    