import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://alexisbussa.com",
  output: "static",
  build: {
    format: "directory",
  },
});
