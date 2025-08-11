import { useEffect, useRef, useState } from "react";

export default function FramePage() {
  const [photos, setPhotos] = useState([]);
  const [frame, setFrame] = useState("polaroid");
  const canvasRef = useRef(null);

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("selectedPhotos")) || [];
    setPhotos(selected);
  }, []);

  useEffect(() => {
    if (photos.length === 4) {
      drawFrame();
    }
  }, [photos, frame]);

  const drawFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 1000;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    if (frame === "polaroid") {
      ctx.fillStyle = "#fff";
    } else if (frame === "wood") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#8b4513");
      grad.addColorStop(1, "#deb887");
      ctx.fillStyle = grad;
    } else if (frame === "gold") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#ffd700");
      grad.addColorStop(1, "#b8860b");
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    const margin = 30;
    const photoW = (width - margin * 3) / 2;
    const photoH = (height - margin * 3) / 2;

    photos.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const x = margin + (i % 2) * (photoW + margin);
        const y = margin + Math.floor(i / 2) * (photoH + margin);
        ctx.drawImage(img, x, y, photoW, photoH);
      };
    });
  };

  const downloadImage = () => {
    if (typeof document === "undefined") return;
    const link = document.createElement("a");
    link.download = "framed-photo.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose Your Frame</h1>

      <div className="frame-options">
        <button onClick={() => setFrame("polaroid")} className={frame === "polaroid" ? "active" : ""}>
          Polaroid
        </button>
        <button onClick={() => setFrame("wood")} className={frame === "wood" ? "active" : ""}>
          Wood
        </button>
        <button onClick={() => setFrame("gold")} className={frame === "gold" ? "active" : ""}>
          Gold
        </button>
      </div>

      <canvas ref={canvasRef} style={{ border: "10px solid #333", margin: "20px 0" }} />

      <button className="download-btn" onClick={downloadImage}>
        Download
      </button>

      <style jsx>{`
        .frame-options {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        button {
          padding: 8px 15px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 5px;
        }
        button.active {
          border-color: #0070f3;
          background: #e6f0ff;
        }
        .download-btn {
          background: #0070f3;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
