export default function StatusIndicator({ cameraReady }) {
  return (
    <div className="mt-4 flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${cameraReady ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
      <span className="text-sm opacity-75">{cameraReady ? "Camera Ready" : "Camera Loading..."}</span>
    </div>
  );
}
