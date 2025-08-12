import { useEffect, useRef, useState } from "react";

export default function FramePage() {
  const [photos, setPhotos] = useState([]);
  const [frameName, setFrameName] = useState("");
  const [availableFrames, setAvailableFrames] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("selectedPhotos")) || [];
    setPhotos(selected.slice(0, 4));
  }, []);

  useEffect(() => {
    // load available frame names from manifest
    fetch("/frames/manifest.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (Array.isArray(list)) {
          const normalized = list.map((item) =>
            typeof item === "string"
              ? { name: item }
              : {
                  name: item.name,
                  backgroundColor: item.backgroundColor,
                  overlayPosition: item.overlayPosition,
                }
          );
          setAvailableFrames(normalized.filter((f) => f && f.name));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (photos.length === 4) {
      drawFrame();
    }
  }, [photos, frameName]);

  const drawFrame = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 1000;
    const height = 3000;
    canvas.width = width;
    canvas.height = height;

    const selectedFrame = availableFrames.find((f) => f.name === frameName) || null;
    const backgroundColor = selectedFrame?.backgroundColor || "#ffffff";
    const overlayPosition = selectedFrame?.overlayPosition || "above"; // 'above' | 'below'

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const slots = [
      { x: 80, y: 80, w: 840, h: 632 },
      { x: 80, y: 743, w: 840, h: 632 },
      { x: 80, y: 1405, w: 840, h: 632 },
      { x: 80, y: 2068, w: 840, h: 632 },
    ];

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const loadOverlay = () =>
      new Promise((resolve) => {
        if (!frameName || frameName.trim() === "") return resolve(null);
        const overlay = new Image();
        overlay.onload = () => resolve(overlay);
        overlay.onerror = () => resolve(null);
        overlay.src = `/frames/${frameName}.png`;
      });

    // begin loading overlay and photos in parallel
    const overlayPromise = loadOverlay();
    const imagesPromise = Promise.all(photos.map(loadImage)).catch((e) => {
      console.error("Failed to load one or more photos", e);
      return [];
    });

    const verticalShrink = 0.95;

    const drawPhotos = (images) => {
      images.forEach((img, i) => {
        if (!img) return;
        const { x, y, w, h } = slots[i];

        const innerH = Math.round(h * verticalShrink);
        const innerY = y + Math.round((h - innerH) / 2);

        const imageAspect = img.width / img.height;
        const slotAspect = w / innerH;
        let drawW, drawH, dx, dy;
        if (imageAspect > slotAspect) {
          drawH = innerH;
          drawW = drawH * imageAspect;
          dx = x + (w - drawW) / 2;
          dy = innerY;
        } else {
          drawW = w;
          drawH = drawW / imageAspect;
          dx = x;
          dy = innerY + (innerH - drawH) / 2;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, innerY, w, innerH);
        ctx.clip();
        ctx.drawImage(img, dx, dy, drawW, drawH);
        ctx.restore();
      });
    };

    const [overlayImg, images] = await Promise.all([overlayPromise, imagesPromise]);

    if (overlayPosition === "below" && overlayImg) {
      ctx.drawImage(overlayImg, 0, 0, width, height);
    }

    drawPhotos(images);

    if (overlayPosition === "above" && overlayImg) {
      ctx.drawImage(overlayImg, 0, 0, width, height);
    }
  };

  const downloadImage = () => {
    if (typeof document === "undefined") return;
    const link = document.createElement("a");
    link.download = "dear-memory-strip.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Select Your Frame</h1>

      {availableFrames.length > 0 && (
        <div className="frame-list">
          {availableFrames.map((f, idx) => (
            <button
              key={f.name}
              className={`frame-thumb ${frameName === f.name ? "active" : ""}`}
              onClick={() => setFrameName(f.name)}
              title={`Frame ${idx + 1}`}
            >
              <span className="name">{`Frame ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ width: "320px", height: "960px", border: "10px solid #333", margin: "20px 0" }}
      />

      <button className="download-btn" onClick={downloadImage}>
        Download
      </button>

      <style jsx>{`
        .frame-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .frame-controls input {
          margin-left: 8px;
          padding: 6px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .hint {
          color: #666;
          font-size: 14px;
        }
        .frame-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          margin: 12px 0 16px;
        }
        .frame-thumb {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
        }
        .frame-thumb.active {
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .frame-thumb .name {
          font-size: 14px;
          color: #333;
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
