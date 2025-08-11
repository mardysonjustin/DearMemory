export default function Gallery({ photos }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[500px] flex flex-col justify-start items-center gap-4">
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Photo ${i + 1}`}
          className="w-40 object-cover border border-gray-300 rounded"
        />
      ))}
    </div>
  );
}
