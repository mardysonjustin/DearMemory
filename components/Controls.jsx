export default function Controls({ takePhoto, downloadStrip, disabled }) {
  return (
    <div className="controls">
      <button onClick={takePhoto} disabled={disabled}>
        📸 Take Photo
      </button>
      <button onClick={downloadStrip}>💾 Download Strip</button>
      <style jsx>{`
        .controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 1rem;
        }
        button {
          padding: 10px 20px;
          font-size: 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
