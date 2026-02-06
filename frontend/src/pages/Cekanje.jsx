import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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

  const [infoText, setInfoText] = useState(
  "Odaberite dan i kliknite na tačku na grafikonu za detalje."
);
const [selectedIndex, setSelectedIndex] = useState(null);

  const chartData = {
  labels: data.map(d => `${d.hour}:00`),
  datasets: [
    {
      label: "Procijenjeno čekanje (min)",
      data: data.map(d => d.avg_wait),
      borderColor: "white",
      backgroundColor: "rgba(255,255,255,0.3)",
      tension: 0.3,

      pointRadius: data.map((_, i) =>
        i === selectedIndex ? 7 : 4
      ),

      pointBackgroundColor: data.map((_, i) =>
        i === selectedIndex ? "white" : "#3a3485"
      ),

      pointBorderColor: data.map((_, i) =>
        i === selectedIndex ? "white" : "white"
      ),

      pointBorderWidth: data.map((_, i) =>
        i === selectedIndex ? 3 : 1
      )
    }
  ]
};

const location = useLocation();
const departmentName = location.state?.departmentName;

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#3a3485",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "10px 26px",
          borderRadius: "30px",
          border: "2px solid white",
          background: "transparent",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        Nazad
      </button>

      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="/Slike/Logo-KCUS_featured.png"
          alt="Logo"
          style={{
            maxWidth: "200px",
            width: "100%",
            height: "auto",
            marginBottom: "-40px"
          }}
        />
      </div>

      <h1 style={{ textAlign: "center", fontSize: "0.8rem" }}>
        INFORMACIONI SISTEM
      </h1>
      <hr
        style={{
          border: "2px solid white",
          width: "80%",
          margin: "20px auto"
        }}
      />

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 2px 60%",
          gap: "20px",
          alignItems: "flex-start"
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          <h3>{departmentName}</h3>
          <p>
            Odjel radi u periodu od 08:00 do 16:00. Sa desne strane možete vidjeti koliko dugo pacijenti u prosjeku čekaju na pregled.

          </p>
          <p>{infoText}</p>
        </div>

        {/* DIVIDER */}
        <div style={{ background: "white", height: "100%" }} />

        {/* RIGHT COLUMN */}
        <div>
          <h2>Procjena vremena čekanja</h2>

      <select
        value={day}
        onChange={e => setDay(e.target.value)}
        style={{
         padding: "10px 26px",
          maxWidth: "100%",
          minWidth: 0,  
          borderRadius: "30px",
          border: "2px solid white",
          background: "transparent",
          backgroundColor: "#3a3485",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer",
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
            },
            onClick: (event, elements) => {
              if (!elements.length) return;

              const index = elements[0].index;
              const wait = data[index].avg_wait;

              setSelectedIndex(index);

              if (wait < 25) {
                setInfoText("Čekanje je kratko. Preporučuje se dolazak u ovom terminu.");
              } else if (wait <= 50) {
                setInfoText("Umjereno čekanje. Moguća su manja zadržavanja.");
              } else {
                setInfoText("Dugo čekanje. Ako je moguće, izaberite drugi termin.");
              }
            }
          }}
        />

      )}
        </div>
      </div>
    </div>
  );
}
