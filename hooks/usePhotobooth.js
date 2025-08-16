import { useState, useRef, useEffect } from "react";

export default function usePhotobooth({ maxPhotos = 4, onFinish } = {}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const [takingPhotos, setTakingPhotos] = useState(false);

  useEffect(() => {
    if (!canvasRef.current && typeof document !== "undefined") {
      canvasRef.current = document.createElement("canvas");
    }

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraReady(true);
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    initCamera();
  }, []);

  const takePhoto = () => {  // made it more stricter for vercel deployment
    if (typeof window === "undefined") return; // prevent SSR crash
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
  
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
  
    canvasRef.current.toBlob((blob) => {
      if (!blob) return; // safety check
      const photoUrl = URL.createObjectURL(blob);
  
      setPhotos((prev) => {
        const updated = [...prev, photoUrl];
        if (updated.length === maxPhotos) {
          setTakingPhotos(false);
          if (onFinish) onFinish(updated);
        }
        return updated;
      });
  
      triggerFlash();
    }, "image/png");
  };
  

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  const startPhotobooth = async () => {
    if (takingPhotos) return;
    setPhotos([]);
    setTakingPhotos(true);

    for (let i = 0; i < maxPhotos; i++) {
      await runCountdown(3);
      takePhoto();
    }
  };

  const runCountdown = (seconds) => {
    return new Promise((resolve) => {
      let timeLeft = seconds;
      setCountdown(timeLeft);
      const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timer);
          setCountdown(null);
          resolve();
        } else {
          setCountdown(timeLeft);
        }
      }, 1000);
    });
  };

  const clearPhotos = () => {
    // revoke URLs to free memory
    photos.forEach((url) => URL.revokeObjectURL(url));
    setPhotos([]);
  };

  return {
    videoRef,
    photos,
    isCameraReady,
    startPhotobooth,
    countdown,
    flash,
    clearPhotos,
  };
}
