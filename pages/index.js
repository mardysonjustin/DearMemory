// pages/index.js
import { useEffect } from "react";
import usePhotobooth from "../hooks/usePhotobooth";
import CameraView from "../components/CameraView";
import Controls from "../components/Controls";
import Gallery from "../components/Gallery";
import StatusIndicator from "../components/StatusIndicator";

export default function Home() {
  const {
    videoRef,
    canvasRef,
    capturedImage,
    gallery,
    countdown,
    flash,
    error,
    cameraReady,
    startCountdown,
    downloadImage,
    retakePhoto,
    deleteFromGallery,
    setCapturedImage,
  } = usePhotobooth();

  // ensure hidden canvas has some default size (helps capturing before metadata)
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
    }
  }, [canvasRef]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 relative overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="absolute inset-0 bg-black opacity-20" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-pulse delay-1000" />

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
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            countdown={countdown}
            flash={flash}
            cameraReady={cameraReady}
            error={error}
          />
        ) : (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-2xl shadow-2xl border-4 border-white/20 max-w-md"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        )}

        <Controls
          capturedImage={capturedImage}
          cameraReady={cameraReady}
          startCountdown={startCountdown}
          downloadImage={downloadImage}
          retakePhoto={retakePhoto}
        />

        <Gallery
          gallery={gallery}
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          deleteFromGallery={deleteFromGallery}
        />

        <StatusIndicator cameraReady={cameraReady} />
      </div>
    </div>
  );
}
