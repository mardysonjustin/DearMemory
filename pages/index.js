import { useEffect } from "react";
import usePhotobooth from "../hooks/usePhotobooth";
import CameraView from "../components/CameraView";
import Controls from "../components/Controls";
import Gallery from "../components/Gallery";
import StatusIndicator from "../components/StatusIndicator";

export default function Home() {
  const { videoRef, photos, isCameraReady, takePhoto, downloadStrip } = usePhotobooth();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>📷 Photobooth</h1>
      <StatusIndicator isReady={isCameraReady} />
      <CameraView videoRef={videoRef} />
      <Controls takePhoto={takePhoto} downloadStrip={downloadStrip} disabled={!isCameraReady} />
      <Gallery photos={photos} />
    </div>
  );
}
