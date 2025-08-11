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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, frame]);

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  const drawFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 1000;
    const height = 3000;
    canvas.width = width;
    canvas.height = height;

    const outerMargin = 40;
    const innerMargin = 40;
    const footerHeight = 220; 
    const borderRadius = 40;
    const photoGap = 30;

    const contentTop = outerMargin + innerMargin;
    const contentBottom = height - outerMargin - innerMargin - footerHeight;
    const availableHeight = contentBottom - contentTop;
    const photoWidth = width - outerMargin * 2 - innerMargin * 2;
    const photoHeight = (availableHeight - photoGap * 3) / 4;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    drawRoundedRect(ctx, outerMargin, outerMargin, width - outerMargin * 2, height - outerMargin * 2, borderRadius);

    if (frame === "polaroid") {
      ctx.fillStyle = "#ffffff";
    } else if (frame === "wood") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#6e3b1f");
      grad.addColorStop(0.5, "#8b5a2b");
      grad.addColorStop(1, "#c19a6b");
      ctx.fillStyle = grad;
    } else if (frame === "gold") {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, height / 1.2);
      grad.addColorStop(0, "#fff3b0");
      grad.addColorStop(0.4, "#ffd700");
      grad.addColorStop(1, "#b8860b");
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = "#ffffff";
    }
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 18;
    drawRoundedRect(ctx, outerMargin + 9, outerMargin + 9, width - (outerMargin + 9) * 2, height - (outerMargin + 9) * 2, borderRadius - 6);
    ctx.stroke();

    const gloss = ctx.createLinearGradient(0, outerMargin, 0, height * 0.4);
    gloss.addColorStop(0, "rgba(255,255,255,0.22)");
    gloss.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gloss;
    drawRoundedRect(ctx, outerMargin + 6, outerMargin + 6, width - (outerMargin + 6) * 2, height * 0.35, borderRadius - 10);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
      const x = outerMargin + innerMargin;
      const y = contentTop + i * (photoHeight + photoGap);

      ctx.save();
      drawRoundedRect(ctx, x, y, photoWidth, photoHeight, 24);
      ctx.fillStyle = "#f2f2f2";
      ctx.fill();
      ctx.clip();

      const src = photos[i];
      if (src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
          const imageAspect = img.width / img.height;
          const slotAspect = photoWidth / photoHeight;
          let drawW, drawH, dx, dy;
          if (imageAspect > slotAspect) {
            // image is wider than slot
            drawH = photoHeight;
            drawW = drawH * imageAspect;
            dx = x + (photoWidth - drawW) / 2;
            dy = y;
          } else {
            // image is taller than slot
            drawW = photoWidth;
            drawH = drawW / imageAspect;
            dx = x;
            dy = y + (photoHeight - drawH) / 2;
          }
          ctx.save();
          drawRoundedRect(ctx, x, y, photoWidth, photoHeight, 24);
          ctx.clip();
          ctx.drawImage(img, dx, dy, drawW, drawH);
          ctx.restore();
        };
      }
      ctx.restore();

      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 8;
      drawRoundedRect(ctx, x, y, photoWidth, photoHeight, 24);
      ctx.stroke();
    }

    const overlay = new Image();
    overlay.src = `/frames/${frame}.png`;
    overlay.onload = () => {
      ctx.drawImage(overlay, 0, 0, width, height);
      drawTitle();
    };
    overlay.onerror = () => {
      drawTitle();
    };

    function drawTitle() {
      const titleY = height - outerMargin - 80;
      ctx.save();
      ctx.font = "bold 84px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;

      const textGrad = ctx.createLinearGradient(width * 0.3, titleY - 40, width * 0.7, titleY + 40);
      if (frame === "gold") {
        textGrad.addColorStop(0, "#fff6bf");
        textGrad.addColorStop(0.5, "#ffd700");
        textGrad.addColorStop(1, "#b8860b");
      } else if (frame === "wood") {
        textGrad.addColorStop(0, "#f7e1c6");
        textGrad.addColorStop(1, "#8b5a2b");
      } else {
        textGrad.addColorStop(0, "#333");
        textGrad.addColorStop(1, "#666");
      }
      ctx.fillStyle = textGrad;
      ctx.fillText("Dear Memory", width / 2, titleY);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.strokeText("Dear Memory", width / 2, titleY);
      ctx.restore();
    }
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

      <canvas ref={canvasRef} style={{ width: "320px", height: "960px", border: "10px solid #333", margin: "20px 0" }} />

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
