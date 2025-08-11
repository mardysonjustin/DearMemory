export default function Gallery({ photos }) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery">
        {photos.map((photo, idx) => (
          <img
            key={idx}
            src={photo}
            alt={`Photo ${idx + 1}`}
            className="gallery-photo"
          />
        ))}
      </div>

      <style jsx>{`
        .gallery-container {
          margin-top: 20px;
        }

        h2 {
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .gallery {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 10px 0;
          scroll-behavior: smooth;
        }

        .gallery::-webkit-scrollbar {
          height: 8px;
        }
        .gallery::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        .gallery::-webkit-scrollbar-track {
          background: transparent;
        }

        .gallery-photo {
          height: 120px;
          border-radius: 8px;
          object-fit: cover;
          background: #f0f0f0;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
