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
  } = usePhotobooth({ maxPhotos: 8, onFinish: (finalPhotos) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("photoboothPhotos", JSON.stringify(finalPhotos));
    }
  }});

  useEffect(() => {
    if (photos.length === 8) {
      router.push("/select");
    }
  }, [photos, router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Oblivion</h1>
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
