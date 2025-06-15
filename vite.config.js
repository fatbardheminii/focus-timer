import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    reporters: ["dot"], // Minimal output, shows failures clearly
    outputFile: {
      json: "./test-results.json", // Optional: Save results for reference
    },
    silent: false, // Ensure errors are shown
  },
});
