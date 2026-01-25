import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const days = [
  { value: 1, label: "Ponedjeljak" },
  { value: 2, label: "Utorak" },
  { value: 3, label: "Srijeda" },
  { value: 4, label: "Četvrtak" },
  { value: 5, label: "Petak" },
  { value: 6, label: "Subota" },
  { value: 7, label: "Nedjelja" }
];

export default function Cekanje() {
  const [day, setDay] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!day) return;

    fetch(`http://localhost:8000/wait-estimate?day=${day}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [day]);

  const chartData = {
    labels: data.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: "Procijenjeno čekanje (min)",
        data: data.map(d => d.avg_wait),
        borderColor: "white",
        backgroundColor: "rgba(255,255,255,0.3)",
        tension: 0.3
      }
    ]
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#3a3485",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h2>Procjena vremena čekanja</h2>

      <select
        value={day}
        onChange={e => setDay(e.target.value)}
        style={{
          padding: "10px 20px",
          borderRadius: "20px",
          border: "2px solid white",
          background: "transparent",
          color: "white",
          fontSize: "1rem",
          marginBottom: "20px"
        }}
      >
        <option value="">Odaberite dan</option>
        {days.map(d => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {data.length > 0 && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { labels: { color: "white" } }
            },
            scales: {
              x: { ticks: { color: "white" } },
              y: { ticks: { color: "white" } }
            }
          }}
        />
      )}
    </div>
  );
}
