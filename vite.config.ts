import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(["zbar.wasm"])],
    },
  },
});
