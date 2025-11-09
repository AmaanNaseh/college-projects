import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

//const backend_API = "http://localhost:5000";
const backend_API = "https://scada-energy-optimizer.onrender.com";

const App = () => {
  const [inputValues, setInputValues] = useState({
    temperature: 30,
    humidity: 50,
    wind_speed: 10,
    solar_radiation: 300,
    occupancy: 20,
    hours: 1,
  });

  const [optimizedEnergy, setOptimizedEnergy] = useState(null);
  const [targetFunction, setTargetFunction] = useState("");
  const [hourlyData, setHourlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState("READY");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: Number(value) });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setSystemStatus("PROCESSING");
    const { hours, ...energyParams } = inputValues;

    fetch(`${backend_API}/optimize_energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(energyParams),
    })
      .then((res) => res.json())
      .then((data) => {
        const kwh = data.optimized_energy;
        setOptimizedEnergy(kwh);
        setTargetFunction(data.target_function);

        const simulated = Array.from({ length: hours }, (_, i) => ({
          hour: i + 1,
          energy: Number(kwh.toFixed(2)),
          name: `H${i + 1}`,
        }));
        setHourlyData(simulated);
        setSystemStatus("OPTIMIZED");
      })
      .catch((err) => {
        console.error("Error:", err);
        setSystemStatus("ERROR");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const totalConsumption =
    optimizedEnergy !== null
      ? (optimizedEnergy * inputValues.hours).toFixed(2)
      : null;

  // Gauge data for radial charts
  const createGaugeData = (value, max, name) => [
    {
      name,
      value,
      fill:
        value > max * 0.8
          ? "#ef4444"
          : value > max * 0.6
          ? "#eab308"
          : "#22c55e",
    },
  ];

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 p-4"
      style={{ fontFamily: "system-ui" }}
    >
      {/* HMI Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-lg mb-4 p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center border-2 border-blue-400 shadow-lg shadow-blue-500/50">
                  <svg
                    className="w-10 h-10 text-white"
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
                <div
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                    systemStatus === "OPTIMIZED"
                      ? "bg-green-500"
                      : systemStatus === "PROCESSING"
                      ? "bg-yellow-500 animate-pulse"
                      : systemStatus === "ERROR"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } border-2 border-slate-900`}
                />
              </div>
              <div>
                <h1 className="text-yellow-400 tracking-wider">
                  ENERGY OPTIMIZATION SYSTEM
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  AI-Powered HMI Control Interface v2.1
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="text-right">
              <div className="text-green-400 font-mono">{currentTime}</div>
              <div className="text-slate-500 text-xs">{currentDate}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-slate-500 mb-1">SYSTEM STATUS</div>
              <div
                className={`px-4 py-1 rounded font-mono text-sm ${
                  systemStatus === "OPTIMIZED"
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : systemStatus === "PROCESSING"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 animate-pulse"
                    : systemStatus === "ERROR"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                }`}
              >
                {systemStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel - Environmental Sensors */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Environmental Parameters Panel */}
          <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-2 border-b-2 border-blue-600">
              <h2 className="text-yellow-400 tracking-wide flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                ENVIRONMENTAL SENSORS
              </h2>
            </div>

            <div className="p-4 space-y-4">
              {/* Temperature */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      TEMPERATURE
                    </span>
                  </div>
                  <span className="text-orange-400 font-mono">
                    {inputValues.temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  name="temperature"
                  value={inputValues.temperature}
                  onChange={handleChange}
                  min="-20"
                  max="50"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-orange"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>-20</span>
                  <span>50</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      HUMIDITY
                    </span>
                  </div>
                  <span className="text-blue-400 font-mono">
                    {inputValues.humidity}%
                  </span>
                </div>
                <input
                  type="range"
                  name="humidity"
                  value={inputValues.humidity}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-blue"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      WIND SPEED
                    </span>
                  </div>
                  <span className="text-cyan-400 font-mono">
                    {inputValues.wind_speed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  name="wind_speed"
                  value={inputValues.wind_speed}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-cyan"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Solar Radiation */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      SOLAR RADIATION
                    </span>
                  </div>
                  <span className="text-yellow-400 font-mono">
                    {inputValues.solar_radiation} W/m²
                  </span>
                </div>
                <input
                  type="range"
                  name="solar_radiation"
                  value={inputValues.solar_radiation}
                  onChange={handleChange}
                  min="0"
                  max="1000"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-yellow"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0</span>
                  <span>1000</span>
                </div>
              </div>

              {/* Occupancy */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      OCCUPANCY
                    </span>
                  </div>
                  <span className="text-purple-400 font-mono">
                    {inputValues.occupancy} people
                  </span>
                </div>
                <input
                  type="range"
                  name="occupancy"
                  value={inputValues.occupancy}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-purple"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0</span>
                  <span>200</span>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs tracking-wider">
                      DURATION
                    </span>
                  </div>
                  <span className="text-green-400 font-mono">
                    {inputValues.hours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  name="hours"
                  value={inputValues.hours}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>1</span>
                  <span>24</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-green-900 to-green-800 px-4 py-2 border-b-2 border-green-600">
              <h2 className="text-yellow-400 tracking-wide flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                CONTROL PANEL
              </h2>
            </div>
            <div className="p-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-lg font-mono tracking-wider transition-all duration-300 ${
                  isLoading
                    ? "bg-yellow-600 text-slate-900 cursor-wait"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-500/50"
                } border-2 border-green-400`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    OPTIMIZE ENERGY
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Center & Right Panel - Monitoring & Analytics */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Energy Metrics Display */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Consumption */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-green-900 to-green-800 px-4 py-2 border-b-2 border-green-600">
                <h3 className="text-yellow-400 text-xs tracking-wider">
                  TOTAL CONSUMPTION
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  {totalConsumption ? (
                    <>
                      <div
                        className="text-green-400 font-mono mb-2"
                        style={{ fontSize: "3rem", lineHeight: 1 }}
                      >
                        {totalConsumption}
                      </div>
                      <div className="text-slate-500 tracking-wider">kWh</div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-slate-400 text-xs">
                          DURATION: {inputValues.hours} HOURS
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8">
                      <div className="text-slate-600 text-xl">---.--</div>
                      <div className="text-slate-700 text-xs mt-2">
                        AWAITING DATA
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-2 border-b-2 border-blue-600">
                <h3 className="text-yellow-400 text-xs tracking-wider">
                  HOURLY RATE
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  {optimizedEnergy !== null ? (
                    <>
                      <div
                        className="text-blue-400 font-mono mb-2"
                        style={{ fontSize: "3rem", lineHeight: 1 }}
                      >
                        {optimizedEnergy.toFixed(2)}
                      </div>
                      <div className="text-slate-500 tracking-wider">kWh/h</div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-slate-400 text-xs">
                          OPTIMIZED RATE
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8">
                      <div className="text-slate-600 text-xl">---.--</div>
                      <div className="text-slate-700 text-xs mt-2">
                        AWAITING DATA
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Monitoring Chart */}
          {hourlyData.length > 0 && (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-cyan-900 to-cyan-800 px-4 py-2 border-b-2 border-cyan-600">
                <h2 className="text-yellow-400 tracking-wide flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  REAL-TIME ENERGY MONITORING
                </h2>
              </div>
              <div className="p-6 bg-slate-800/30">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient
                        id="energyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22d3ee"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22d3ee"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#94a3b8",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #22d3ee",
                        borderRadius: "4px",
                        color: "#22d3ee",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="energy"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      fill="url(#energyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Optimization Function Display */}
          {targetFunction && (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-900 to-purple-800 px-4 py-2 border-b-2 border-purple-600">
                <h2 className="text-yellow-400 tracking-wide flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  OPTIMIZATION ALGORITHM
                </h2>
              </div>
              <div className="p-4">
                <div className="bg-slate-950 border border-cyan-500/30 rounded p-4 font-mono text-xs text-cyan-400 overflow-x-auto">
                  {targetFunction}
                </div>
              </div>
            </div>
          )}

          {/* Sensor Gauges */}
          <div className="grid grid-cols-3 gap-4">
            {/* Temperature Gauge */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-orange-900 to-orange-800 px-3 py-1.5 border-b-2 border-orange-600">
                <h3 className="text-yellow-400 text-xs tracking-wider text-center">
                  TEMP GAUGE
                </h3>
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={10}
                    data={createGaugeData(
                      inputValues.temperature + 20,
                      70,
                      "Temp"
                    )}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 70]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-orange-400"
                      style={{ fontSize: "1.5rem", fontFamily: "monospace" }}
                    >
                      {inputValues.temperature}°
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Humidity Gauge */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 border-b-2 border-blue-600">
                <h3 className="text-yellow-400 text-xs tracking-wider text-center">
                  HUMIDITY
                </h3>
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={10}
                    data={createGaugeData(
                      inputValues.humidity,
                      100,
                      "Humidity"
                    )}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-blue-400"
                      style={{ fontSize: "1.5rem", fontFamily: "monospace" }}
                    >
                      {inputValues.humidity}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wind Gauge */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-cyan-900 to-cyan-800 px-3 py-1.5 border-b-2 border-cyan-600">
                <h3 className="text-yellow-400 text-xs tracking-wider text-center">
                  WIND SPEED
                </h3>
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={10}
                    data={createGaugeData(inputValues.wind_speed, 100, "Wind")}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-cyan-400"
                      style={{ fontSize: "1.25rem", fontFamily: "monospace" }}
                    >
                      {inputValues.wind_speed}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #0f172a;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #0f172a;
        }
        
        .slider-orange::-webkit-slider-thumb {
          background: #f97316;
        }
        .slider-orange::-moz-range-thumb {
          background: #f97316;
        }
        
        .slider-blue::-webkit-slider-thumb {
          background: #3b82f6;
        }
        .slider-blue::-moz-range-thumb {
          background: #3b82f6;
        }
        
        .slider-cyan::-webkit-slider-thumb {
          background: #06b6d4;
        }
        .slider-cyan::-moz-range-thumb {
          background: #06b6d4;
        }
        
        .slider-yellow::-webkit-slider-thumb {
          background: #eab308;
        }
        .slider-yellow::-moz-range-thumb {
          background: #eab308;
        }
        
        .slider-purple::-webkit-slider-thumb {
          background: #a855f7;
        }
        .slider-purple::-moz-range-thumb {
          background: #a855f7;
        }
        
        .slider-green::-webkit-slider-thumb {
          background: #22c55e;
        }
        .slider-green::-moz-range-thumb {
          background: #22c55e;
        }
      `}</style>
    </div>
  );
};

export default App;
