import { useEffect, useState } from "react";

export default function Termini() {
  const [termini, setTermini] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    fetch(`http://localhost:8000/termini?user=${userID}`)
      .then(res => res.json())
      .then(data => setTermini(data))
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
      <h1 style={{ textAlign: "center" }}>Termini</h1>

      {termini.length === 0 ? (
        <p>Nema dostupnih termina.</p>
      ) : (
        termini.map((t, i) => (
        <div>
          <div
  key={i}
  style={{
    display: "flex",
    backgroundColor: t.otkazano ? "#e74c3c" : "#3a3485",
    color: "white",
    borderRadius: "50px",
    border: "4px solid white",
    marginBottom: t.otkazano ? "-4px" : "15px",
    overflow: "hidden",
    fontSize: "1.2rem"
  }}
>
  {/* LEFT 70% – SUBJECT + GROUP */}
  <div
    style={{
      width: "70%",
      padding: "15px",
      display: "flex",
      alignItems: "center"
    }}
  >
    <strong>{t.predmet} ({t.grupa})</strong>
  </div>

  {/* RIGHT 30% – TIME (WHITE) */}
  <div
    style={{
      width: "30%",
      backgroundColor: "white",
      borderRadius: "50px",
      color: "#3a3485",
      borderTopLeftRadius: "50px",
      padding: "15px",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    }}
  >
    <strong>{t.vrijeme}</strong>
  </div>
</div>

          {t.otkazano === 1 && t.alternatives.length > 0 && (
              <div
                style={{
                  paddingTop: "0px",
                  marginRight: "60%",
                  marginLeft: "5%",
                  marginBottom: "15px",
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  padding: "10px",
                  background: "#e74c3c",
                  border: "4px solid white",
                  borderRadius: "50px"
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>
                  <strong>Alternativni termini:</strong>
                </p>

                {t.alternatives.map((a, j) => (
                  <p key={j} style={{ fontSize: "1.2rem" }}>
                    {a.grupa} – {a.vrijeme}
                  </p>
                ))}
              </div>
            )}
            </div>
        ))
      )}
    </div>
  );
}
