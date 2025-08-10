export default function CameraView({
  videoRef,
  canvasRef,
  countdown,
  flash,
  cameraReady,
  error,
}) {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm max-w-md"
        style={{ transform: "scaleX(-1)" }}
      />
      {/* hidden canvas used for captures */}
      <canvas ref={canvasRef} className="hidden" />

      {countdown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full w-32 h-32 flex items-center justify-center">
            <span className="text-6xl font-extrabold text-white animate-ping">
              {countdown}
            </span>
          </div>
        </div>
      )}

      {flash && <div className="absolute inset-0 bg-white rounded-2xl animate-pulse" />}

      {!cameraReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Loading camera...</p>
          </div>
        </div>
      )}
    </div>
  );
}
