import { useEffect } from "react";
import { useRouter } from "next/router";
import usePhotobooth from "../hooks/usePhotobooth";
import CameraView from "../components/CameraView";
import Controls from "../components/Controls";
import Gallery from "../components/Gallery";
import StatusIndicator from "../components/StatusIndicator";

export default function Home() {
  const router = useRouter();
  const {
    videoRef,
    photos,
    isCameraReady,
    startPhotobooth,
    downloadStrip,
    countdown,
    flash,
    clearPhotos,
  } = usePhotobooth({
    maxPhotos: 8,
    onFinish: (finalPhotos) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("photoboothPhotos", JSON.stringify(finalPhotos));
      }
    },
  });

  useEffect(() => {
    if (photos.length === 8) {
      router.push("/select");
    }
  }, [photos, router]);

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center" }}>Dear Memory</h1>
      <StatusIndicator isReady={isCameraReady} />

      <div className="main-layout">
        <CameraView videoRef={videoRef} countdown={countdown} flash={flash} />
      </div>

      <Controls
        startPhotobooth={startPhotobooth}
        downloadStrip={downloadStrip}
        disabled={!isCameraReady}
        photos={photos}
        clearPhotos={clearPhotos}
      />

      <Gallery photos={photos} />

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background-image: url("backgrounds/dmbg.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 20px;
        }
        .main-layout {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
