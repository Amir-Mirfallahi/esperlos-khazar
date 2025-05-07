
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0057A0',
					light: '#006FCC',
					dark: '#004480',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#FFC20E',
					light: '#FFD44E',
					dark: '#DFA400',
					foreground: '#333333'
				},
				accent: {
					DEFAULT: '#FF6F00',
					light: '#FF9033',
					dark: '#D65C00',
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#4CAF50',
					light: '#6FBF73',
					dark: '#3B8C3F',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#E53935',
					light: '#EF5350',
					dark: '#C62828',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F5F5',
					foreground: '#333333'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			fontFamily: {
				vazir: ['Vazirmatn', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"slide-in-right": {
					from: { transform: "translateX(20px)", opacity: "0" },
					to: { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-left": {
					from: { transform: "translateX(-20px)", opacity: "0" },
					to: { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-bottom": {
					from: { transform: "translateY(20px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.4s ease-out",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"slide-in-left": "slide-in-left 0.5s ease-out",
				"slide-in-bottom": "slide-in-bottom 0.5s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
