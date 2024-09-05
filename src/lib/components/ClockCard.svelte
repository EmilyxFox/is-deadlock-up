<script lang="ts">
type ValidRegion = "sa" | "na" | "eu" | "oc" | "as";

interface TimeInfo {
	startTimeUTC: number;
}

interface RegionInfo {
	prettyName: string;
	weekday: TimeInfo;
	weekend: TimeInfo;
}

interface PlaytimeInfo {
	weekday: number;
	weekend: number;
}

const playtimeInfo: PlaytimeInfo = {
	weekday: 13,
	weekend: 17,
};

const regions: Record<ValidRegion, RegionInfo> = {
	sa: {
		prettyName: "South America",
		weekday: { startTimeUTC: 18 },
		weekend: { startTimeUTC: 14 },
	},
	na: {
		prettyName: "North America",
		weekday: { startTimeUTC: 20 },
		weekend: { startTimeUTC: 16 },
	},
	eu: {
		prettyName: "Europe",
		weekday: { startTimeUTC: 12 },
		weekend: { startTimeUTC: 8 },
	},
	oc: {
		prettyName: "Oceania",
		weekday: { startTimeUTC: 3 },
		weekend: { startTimeUTC: 23 },
	},
	as: {
		prettyName: "Asia",
		weekday: { startTimeUTC: 6 },
		weekend: { startTimeUTC: 2 },
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

function updateServerInfo(region: RegionInfo) {
	// Helper function to check if it's a weekend (Friday, Saturday, Sunday)
	const isWeekend = (day: number) => day === 5 || day === 6 || day === 0;

	// Get current date and time
	const now = new Date();
	const dayOfWeek = now.getUTCDay(); // Day of the week (0 = Sunday, 6 = Saturday)
	const currentHourUTC = now.getUTCHours(); // Current hour in UTC

	// Get region info
	const isCurrentDayWeekend = isWeekend(dayOfWeek);
	const { startTimeUTC } = isCurrentDayWeekend
		? region.weekend
		: region.weekday;
	const playtime = isCurrentDayWeekend
		? playtimeInfo.weekend
		: playtimeInfo.weekday;

	// Calculate start and end times in UTC
	const serverStartTimeUTC = new Date(now);
	serverStartTimeUTC.setUTCHours(startTimeUTC, 0, 0, 0); // Set the time to server start time

	// If server start time is in the past today, use the next day
	if (serverStartTimeUTC.getTime() < now.getTime()) {
		serverStartTimeUTC.setUTCDate(serverStartTimeUTC.getUTCDate() + 1);
	}

	const serverEndTimeUTC = new Date(serverStartTimeUTC);
	serverEndTimeUTC.setUTCHours(serverEndTimeUTC.getUTCHours() + playtime); // Add the playtime duration

	// Convert start and end times to the user's local time
	const serverStartTimeLocal = new Date(serverStartTimeUTC.getTime());
	const serverEndTimeLocal = new Date(serverEndTimeUTC.getTime());

	// Format start and end times for display
	startTimeString = serverStartTimeLocal.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
	endTimeString = serverEndTimeLocal.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});

	// Determine if the server is currently open
	isOpen =
		currentHourUTC >= startTimeUTC && currentHourUTC < startTimeUTC + playtime;

	// Calculate countdown until next event (either opening or closing)
	countdownString = "";
	if (!isOpen) {
		// Time remaining until the server closes
		const countdownTime = serverStartTimeUTC.getTime() - now.getTime();

		// Calculate hours and minutes remaining
		const hours = Math.floor(countdownTime / (1000 * 60 * 60));
		const minutes = Math.floor(
			(countdownTime % (1000 * 60 * 60)) / (1000 * 60),
		);
		const seconds = Math.floor((countdownTime % (1000 * 60)) / 1000);

		if (hours > 0) {
			countdownString += `${hours}h`;
		}
		if (minutes > 0) {
			countdownString += `${minutes}m`;
		}
		if (hours !== 0 && minutes !== 0 && seconds !== 0) {
			countdownString += `${seconds}s`;
		}
	}
}

const updateUI = () => {
	updateServerInfo(region);
};

// Initialize UI and start interval
updateUI();
setInterval(updateUI, 1000);
</script>
    
    <div class="flex flex-col w-full mb-8 rounded-md lg:w-1/6 bg-cardBackground">
        <h2 class="my-4 text-4xl font-bold text-center">{region.prettyName}</h2>
        <div class="flex flex-row justify-around">
            <h3 class="text-xl text-center">Start</h3>
            <h3 class="text-xl text-center">End</h3>
        </div>
        <div class="flex flex-row justify-around">
            <p class="text-xl text-center">{startTimeString}</p>
            <p class="text-xl text-center">{endTimeString}</p>
        </div>
        <div class="h-4 my-4">
            <p class="text-xl text-center">{countdownString}</p>
        </div>
        <div class="py-1 bg-cardHighlight rounded-b-md">
            <p class="text-xl text-center" class:text-confirm={isOpen} class:text-deny={!isOpen}>{isOpen ? "Open" : "Closed"}</p>
        </div>
    </div>
    