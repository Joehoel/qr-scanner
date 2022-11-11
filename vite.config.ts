import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [svelte(), mkcert()],
  server: { https: true },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(["zbar.wasm"])],
    },
  },
});
