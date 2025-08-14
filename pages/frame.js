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
                  dateColor: item.dateColor,
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

  const prettifyName = (raw) => {
    if (!raw || typeof raw !== "string") return "";
    const spaced = raw
      .replace(/[-_]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
    return spaced
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const drawFrame = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 1000;
    const height = 3000;
    canvas.width = width;
    canvas.height = height;

    // Resolve selected frame config
    const selectedFrame = availableFrames.find((f) => f.name === frameName) || null;
    const backgroundColor = selectedFrame?.backgroundColor || "#ffffff";
    const overlayPosition = selectedFrame?.overlayPosition || "above"; // 'above' | 'below'
    const dateColorRaw = (selectedFrame?.dateColor || "black").toLowerCase();
    const dateColor = dateColorRaw === "white" ? "white" : "black"; // clamp to black/white only

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

    // Slight vertical shrink inside each slot (e.g., 5%)
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

    // added date
    const drawDate = () => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const dateText = `${dd}-${mm}-${yyyy}`;

      const margin = 20;
      ctx.save();
      ctx.font = "600 30px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = dateColor;

      ctx.shadowColor = dateColor === "white" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.fillText(dateText, width - margin, height - margin);
      ctx.restore();
    };

    drawDate();
  };

  const downloadImage = () => {
    if (typeof document === "undefined") return;
    const link = document.createElement("a");
    link.download = "dear-memory-strip.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h1>Select Your Frame</h1>

      {availableFrames.length > 0 && (
        <div className="frame-list">
          {availableFrames.map((f) => (
            <button
              key={f.name}
              className={`frame-thumb ${frameName === f.name ? "active" : ""}`}
              onClick={() => setFrameName(f.name)}
              title={prettifyName(f.name)}
            >
              <span className="name">{prettifyName(f.name)}</span>
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
          display: flex;
          flex-direction: row;
          gap: 8px;
          margin: 12px 0 16px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .frame-thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 9999px;
          background: #fff;
          cursor: pointer;
          white-space: nowrap;
          font-size: 12px;
          line-height: 1;
        }
        .frame-thumb.active {
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .frame-thumb .name {
          font-size: 12px;
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
