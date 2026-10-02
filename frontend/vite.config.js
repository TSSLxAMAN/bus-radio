import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, forward /ws and /api to the Python server so the browser sees one origin.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ws": { target: "http://localhost:8000", ws: true },
      "/api": "http://localhost:8000",
    },
  },
});
