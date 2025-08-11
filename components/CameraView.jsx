export default function CameraView({ videoRef, countdown, flash }) {
  return (
    <div className="camera-view">
      <div className="camera-wrapper">
        <video ref={videoRef} autoPlay playsInline className="camera" />

        {flash && <div className="flash-overlay"></div>}

        {countdown !== null && (
          <div className="countdown">{countdown}</div>
        )}
      </div>

      <style jsx>{`
        .camera-view {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .camera-wrapper {
          position: relative;
          display: inline-block;
        }
        .camera {
          width: 100%;
          max-width: 600px;
          border-radius: 10px;
          background: black;
        }
        .countdown {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 4rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
          pointer-events: none;
        }
        .flash-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background: white;
          opacity: 0.8;
          animation: flashAnim 0.15s ease-out forwards;
        }
        @keyframes flashAnim {
          from { opacity: 0.8; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
