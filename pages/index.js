import usePhotobooth from "../hooks/usePhotobooth";
import CameraView from "../components/CameraView";
import Controls from "../components/Controls";
import Gallery from "../components/Gallery";
import StatusIndicator from "../components/StatusIndicator";

export default function Home() {
  const {
    videoRef,
    photos,
    isCameraReady,
    startPhotobooth,
    downloadStrip,
    countdown,
    flash,
    clearPhotos,
  } = usePhotobooth();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "10px" }}>
        Oblivion
      </h1>
      <StatusIndicator isReady={isCameraReady} />

      <div className="main-layout">
        <div className="camera-section">
          <CameraView videoRef={videoRef} countdown={countdown} flash={flash} />

          <div className="controls-wrapper">
            <button
              onClick={() => (photos.length >= 4 ? clearPhotos() : startPhotobooth())}
              disabled={!isCameraReady}
              className="btn btn-primary"
            >
              {photos.length >= 4 ? "Restart" : "Start"}
            </button>

            <button
              onClick={downloadStrip}
              disabled={photos.length === 0}
              className="btn btn-success"
            >
              Download Strip
            </button>
          </div>
        </div>

        <div className="strip-preview">
          <div className="strip-canvas">
            {photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Photo ${idx + 1}`}
                className="strip-photo"
              />
            ))}
          </div>
        </div>
      </div>

      <Gallery photos={photos} />

      <style jsx>{`
        .main-layout {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .camera-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .controls-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 200px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }

        .btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: scale(1.02);
        }

        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-success:hover:not(:disabled) {
          background: #059669;
          transform: scale(1.02);
        }

        .strip-preview {
          width: 200px;
          background: white;
          border-radius: 10px;
          padding: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .strip-canvas {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          min-height: 500px;
          justify-content: flex-start;
        }

        .strip-photo {
          width: 100%;
          border-radius: 5px;
          object-fit: cover;
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
}
