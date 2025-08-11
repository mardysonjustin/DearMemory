export default function Controls({ startPhotobooth, downloadStrip, disabled, photos, clearPhotos }) {
  const handleClick = () => {
    if (photos.length >= 4) {
      clearPhotos();
      return;
    }
    startPhotobooth();
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg shadow-md transition-colors"
      >
        {photos.length >= 4 ? "Restart" : "Start"}
      </button>
      <button
        onClick={downloadStrip}
        disabled={photos.length === 0}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg shadow-md transition-colors"
      >
        Download Strip
      </button>
    </div>
  );
}
