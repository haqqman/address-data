import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  	extend: {
      // ShadCN specific theme extensions were previously removed.
      // NextUI handles this through its plugin and theme configuration below.
    }
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF", 
            foreground: "#1F2937", // Darker gray for general text
            primary: {
              DEFAULT: "#0C213A", // New Primary: Dark Blue
              foreground: "#FFFFFF", // White text on dark blue
            },
            secondary: {
              DEFAULT: "#79C142", // New Secondary: Green
              foreground: "#FFFFFF", // White text on green
            },
            danger: { 
              DEFAULT: "#FF0000", 
              foreground: "#FFFFFF",
            },
            warning: { // Used for buttons/accent
              DEFAULT: "#FFCC33", // New Button/Accent: Yellow/Gold
              foreground: "#0C213A", // Dark blue text on yellow/gold for contrast
            }
          },
           layout: {
            radius: {
              small: "0.25rem", 
              medium: "0.5rem", 
              large: "0.75rem", 
            },
          },
        },
        dark: { // It's good practice to define dark mode, even if not primary focus yet
          colors: {
            background: "#111827", // Dark gray background
            foreground: "#E5E7EB", // Light gray text
            primary: {
              DEFAULT: "#0C213A", // Dark Blue
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#79C142", // Green
              foreground: "#FFFFFF", 
            },
            danger: {
              DEFAULT: "#EF4444", // Slightly softer red for dark mode
              foreground: "#FFFFFF",
            },
            warning: { // Accent/Button
              DEFAULT: "#FFCC33", // Yellow/Gold
              foreground: "#0C213A", // Dark blue text
            },
          },
           layout: {
            radius: {
              small: "0.25rem",
              medium: "0.5rem",
              large: "0.75rem",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
