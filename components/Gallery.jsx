export default function Gallery({ photos }) {
  return (
    <div className="gallery">
      {photos.map((src, idx) => (
        <img key={idx} src={src} alt={`Photo ${idx + 1}`} />
      ))}
      <style jsx>{`
        .gallery {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        img {
          width: 150px;
          border: 3px solid white;
          border-radius: 5px;
          background: #ddd;
        }
      `}</style>
    </div>
  );
}
