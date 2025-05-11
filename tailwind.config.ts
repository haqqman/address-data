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
      // Removed ShadCN specific theme extensions for colors, borderRadius, keyframes, and animation
      // NextUI handles this through its plugin and theme configuration below
    }
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF", // or DEFAULT
            foreground: "#11181C", // or DEFAULT
            primary: {
              DEFAULT: "#388E3C", // Green
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#E0E0E0", // Light Gray
              foreground: "#11181C", // Dark text for readability on light gray
            },
            danger: { // NextUI uses danger for destructive actions
              DEFAULT: "#FF0000", // Example, adjust if needed
              foreground: "#FFFFFF",
            },
            // Accent is often mapped to 'warning' or a custom color in NextUI
            // Using warning for orange as NextUI has predefined slots
            warning: {
              DEFAULT: "#FF5722", // Orange
              foreground: "#FFFFFF",
            }
          },
           layout: {
            radius: {
              small: "0.25rem", // 4px
              medium: "0.5rem", // 8px
              large: "0.75rem", // 12px
            },
            // other layout properties
          },
        },
        dark: {
          colors: {
            background: "#000000", // or DEFAULT
            foreground: "#ECEDEE", // or DEFAULT
            primary: {
              DEFAULT: "#388E3C",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#333333", // Darker Gray for dark mode
              foreground: "#ECEDEE",
            },
            danger: {
              DEFAULT: "#FF0000",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FF5722",
              foreground: "#FFFFFF",
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
    // require("tailwindcss-animate") // Removed
  ],
} satisfies Config;