const { useEffect, useState } = React;

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
  const [stations, setStations] = useState([]);
  const [stationIdx, setStationIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);

  // ✅ LOAD JSON DATA
  useEffect(() => {
    fetch("data.json?t=" + Date.now())
      .then(res => res.json())
      .then(data => setStations(data.stations));
  }, []);

  if (stations.length === 0) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const station = stations[stationIdx];
  const status = getStatus(station.fpy);
  const slide = station.slides[slideIdx];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % station.slides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [stationIdx]);

  useEffect(() => {
    const stationTimer = setInterval(() => {
      setStationIdx((prev) => (prev + 1) % stations.length);
      setSlideIdx(0);
    }, 10000);

    return () => clearInterval(stationTimer);
  }, [stations]);

  useEffect(() => {
    const refresh = setInterval(() => location.reload(), 60000);
    return () => clearInterval(refresh);
  }, []);

  return (
    <div className="bg-black text-white h-screen w-screen flex flex-col">
      <div className="grid grid-cols-5 p-4 gap-4">
        {stations.map((s, i) => {
          const sStatus = getStatus(s.fpy);
          return (
            <div key={i} className={`p-4 rounded-xl ${getBg(sStatus)}`}>
              <p>{s.name}</p>
              <p className={`text-3xl ${getColor(sStatus)}`}>{s.fpy}%</p>
            </div>
          );
        })}
      </div>

      <iframe
        src={`dashboard.pdf#page=${slide}&t=${Date.now()}`}
        className="flex-1 w-full"
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
