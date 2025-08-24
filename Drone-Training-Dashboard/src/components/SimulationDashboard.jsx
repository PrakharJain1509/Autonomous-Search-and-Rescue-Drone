import React, { useEffect, useState } from "react";
import { Maximize2, Monitor, Camera, Thermometer, Volume2 } from "lucide-react";

const SERVER_WS_URL = "ws://localhost:8765";
const SIMULATION_URL = "http://127.0.0.1:5500";

const DEFAULT_THERMAL = "/test_data/thermal/no_human/FLIR_04123_jpeg_jpg.rf.fa8691c9bfaccaa604ff9cbb7f1af48c.jpg";
const DEFAULT_IMAGE = "/test_data/image/no_human/Screenshot (381).png";

export default function SimulationDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingSim, setIsLoadingSim] = useState(true);
  const [ws, setWs] = useState(null);

  const [thermalSrc, setThermalSrc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [audioStatus, setAudioStatus] = useState("No Human");

  useEffect(() => {
    const socket = new WebSocket(SERVER_WS_URL);

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      socket.send(JSON.stringify({ ping: true }));
    };



    socket.onmessage = (evt) => {
      const { image, thermal, audio } = JSON.parse(evt.data);
      console.log("📩 Inference response", { image, thermal, audio });

      if (thermal)  setThermalSrc(`data:image/png;base64,${thermal}`);
      if (image)    setImageSrc(`data:image/png;base64,${image}`);
      if (audio)    setAudioStatus(audio);

      setTimeout(() => {
        setThermalSrc(null);
        setImageSrc(null);
        setAudioStatus("No Human");
      }, 5000);
    };

    socket.onerror = (err) => console.error("❌ WS Error", err);
    socket.onclose = () => console.log("🔌 WS Closed");

    setWs(socket);
    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Simulation Panel */}
        <div
          className={`bg-gray-800 rounded-lg border border-gray-700 shadow-xl ${
            isFullscreen ? "fixed inset-0 z-50" : ""
          } transition-all duration-300 hover:border-blue-500`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">3D Simulation</h2>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-700 rounded-full transition-all duration-300 hover:text-blue-400 hover:rotate-90"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 relative">
            {isLoadingSim && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
              </div>
            )}
            <iframe
              src={SIMULATION_URL}
              className={`w-full bg-black rounded-lg ${
                isFullscreen ? "h-[calc(100vh-120px)]" : "h-[60vh]"
              } transition-all duration-300`}
              title="Simulation"
              onLoad={() => setIsLoadingSim(false)}
            />
          </div>
        </div>

        {/* Detection Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Image Detection */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center gap-2 p-4 border-b border-gray-700">
              <Camera className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Image Detection</h2>
            </div>
            <div className="p-4">
              <div className="aspect-video rounded-lg border border-gray-700 overflow-hidden">
                <img
                  src={imageSrc || DEFAULT_IMAGE}
                  alt="Image Detection"
                  className="w-full h-full object-cover rounded-lg opacity-75"
                />
              </div>
            </div>
          </div>

          {/* Thermal Detection */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center gap-2 p-4 border-b border-gray-700">
              <Thermometer className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Thermal Detection</h2>
            </div>
            <div className="p-4">
              <div className="aspect-video rounded-lg border border-gray-700 overflow-hidden">
                <img
                  src={thermalSrc || DEFAULT_THERMAL}
                  alt="Thermal Detection"
                  className="w-full h-full object-cover rounded-lg opacity-75"
                />
              </div>
            </div>
          </div>

          {/* Audio Detection */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center gap-2 p-4 border-b border-gray-700">
              <Volume2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Audio Detection</h2>
            </div>
            <div className="p-4 text-center text-2xl font-medium">
              {audioStatus}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
