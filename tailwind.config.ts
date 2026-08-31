import type { Config } from "tailwindcss";

// Brand tokens — reused verbatim from Module 2 Day 2 so the two days read as
// one product family. Do not restyle these; only the `risk` group below is new
// for Day 3 (the three-category "categorize the risk" mechanic).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#231A45",
        purple: "#5624D0",
        lilac: "#EEE9F9",
        ink: "#1B1230",
        ash: "#6B6484",
        paper: "#FFFFFF",
        line: "#D9D3EA",
        good: "#2F9E5A",
        warn: "#C0721D",
        danger: "#B33A3A",
        // Risk-area tags — three categories only (Day 2 used five). Neutral in
        // feel, not good/bad: a clue belongs somewhere, it is not right/wrong.
        risk: {
          source: "#6E8DC1", // Source — procurement / replacement
          cycle: "#B389D6", // Cycle — use / operations
          control: "#F1B24A", // Control — data / transparency / disposal
        },
      },
      fontFamily: {
        sans: ["Calibri", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px", fontWeight: "600" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["13px", { lineHeight: "18px" }],
        readout: ["18px", { lineHeight: "24px", fontWeight: "600" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(35,26,69,0.06)",
        lg: "0 12px 32px rgba(35,26,69,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
