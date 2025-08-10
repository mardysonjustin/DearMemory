import { useRef, useState, useCallback, useEffect } from "react";

export default function usePhotobooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const activeStreamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [stream, setStream] = useState(null);

  const initCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setError("Camera not supported in this environment");
      return;
    }

    async function tryCamera(width, height) {
      return navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: width },
          height: { ideal: height },
        },
      });
    }

    try {
      console.log("Requesting camera access...");
      let mediaStream;
      try {
        mediaStream = await tryCamera(1280, 720);
      } catch (err) {
        console.warn("1280x720 failed, retrying 640x480...", err);
        mediaStream = await tryCamera(640, 480);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        activeStreamRef.current = mediaStream;
        setStream(mediaStream);

        const onLoaded = () => {
          setCameraReady(true);
          setError(null);
        };
        videoRef.current.addEventListener("loadedmetadata", onLoaded, { once: true });

        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn("video.play() failed (likely autoplay policy):", err);
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError(`Camera access denied: ${err?.name || err?.message || err}`);
      setCameraReady(false);
    }
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      setError("Camera not ready");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // set canvas to video resolution (fallbacks included)
      canvas.width = video.videoWidth || video.clientWidth || 640;
      canvas.height = video.videoHeight || video.clientHeight || 480;

      // draw and export
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");

      setGallery((prev) => [...prev, imageDataUrl]);
      setCapturedImage(imageDataUrl);
      setError(null);
      console.log("Photo captured successfully");
    } catch (err) {
      console.error("Capture error:", err);
      setError(`Failed to capture photo: ${err?.message || err}`);
    }
  }, [cameraReady]);

  const startCountdown = useCallback(() => {
    if (!cameraReady) {
      setError("Please wait for camera to load");
      return;
    }
    let counter = 3;
    setCountdown(counter);
    setError(null);

    const timer = setInterval(() => {
      counter -= 1;
      if (counter <= 0) {
        clearInterval(timer);
        setCountdown(null);
        setFlash(true);
        setTimeout(() => {
          capture();
          setFlash(false);
        }, 100);
      } else {
        setCountdown(counter);
      }
    }, 1000);
  }, [cameraReady, capture]);

  useEffect(() => {
    initCamera();

    return () => {
      // cleanup active stream when unmounting
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
        activeStreamRef.current = null;
      }
    };
  }, [initCamera]);

  const downloadImage = (img) => {
    const link = document.createElement("a");
    link.href = img || capturedImage;
    link.download = `photobooth-${Date.now()}.png`;
    link.click();
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    setError(null);

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((t) => t.stop());
      activeStreamRef.current = null;
      setStream(null);
      setCameraReady(false);
    }

    await initCamera();
  };

  const deleteFromGallery = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    setCapturedImage((current) => (gallery[index] === current ? null : current));
  };

  return {
    videoRef,
    canvasRef,
    capturedImage,
    gallery,
    countdown,
    flash,
    error,
    cameraReady,
    stream,
    initCamera,
    capture,
    startCountdown,
    downloadImage,
    retakePhoto,
    deleteFromGallery,
    setCapturedImage,
  };
}
