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
          height: { min: 576, ideal: 720, max: 1080 },
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
</script>

<video playsinline muted class="webcam" bind:this={video} />
