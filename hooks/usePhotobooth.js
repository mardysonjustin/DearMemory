import { useState, useRef, useEffect } from "react";

export default function usePhotobooth() {
  const videoRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    initCamera();
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    setPhotos((prev) => [...prev, canvas.toDataURL("image/png")].slice(0, 4));
  };

  const startPhotobooth = async () => {
    for (let i = 0; i < 4; i++) {
      // countdown
      for (let sec = 5; sec > 0; sec--) {
        setCountdown(sec);
        await new Promise((res) => setTimeout(res, 1000));
      }
      setCountdown(null);

      // flash effect
      setFlash(true);
      capturePhoto();
      await new Promise((res) => setTimeout(res, 150));
      setFlash(false);

      if (i < 3) await new Promise((res) => setTimeout(res, 1000));
    }
  };

  const clearPhotos = () => setPhotos([]);

  const downloadStrip = () => {
    if (photos.length < 4) {
      alert("Take 4 photos first!");
      return;
    }

    const stripCanvas = document.createElement("canvas");
    const width = 600;
    const photoHeight = 400;
    const padding = 20;
    const totalHeight = photoHeight * 4 + padding * 5;

    stripCanvas.width = width;
    stripCanvas.height = totalHeight;
    const ctx = stripCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, totalHeight);

    photos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        ctx.drawImage(
          img,
          padding,
          padding + index * (photoHeight + padding),
          width - padding * 2,
          photoHeight
        );
        if (index === photos.length - 1) {
          const link = document.createElement("a");
          link.download = "photobooth_strip.png";
          link.href = stripCanvas.toDataURL("image/png");
          link.click();
        }
      };
    });
  };

  return {
    videoRef,
    photos,
    isCameraReady,
    startPhotobooth,
    downloadStrip,
    countdown,
    flash,
    clearPhotos,
  };
}
