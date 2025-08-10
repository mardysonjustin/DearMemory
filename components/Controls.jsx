export default function Controls({
  capturedImage,
  cameraReady,
  startCountdown,
  downloadImage,
  retakePhoto,
}) {
  return (
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
            onClick={() => downloadImage(capturedImage)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Download
          </button>
          <button
            onClick={retakePhoto}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Retake
          </button>
        </>
      )}
    </div>
  );
}
