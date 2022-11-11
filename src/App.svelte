<script lang="ts">
  import { onMount } from "svelte";

  const barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });

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
    const constraints: MediaStreamConstraints = {};

    constraints.video = cameraId
      ? {
          deviceId: { exact: cameraId },
          width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
          },
          height: {
            min: 720,
            ideal: 1080,
            max: 1440,
          },
        }
      : true;

    const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(console.error);

    if (!stream || !video) return;
    video.srcObject = stream;
    video.muted = true;
    await video.play();
    setInterval(() => detectBarcodes(video), 100);
    // setInterval(paintToCanvas, 20);
  }

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  }

  // function handleCameraChange() {
  //   if (!cameraSwitcherEl) return;
  //   populateVideo(cameraSwitcherEl.value);
  // }

  async function detectBarcodes(video: HTMLVideoElement) {
    const results: DetectedBarcode[] = await barcodeDetector.detect(video);
    results.forEach(result => {
      // console.log('Detected barcode', result.rawValue);
      // console.table(result.cornerPoints);
      // console.table(result.boundingBox);
      const { x, y, width, height } = result.boundingBox;
      const centerPoint = {
        x: x + width / 2,
        y: y + height / 2,
      };

      console.log(result.rawValue);

      detectedValue = result.rawValue;

      const scaledCenterPoint = scaleCoordsToVideo(centerPoint.x, centerPoint.y);

      // console.table(result.cornerPoints);
      // const [topLeft, topRight, bottomRight, bottomLeft] = result.cornerPoints;
      // select the label for this element
      // const label = labelsEl?.querySelector<HTMLSpanElement>(`[data-code="${result.rawValue}"]`);
      // if (!label) throw new Error("No label found");
      // // label.style.width = `${width}px`;
      // // label.style.height = `${height}px`;
      // label.style.left = `${scaledCenterPoint.x}px`;
      // label.style.top = `${scaledCenterPoint.y}px`;
    });
  }

  function scaleCoordsToVideo(x: number, y: number) {
    if (!video) throw new Error("No video element found");
    const videoRect = video.getBoundingClientRect();
    // videoRect.width / video.videoWidth givies us a multiplier to scale the x and y coords. Say we have 1920 video, but it's being displayed at 500px wide. Then we will have 500 / 1920 = 0.2604166667. A point that used to be at 500, is now 500 * 0.2604166667.
    return {
      x: (x * videoRect.width) / video.videoWidth,
      y: (y * videoRect.height) / video.videoHeight,
    };
  }

  onMount(() => {
    populateVideo();
  });

  let selectedCamera: string;

  let detectedValue: string = "Hello World";
</script>

<main class="overflow-hidden">
  <div class="shadow-lg z-10 flex items-center flex-col px-4 bg-white absolute w-full py-4">
    <div class="mt-4">
      <select
        class="fixed bottom-5 inset-x-5"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        name="cameras"
        bind:value={selectedCamera}
        on:change={() => populateVideo(selectedCamera)}
      >
        {#await getDevices()}
          <option value={undefined}>Loading...</option>
        {:then devices}
          {#each devices as device}
            {#if device.kind === "videoinput"}
              <option value={device.deviceId}>{device.label}</option>
            {/if}
          {/each}
        {/await}
      </select>
    </div>
    <div class="flex items-center mt-6">
      <p class="font-semibold text-2xl">{detectedValue}</p>
    </div>
  </div>
  <video playsinline muted bind:this={video} class="h-screen w-screen object-cover" />
</main>
