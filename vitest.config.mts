import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.ts",
    include: ["features/**/__tests__/**/*.test.tsx"], // or `.spec.ts` if that’s your naming convention
    exclude: ["tests/**", "node_modules", "dist"],
  },
});
