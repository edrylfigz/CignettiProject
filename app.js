const { useState, useEffect } = React;

const TARGET = 100;

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

function Dashboard() {
  const [stations, setStations] = useState([]);
  const [stationIdx, setStationIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);

  // load JSON
  useEffect(() => {
    fetch("data.json?t=" + Date.now())
      .then(res => res.json())
      .then(data => setStations(data.stations));
  }, []);

  if (stations.length === 0) {
    return React.createElement("div", { className: "p-10 text-white" }, "Loading...");
  }

  const station = stations[stationIdx];
  const status = getStatus(station.fpy);
  const slide = station.slides[slideIdx];

  // slide cycle
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % station.slides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [stationIdx]);

  // station cycle
  useEffect(() => {
    const stationTimer = setInterval(() => {
      setStationIdx(prev => (prev + 1) % stations.length);
      setSlideIdx(0);
    }, 10000);

    return () => clearInterval(stationTimer);
  }, [stations]);

  // auto refresh
  useEffect(() => {
    const refresh = setInterval(() => location.reload(), 60000);
    return () => clearInterval(refresh);
  }, []);

  return React.createElement(
    "div",
    { className: "h-screen w-screen flex flex-col bg-black text-white" },

    // HEADER
    React.createElement(
      "div",
      { className: "flex justify-between px-6 py-4 border-b border-gray-700" },
      React.createElement("h1", { className: "text-xl font-bold" }, "ANDON QUALITY DASHBOARD"),
      React.createElement("span", { className: "text-gray-400" }, "LIVE")
    ),

    // KPI BAR
    React.createElement(
      "div",
      { className: "grid grid-cols-5 gap-4 p-4" },
      stations.map((s, i) => {
        const sStatus = getStatus(s.fpy);

        return React.createElement(
          "div",
          {
            key: i,
            className: `p-4 rounded-lg ${i === stationIdx ? "border-2 border-cyan-400" : ""}`
          },
          React.createElement("p", null, s.name),
          React.createElement(
            "p",
            { className: `text-2xl ${getColor(sStatus)}` },
            s.fpy + "%"
          )
        );
      })
    ),

    // MAIN
    React.createElement(
      "div",
      { className: "flex flex-1 p-4 gap-4" },

      // SIDE PANEL
      React.createElement(
        "div",
        { className: "w-1/4 bg-gray-900 rounded-xl p-4" },
        React.createElement("h2", null, "Station"),
        React.createElement("p", { className: "text-xl text-cyan-400" }, station.name),
        React.createElement("p", { className: "text-4xl mt-4" }, station.fpy + "%"),
        React.createElement("p", { className: "text-gray-400" }, "Gap: " + (station.fpy - TARGET) + "%")
      ),

      // VIEWER
      React.createElement("iframe", {
        src: `dashboard.pdf#page=${slide}&t=${Date.now()}`,
        className: "flex-1 bg-black rounded-xl"
      })
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(Dashboard)
);
