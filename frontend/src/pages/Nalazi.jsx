import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const shouldAddButton = (status) => {
  switch (status) {
    case 0:
      return false
    case 1:
      return true
    case 2:
      return false
    default:
      return false
  }
};

export default function Nalazi() {
  const navigate = useNavigate();
  const [nalazi, setNalazi] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    fetch(`http://localhost:8000/nalazi?user=${userID}`)
      .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
      })
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
                  display: "flex", // make it a flex container
                  backgroundColor: "#3a3485",
                  border: "4px solid white",
                  borderRadius: "50px",
                  marginBottom: "15px",
                  overflow: "hidden",
                  color: "white",
                }}
              >
                {/* Left part - 60% */}
                <div style={{ flex: 6, padding: "20px" }}>
                  <p style={{ fontSize: "1.8rem" }}>
                    <strong>{n.datum}</strong>
                  </p>
                  <p>
                    <strong>Opis:</strong> {n.opis}
                  </p>
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "4px solid white",
                      borderRadius: "20px",
                      padding: "10px",
                      width: "60%",
                      color: getBgColor(n.status),
                    }}
                  >
                    <p>
                      <strong>{getStatusText(n.status)}</strong>
                    </p>
                  </div>
                </div>

                {/* Right part - 40%, only if shouldAddButton returns true */}
                {shouldAddButton(n.status) && (
                  <button
                    
                    onClick={()=>alert("Nalaz je uspješno poslan na Vašu email adresu")}
                    style={{
                      flex: 4,
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "20px",
                      color: "#3a3485", // text color for contrast
                      cursor: "pointer"
                    }}
                  >
                    
                    {/* You can put a button or anything here */}
                    <p style={{color: getBgColor(n.status), fontSize: "1.2rem"}}>
                      <strong>Preuzmite nalaz</strong>
                    </p>
                  </button>
                )}
              </div>

            ))
          )}
        </div>
      </div>
    </div>
  );
}
