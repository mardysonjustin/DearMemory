import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SelectPhotos() {
  const router = useRouter();
  const [allPhotos, setAllPhotos] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("photoboothPhotos")) || [];
    setAllPhotos(saved);
  }, []);

  const toggleSelect = (photo) => {
    if (selected.includes(photo)) {
      setSelected(selected.filter((p) => p !== photo));
    } else if (selected.length < 4) {
      setSelected([...selected, photo]);
    }
  };

  const goNext = () => {
    localStorage.setItem("selectedPhotos", JSON.stringify(selected));
    router.push("/frame");
  };

  return (
    <div className="select-page">
      <h1 className="title">Select Your Best 4 Shots!</h1>
      <p className="subtitle">Click to select — you can only pick 4 photos.</p>

      <div className="photo-grid">
        {allPhotos.map((photo, idx) => (
          <div
            key={idx}
            className={`photo-item ${selected.includes(photo) ? "selected" : ""}`}
            onClick={() => toggleSelect(photo)}
          >
            <Image src={photo} alt="Selected Photo" width={200} height={200} />
            {selected.includes(photo) && <div className="checkmark">✔</div>}
          </div>
        ))}
      </div>

      <button
        onClick={goNext}
        disabled={selected.length !== 4}
        className="next-btn"
      >
        Next →
      </button>

      <style jsx>{`
        .select-page {
          padding: 20px;
          text-align: center;
        }
        .title {
          font-size: 28px;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 140px));
          gap: 15px;
          margin: 20px auto;
          justify-content: center;
          width: 100%;
          max-width: 1000px;
        }
        .photo-item {
          position: relative;
          width: 140px;
          border-radius: 8px;
          overflow: hidden;
          border: 3px solid transparent;
          transition: transform 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .photo-item:hover {
          transform: scale(1.03);
        }
        .photo-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        .photo-item.selected {
          border-color: #0070f3;
        }
        .checkmark {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #0070f3;
          color: white;
          font-weight: bold;
          border-radius: 50%;
          padding: 5px 8px;
          font-size: 14px;
        }
        .next-btn {
          padding: 12px 24px;
          font-size: 18px;
          font-weight: bold;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
        }
        .next-btn:hover:not(:disabled) {
          background: #005bb5;
        }
        .next-btn:disabled {
          background: gray;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
