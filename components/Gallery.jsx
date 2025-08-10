export default function Gallery({ gallery, capturedImage, setCapturedImage, deleteFromGallery }) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
      {gallery.map((img, index) => (
        <div key={index} className="relative group">
          <img
            src={img}
            alt={`Shot ${index + 1}`}
            className={`rounded-lg border-2 ${
              capturedImage === img ? "border-green-400" : "border-transparent"
            } cursor-pointer`}
            onClick={() => setCapturedImage(img)}
          />
          <button
            onClick={() => deleteFromGallery(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
