<script lang="ts">
  import { onMount } from "svelte";
  const barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });
  let audio: HTMLAudioElement;

  interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface CornerPoint {
    x: number;
    y: number;
  }

  interface DetectedBarcode {
    boundingBox: BoundingBox;
    cornerPoints: CornerPoint[];
    format: string;
    rawValue: string;
  }

  let video: HTMLVideoElement;

  async function populateVideo(cameraId?: string) {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: "environment",
        deviceId: cameraId,
        width: {
          ideal: 1080,
        },
        height: {
          ideal: 1920,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(console.error);

    if (!stream) return;

    video.srcObject = stream;
    video.muted = true;
    await video.play();
    setInterval(() => detectBarcodes(video), 100);
  }

  async function detectBarcodes(video: HTMLVideoElement) {
    const results: DetectedBarcode[] = await barcodeDetector.detect(video);
    results.forEach(result => {
      console.log(result.rawValue);

      detectedValue = result.rawValue;
      audio.currentTime = 0;
      audio.play();
    });
  }

  onMount(() => {
    populateVideo();
  });

  let detectedValue: string = "";

  $: lines = detectedValue
    .split(".")
    .filter(Boolean)
    .map(line => (line += "."));
  console.log({ detectedValue, lines });
</script>

<main class="overflow-hidden">
  <div class="shadow-lg z-10 flex items-center flex-col px-4 bg-white absolute w-full py-4">
    <div class="items-center mt-6">
      {#each lines as line}
        <p class="text-xl font-semibold">{line}</p>
      {/each}
    </div>
  </div>
  <audio bind:this={audio} src="/bleep.mp3" />
  <video playsinline muted bind:this={video} class="h-screen w-screen object-cover" />
</main>
