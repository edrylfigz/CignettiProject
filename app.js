const { useEffect, useState } = React;

const TARGET = 100;

const stations = [
  { name: "S4 Design FDC", fpy: 73, slides: [3, 4] },
  { name: "S10 SCV", fpy: 92, slides: [5, 6] },
  { name: "M1 Install", fpy: 97, slides: [7, 8] },
  { name: "S14 Final Inspection", fpy: 72, slides: [9, 10] },
  { name: "M2 Activation", fpy: 97, slides: [11, 12] }
];

function getStatus(fpy) {
  if (fpy < 90) return "critical";
  if (fpy < 97) return "warning";
  return "ok";
}

function getColor(status) {
  if (status === "critical") return "text-red-500";
  if (status === "warning") return "text-yellow-400";
  return "text-green-400";
}

function getBg(status) {
  if (status === "critical") return "bg-red-900 animate-pulse";
  if (status === "warning") return "bg-yellow-900";
  return "bg-green-900";
}

function Dashboard() {
  const [stationIdx, setStationIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);

  const station = stations[stationIdx];
  const status = getStatus(station.fpy);
  const slide = station.slides[slideIdx];

  // cycle slides (FPY ↔ Pareto)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % station.slides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [stationIdx]);

  // cycle stations
  useEffect(() => {
    const stationTimer = setInterval(() => {
      setStationIdx((prev) => (prev + 1) % stations.length);
      setSlideIdx(0);
    }, 10000);

    return () => clearInterval(stationTimer);
  }, []);

  // auto refresh
  useEffect(() => {
    const refresh = setInterval(() => {
      location.reload();
    }, 60000);

    return () => clearInterval(refresh);
  }, []);

  return (
    <div className="bg-black text-white h-screen w-screen flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">ANDON QUALITY DASHBOARD</h1>
        <div className="text-sm text-gray-400">LIVE MONITOR</div>
      </div>

      {/* KPI BAR */}
      <div className="grid grid-cols-5 gap-4 p-4">
        {stations.map((s, i) => {
          const sStatus = getStatus(s.fpy);
          return (
            <div
              key={i}
              className={`rounded-2xl p-4 shadow-lg ${getBg(sStatus)} ${i === stationIdx ? "border-2 border-cyan-400" : ""}`}>
              <p className="text-sm text-gray-300">{s.name}</p>
              <p className={`text-3xl font-bold ${getColor(sStatus)}`}>{s.fpy}%</p>
            </div>
          );
        })}
      </div>

      {/* MAIN */}
      <div className="flex flex-1 p-4 gap-4">

        {/* LEFT PANEL */}
        <div className="w-1/4 bg-gray-900 rounded-2xl p-4 flex flex-col justify-between">

          <div>
            <h2 className="text-xl">Active Station</h2>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{station.name}</p>

            <h2 className="mt-6">FPY</h2>
            <p className={`text-5xl font-bold ${getColor(status)}`}>
              {station.fpy}%
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Gap to Target: {station.fpy - TARGET}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">View</p>
            <p className="text-lg">{slideIdx === 0 ? "FPY" : "Pareto"}</p>
          </div>

        </div>

        {/* VISUAL */}
        <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden">
          <iframe
            key={slide}
            src={`dashboard.pdf#page=${slide}&zoom=page-fit&t=${Date.now()}`}
            className="w-full h-full"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="px-6 py-2 border-t border-gray-700 text-sm text-gray-400 flex justify-between">
        <span>Target FPY: 100%</span>
        <span>Auto Refresh: ON</span>
      </div>

    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);