export default function CameraView({ videoRef }) {
  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay playsInline className="camera" />
      <style jsx>{`
        .camera-view {
          text-align: center;
          margin-bottom: 1rem;
        }
        .camera {
          width: 100%;
          max-width: 600px;
          border-radius: 10px;
          background: black;
        }
      `}</style>
    </div>
  );
}
