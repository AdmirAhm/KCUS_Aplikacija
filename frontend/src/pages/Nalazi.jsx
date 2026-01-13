import { useEffect, useState } from "react";

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Obrada u toku";
    case 1:
      return "Nalaz spreman za preuzimanje";
    case 2:
      return "Nalaz preuzet";
    default:
      return "Nepoznat status";
  }
};

const getBgColor = (status) => {
  switch (status) {
    case 0:
      return "#e74c3c"; // red
    case 1:
      return "#2ecc71"; // green
    case 2:
      return "#3a3485"; // gray
    default:
      return "#3a3485";
  }
};

export default function Nalazi() {
  const [nalazi, setNalazi] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/nalazi")
      .then(res => res.json())
      .then(data => setNalazi(data))
      .catch(err => console.error(err));
  }, []);

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
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Moji nalazi
      </h1>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "45% 2px 45%",
          gap: "20px",
          alignItems: "flex-start"
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          <h3>Informacije</h3>
          <p>
            Ovdje možete provjeriti status vaših nalaza. Status nalaza može biti:

          </p>
          <ul>
            <li>Obrada u toku - Vaš nalaz se obrađuje i bit će spreman za preuzimanje u najskorijem roku.</li>
            <li>Nalaz spreman za preuzimanje - nalaz možete preuzeti kod svog doktora</li>
            <li>Nalaz preuzet</li>
          </ul>
          <p>
            Ukoliko niste u stanju lično preuzeti nalaz, pritiskom na tiplu "Online preuzimanje nalaza" možete uputiti zahtjev za preuzimanje nalaza putem e-mail adrese kojom ste se registrovali na aplikaciju.
          </p>
        </div>

        {/* DIVIDER */}
        <div style={{ background: "white", height: "100%" }} />

        {/* RIGHT COLUMN */}
        <div>
          {nalazi.length === 0 ? (
            <p>Nema dostupnih nalaza.</p>
          ) : (
            nalazi.map(n => (
              <div
                key={n.ID}
                style={{
                  backgroundColor: getBgColor(n.status),
                  border: "4px solid white",
                  borderRadius: "100px",
                  padding: "15px",
                  paddingLeft: "40px",
                  marginBottom: "15px"
                }}
              >
                <p><strong>Datum:</strong> {n.datum}</p>
                <p><strong>Opis:</strong> {n.opis}</p>
                <p>
                  <strong>Status:</strong> {getStatusText(n.status)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
