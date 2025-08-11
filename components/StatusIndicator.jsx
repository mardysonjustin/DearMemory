export default function StatusIndicator({ isReady }) {
  return (
    <p style={{ textAlign: "center", color: isReady ? "green" : "red" }}>
      {isReady ? "Camera Ready" : "Loading Camera..."}
    </p>
  );
}
