import "@picocss/pico";
import App from "./App.svelte";

import { BarcodeDetectorPolyfill } from "@undecaf/barcode-detector-polyfill";

declare global {
  interface Window {
    BarcodeDetector: typeof BarcodeDetectorPolyfill;
  }
}

try {
  window.BarcodeDetector.getSupportedFormats();
} catch {
  window.BarcodeDetector = BarcodeDetectorPolyfill;
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
