import { useEffect, useState } from "react";
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

  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (photos.length === 8) {
      router.push("/select");
    }
  }, [photos, router]);

  return (
    <div className="page-container">
      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h1>WELCOME TO DEAR MEMORY!</h1>
            <p><em>"Capture moments, treasure memories."</em></p>
            <ul>
              <li>📸 Click <strong>Start</strong> to begin — the system will automatically take 8 photos.</li>
              <li>✨ Choose your favorite 4 out of the 8 photos.</li>
              <li>🖼️ Select a frame and download your memory!</li>
            </ul>
            <button onClick={() => setShowPopup(false)}>Got it!</button>
          </div>
        </div>
      )}

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
          background-image: url("/backgrounds/dmbg.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 20px;
          position: relative;
        }
        .main-layout {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .popup {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .popup h1 {
          margin-bottom: 10px;
          color: #32473A;
        }
        .popup p {
          margin-bottom: 20px;
          font-style: italic;
          color: #444;
        }
        .popup ul {
          text-align: left;
          margin-bottom: 20px;
        }
        .popup li {
          color: #000000;
        }
        .popup button {
          background: #32473A;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }
        .popup button:hover {
          background:rgb(29, 180, 87);
        }
      `}</style>
    </div>
  );
}
