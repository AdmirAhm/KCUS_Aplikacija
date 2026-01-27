import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiFace } from "react-icons/bi";


export default function Odjeli() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/odjeli")
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selected) {
      fetch(`http://localhost:8000/odjeli/${selected}`)
        .then(res => res.json())
        .then(data => setInfo(data))
        .catch(err => console.log(err));
    }
  }, [selected]);

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
          margin: "0 auto 30px auto"
        }}
      />

      {/* ===== TWO COLUMN LAYOUT STARTS HERE ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 2px 60%",
          gap: "20px",
          background:"#3a3485",
          alignItems: "flex-start"
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          <h2>Odaberite odjel:</h2>

          <select
            onChange={e => setSelected(e.target.value)}
            value={selected || ""}
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
            <option value="" disabled>Odaberite...</option>
            {departments.map(d => (
              <option key={d.ID} value={d.ID}>{d.naziv}</option>
            ))}
          </select>

          {info && (
  <>
    <h3 style={{ marginTop: "20px" }}>{info.naziv}</h3>
    <p>{info.opis}</p>

    <p><strong>Zaposlenici:</strong></p>

    {info.zaposlenici && info.zaposlenici.length > 0 ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {info.zaposlenici.map((z) => (
          <div
  key={z.ID}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "6px"
  }}
>
  <BiFace size={200} />
  <p style={{ margin: 0, textAlign: "center" }}>
    {z.ime_prezime}
  </p>
</div>

        ))}
      </div>
    ) : (
      <p>—</p>
    )}
  </>
)}

        </div>

        {/* VERTICAL DIVIDER */}
        <div style={{ background: "white", height: "100%" }} />

        {/* RIGHT COLUMN (BIGGER) */}
        <div>
          {info && (
            <>
              {/* MAP */}
              <img
                src={info.slika}
                alt="Mapa"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  marginBottom: "20px",
                  borderRadius: "6px"
                }}
              />

              {/* UPUTSTVO */}
              <div>
                <h3>Uputstvo</h3>
                <p>{info.uputstva}</p>
              </div>
              <button
                onClick={() => navigate("/cekanje")}
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
                Čekanje
              </button>
            </>
          )}
        </div>
      </div>
      {/* ===== TWO COLUMN LAYOUT ENDS HERE ===== */}
    </div>
  );
}
