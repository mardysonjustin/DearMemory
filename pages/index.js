import dynamic from "next/dynamic";
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Webcam
        className="rounded-lg shadow-lg"
        videoConstraints={{ facingMode: "user" }}
      />
    </div>
  );
}
