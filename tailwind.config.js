/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Sentient"],
			},
			colors: {
				background: "#131313",
				primary: "#ffefd7",
				confirm: "#7dbd1e",
				deny: "#ff5757",
				cardBackground: "#343434",
				cardHighlight: "#57534d",
			},
		},
	},
	plugins: [],
};
