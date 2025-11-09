// App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// const backendURL = "http://localhost:5000";
const backendURL = "https://automatic-tig-mig-welding.onrender.com";

export default function App() {
  const [form, setForm] = useState({
    mode: "0", // "0" TIG, "1" MIG
    current: 120,
    voltage: 22,
    wire_feed_speed: 5,
    travel_speed: 6,
    torch_angle: 5,
    gas_flow_rate: 12,
    material_thickness: 2,
    length_mm: 100,
    segments: 10,
  });

  const [result, setResult] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizing, setVisualizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sparks, setSparks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const callPredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        mode: Number(form.mode),
        current: Number(form.current),
        voltage: Number(form.voltage),
        wire_feed_speed: Number(form.wire_feed_speed),
        travel_speed: Number(form.travel_speed),
        torch_angle: Number(form.torch_angle),
        gas_flow_rate: Number(form.gas_flow_rate),
        material_thickness: Number(form.material_thickness),
      };
      const res = await axios.post(`${backendURL}/predict`, payload, {
        timeout: 10000,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.message || "Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  const callSimulate = async () => {
    setSimLoading(true);
    setError(null);
    setSimResult(null);
    try {
      const payload = {
        mode: Number(form.mode),
        current: Number(form.current),
        voltage: Number(form.voltage),
        wire_feed_speed: Number(form.wire_feed_speed),
        travel_speed: Number(form.travel_speed),
        torch_angle: Number(form.torch_angle),
        gas_flow_rate: Number(form.gas_flow_rate),
        material_thickness: Number(form.material_thickness),
        length_mm: Number(form.length_mm),
        segments: Number(form.segments),
      };
      const res = await axios.post(`${backendURL}/simulate`, payload, {
        timeout: 20000,
      });
      setSimResult(res.data);
    } catch (err) {
      setError(err.message || "Error calling simulation endpoint");
    } finally {
      setSimLoading(false);
    }
  };

  const startVisualization = () => {
    setVisualizing(true);
    setProgress(0);
  };

  const stopVisualization = () => {
    setVisualizing(false);
    setProgress(0);
  };

  // Progress animation
  useEffect(() => {
    let interval;
    if (visualizing) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setVisualizing(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [visualizing]);

  // Spark generation
  useEffect(() => {
    let interval;
    if (visualizing) {
      interval = setInterval(() => {
        setSparks((prev) => {
          const newSparks = Array.from({ length: 3 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 20 - 10,
            y: 0,
            opacity: 1,
          }));
          return [...prev.slice(-20), ...newSparks];
        });
      }, 100);
    } else {
      setSparks([]);
    }
    return () => clearInterval(interval);
  }, [visualizing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl text-white tracking-tight">
                Automatic TIG/MIG Welding of Stainless Steel Using Industrial
                Robot
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualization Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-white">Welding Simulation</h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      visualizing
                        ? "bg-green-500 animate-pulse"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-sm text-slate-400">
                    {visualizing ? "Active" : "Standby"}
                  </span>
                </div>
              </div>

              {/* Enhanced Visualization */}
              <div className="relative w-full aspect-video bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                {visualizing ? (
                  <div className="absolute inset-0">
                    {/* Stainless Steel Workpiece */}
                    <div className="absolute bottom-[20%] left-0 right-0 h-20">
                      <div className="absolute inset-x-0 h-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 shadow-2xl">
                        {/* Metal shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20" />

                        {/* Weld bead forming */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          preserveAspectRatio="none"
                          viewBox="0 0 1000 80"
                        >
                          <defs>
                            <linearGradient
                              id="weldGrad"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#78716c" />
                              <stop
                                offset={`${progress}%`}
                                stopColor="#ffc870"
                              />
                              <stop
                                offset={`${progress}%`}
                                stopColor="#94a3b8"
                              />
                              <stop offset="100%" stopColor="#64748b" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0,40 Q 100,36 200,40 T 400,40 T 600,40 T 800,40 T 1000,40"
                            fill="none"
                            stroke="url(#weldGrad)"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Welding progress line */}
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"
                          style={{ width: "20px" }}
                          initial={{ left: "0%" }}
                          animate={{ left: `${progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Robotic Arm */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 800 600"
                    >
                      <defs>
                        <linearGradient
                          id="armGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#64748b" />
                          <stop offset="50%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                        <radialGradient id="arcGlow">
                          <stop offset="0%" stopColor="#fff" />
                          <stop offset="30%" stopColor="#fbbf24" />
                          <stop offset="70%" stopColor="#f97316" />
                          <stop
                            offset="100%"
                            stopColor="#ea580c"
                            stopOpacity="0"
                          />
                        </radialGradient>
                        <filter id="glow">
                          <feGaussianBlur
                            stdDeviation="4"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {(() => {
                        const baseX = 150;
                        const baseY = 300;
                        const armAngle =
                          -60 + Math.sin((progress / 100) * Math.PI * 2) * 15;
                        const armLength = 180;
                        const elbowX =
                          baseX +
                          Math.cos((armAngle * Math.PI) / 180) * armLength;
                        const elbowY =
                          baseY +
                          Math.sin((armAngle * Math.PI) / 180) * armLength;

                        const forearmAngle =
                          armAngle +
                          90 +
                          Math.cos((progress / 100) * Math.PI * 4) * 20;
                        const forearmLength = 150;
                        const wristX =
                          elbowX +
                          Math.cos((forearmAngle * Math.PI) / 180) *
                            forearmLength;
                        const wristY =
                          elbowY +
                          Math.sin((forearmAngle * Math.PI) / 180) *
                            forearmLength;

                        const torchAngle = forearmAngle + 30;
                        const torchLength = 50;
                        const torchX =
                          wristX +
                          Math.cos((torchAngle * Math.PI) / 180) * torchLength;
                        const torchY =
                          wristY +
                          Math.sin((torchAngle * Math.PI) / 180) * torchLength;

                        return (
                          <g>
                            {/* Base */}
                            <rect
                              x={baseX - 20}
                              y={baseY - 30}
                              width="40"
                              height="30"
                              fill="#334155"
                              rx="5"
                            />

                            {/* Upper arm */}
                            <line
                              x1={baseX}
                              y1={baseY}
                              x2={elbowX}
                              y2={elbowY}
                              stroke="url(#armGrad)"
                              strokeWidth="20"
                              strokeLinecap="round"
                            />

                            {/* Elbow joint */}
                            <circle
                              cx={elbowX}
                              cy={elbowY}
                              r="15"
                              fill="#475569"
                              stroke="#64748b"
                              strokeWidth="2"
                            />

                            {/* Forearm */}
                            <line
                              x1={elbowX}
                              y1={elbowY}
                              x2={wristX}
                              y2={wristY}
                              stroke="url(#armGrad)"
                              strokeWidth="16"
                              strokeLinecap="round"
                            />

                            {/* Wrist */}
                            <circle
                              cx={wristX}
                              cy={wristY}
                              r="12"
                              fill="#475569"
                              stroke="#64748b"
                              strokeWidth="2"
                            />

                            {/* Welding torch */}
                            <line
                              x1={wristX}
                              y1={wristY}
                              x2={torchX}
                              y2={torchY}
                              stroke="#e11d48"
                              strokeWidth="10"
                              strokeLinecap="round"
                            />

                            {/* Torch nozzle */}
                            <circle
                              cx={torchX}
                              cy={torchY}
                              r="8"
                              fill="#9ca3af"
                              stroke="#6b7280"
                              strokeWidth="2"
                            />

                            {/* Welding arc */}
                            <motion.circle
                              cx={torchX}
                              cy={torchY}
                              r="35"
                              fill="url(#arcGlow)"
                              filter="url(#glow)"
                              animate={{
                                r: [30, 40, 30],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 0.3,
                                repeat: Infinity,
                              }}
                            />

                            {/* Bright core */}
                            <circle
                              cx={torchX}
                              cy={torchY}
                              r="6"
                              fill="#fff"
                              opacity="0.9"
                            />
                          </g>
                        );
                      })()}
                    </svg>

                    {/* Sparks */}
                    {sparks.map((spark) => (
                      <motion.div
                        key={spark.id}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                        style={{
                          left: `${progress * 0.8 + 10}%`,
                          bottom: "20%",
                          boxShadow: "0 0 4px 2px rgba(251, 191, 36, 0.6)",
                        }}
                        initial={{ y: 0, x: spark.x, opacity: 1 }}
                        animate={{
                          y: -50 - Math.random() * 30,
                          x: spark.x + (Math.random() - 0.5) * 40,
                          opacity: 0,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    ))}

                    {/* Progress display */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
                      <p className="text-sm text-white">
                        Progress: {progress}%
                      </p>
                    </div>

                    {/* Smoke effect */}
                    <motion.div
                      className="absolute left-1/2 bottom-[25%] w-24 h-24 bg-slate-500/20 rounded-full blur-2xl"
                      animate={{
                        y: [-10, -40],
                        scale: [1, 1.5],
                        opacity: [0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-20 h-20 text-slate-700 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <p className="text-slate-500">
                        Click "Visualize" to start welding simulation
                      </p>
                    </div>
                  </div>
                )}

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(100, 116, 139, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.5) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={callPredict}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {loading ? "Predicting..." : "Predict"}
                </button>

                <button
                  onClick={callSimulate}
                  disabled={simLoading}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {simLoading && (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {simLoading ? "Simulating..." : "Simulate Pass"}
                </button>

                {!visualizing ? (
                  <button
                    onClick={startVisualization}
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    Visualize
                  </button>
                ) : (
                  <button
                    onClick={stopVisualization}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Stop
                  </button>
                )}

                <button
                  onClick={() => {
                    setResult(null);
                    setSimResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-950/50 border border-red-900 rounded-xl p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-200">Error: {error}</p>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {result && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="text-xl text-white">Prediction Results</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Penetration</p>
                    <p className="text-2xl text-white">
                      {result.penetration_mm}{" "}
                      <span className="text-base text-slate-400">mm</span>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Bead Width</p>
                    <p className="text-2xl text-white">
                      {result.bead_width_mm}{" "}
                      <span className="text-base text-slate-400">mm</span>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">
                      Defect Probability
                    </p>
                    <p className="text-2xl text-white">
                      {(result.defect_probability * 100).toFixed(1)}
                      <span className="text-base text-slate-400">%</span>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        result.defect_label
                          ? "bg-red-500/20 text-red-300 border border-red-500"
                          : "bg-green-500/20 text-green-300 border border-green-500"
                      }`}
                    >
                      {result.defect_label ? "DEFECT" : "OK"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Results */}
            {simResult && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl text-white mb-2">Simulation Results</h2>
                <p className="text-slate-400 mb-4">
                  {simResult.segments} segments over {simResult.length_mm} mm
                </p>
                <div className="overflow-auto max-h-96 rounded-xl border border-slate-700">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800/50 sticky top-0">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Position (mm)
                        </th>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Travel Speed
                        </th>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Torch Angle
                        </th>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Penetration
                        </th>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Bead Width
                        </th>
                        <th className="text-left py-3 px-4 text-slate-300">
                          Defect Prob
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {simResult.simulation.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">
                            {row.position_mm}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {row.travel_speed}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {row.torch_angle}°
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {row.penetration_mm} mm
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {row.bead_width_mm} mm
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {(row.defect_probability * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Parameters Panel - 1 column */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl text-white mb-4">Welding Parameters</h2>

              <div className="space-y-4">
                {/* Mode */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Welding Mode
                  </label>
                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="0">TIG (Tungsten Inert Gas)</option>
                    <option value="1">MIG (Metal Inert Gas)</option>
                  </select>
                </div>

                {/* Current */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Current (A)
                  </label>
                  <input
                    name="current"
                    type="number"
                    value={form.current}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Voltage */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Voltage (V)
                  </label>
                  <input
                    name="voltage"
                    type="number"
                    value={form.voltage}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Wire Feed Speed */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Wire Feed Speed (mm/s)
                  </label>
                  <input
                    name="wire_feed_speed"
                    type="number"
                    value={form.wire_feed_speed}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Travel Speed */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Travel Speed (mm/s)
                  </label>
                  <input
                    name="travel_speed"
                    type="number"
                    value={form.travel_speed}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Torch Angle */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Torch Angle (deg)
                  </label>
                  <input
                    name="torch_angle"
                    type="number"
                    value={form.torch_angle}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Gas Flow Rate */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Gas Flow Rate (L/min)
                  </label>
                  <input
                    name="gas_flow_rate"
                    type="number"
                    value={form.gas_flow_rate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Material Thickness */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Material Thickness (mm)
                  </label>
                  <input
                    name="material_thickness"
                    type="number"
                    value={form.material_thickness}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h3 className="text-sm text-slate-300 mb-3">
                    Simulation Settings
                  </h3>

                  {/* Sim Length */}
                  <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-2">
                      Sim Length (mm)
                    </label>
                    <input
                      name="length_mm"
                      type="number"
                      value={form.length_mm}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Segments */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Segments
                    </label>
                    <input
                      name="segments"
                      type="number"
                      value={form.segments}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-blue-200">
                    Configure welding parameters and use{" "}
                    <strong>Predict</strong> for single-point analysis or{" "}
                    <strong>Simulate Pass</strong> for multi-segment simulation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
