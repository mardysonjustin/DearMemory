import { useRef, useState, useCallback, useEffect } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [stream, setStream] = useState(null);

  const initCamera = useCallback(async () => {
    try {
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        // wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          setCameraReady(true);
          setError(null);
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError(`Camera access denied: ${err.name}`);
      setCameraReady(false);
    }
  }, []);

  // capture photo using canvas
  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      setError("Camera not ready");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setError(null);

      console.log("Photo captured successfully");
    } catch (err) {
      console.error("Capture error:", err);
      setError(`Failed to capture photo: ${err.message}`);
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

    // to stop the camera stream
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initCamera]);

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `photobooth-${Date.now()}.png`;
      link.click();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
    if (!cameraReady && !stream) {
      initCamera(); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          📸 Photobooth
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/90 rounded-xl backdrop-blur-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!capturedImage ? (
          <div className="relative">
            {/* video/capture element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm max-w-md"
              style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
            
            {/* hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* countdown overlay */}
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full w-32 h-32 flex items-center justify-center">
                  <span className="text-6xl font-extrabold text-white animate-ping">
                    {countdown}
                  </span>
                </div>
              </div>
            )}

            {/* flash overlay */}
            {flash && (
              <div className="absolute inset-0 bg-white rounded-2xl animate-pulse"></div>
            )}

            {/* camera not ready overlay */}
            {!cameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading camera...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-2xl shadow-2xl border-4 border-white/20 max-w-md"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {!capturedImage ? (
            <button
              onClick={startCountdown}
              disabled={!cameraReady}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Take Photo
            </button>
          ) : (
            <>
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                ⬇️ Download
              </button>
              <button
                onClick={retakePhoto}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                🔄 Retake
              </button>
            </>
          )}
        </div>

        {/* status indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm opacity-75">
            {cameraReady ? 'Camera Ready' : 'Camera Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
}