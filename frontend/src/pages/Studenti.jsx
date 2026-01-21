import { BiUserCheck } from "react-icons/bi";
import { BiCalendar } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Studenti() {
  const navigate = useNavigate();



  // --- Definicija dugmadi i uloga kojima su dostupna
  const buttons = [
    { icon: <BiCalendar size={200} />, text: "Termini prakticne nastave", path: "/termini" },
    { icon: <BiUserCheck size={200} />, text: "Prijava na grupu", path: "/grupe" }
  ];




  return (
    <div style={{ padding: "40px", color: "white", background: "#3a3485", minHeight: "100vh", position: "relative" }}>
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
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/Slike/Logo-KCUS_featured.png" alt="Logo" style={{ maxWidth: "200px", width: "100%", height: "auto", marginBottom: "-40px" }} />
      </div>

      <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "0.8rem", marginBottom: "10px" }}>INFORMACIONI SISTEM</h1>
      <hr style={{ border: "2px solid white", width: "80%", margin: "0 auto 30px auto" }} />
      <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "30px" }}>Odaberite jednu od opcija:</h1>

      {/* Grid dugmadi */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(1, 1fr)", gap: "15px", width: "90vw", height: "50vh", margin: "0 auto" }}>
        {buttons.map((b, i) => {
          return (
            <button
              key={i}
              onClick={() => navigate(b.path)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                background: "#3a3485",
                color:"white",
                borderRadius: "20px", // zaobljeni
                border: "4px solid white",
                fontFamily: "Arial, sans-serif",
                fontSize: "1.5rem",
                width: "100%",
                height: "100%",
                padding: "0 20px",
                cursor:"pointer",
                boxSizing: "border-box"
              }}
            >
              {b.icon}
              <span>{b.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const topButtonStyle = {
  padding: "10px 26px",
  borderRadius: "30px",
  border: "2px solid white",
  background: "transparent",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer"
};
