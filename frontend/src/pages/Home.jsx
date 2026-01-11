import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiMap, BiPaste, BiCog, BiBook } from "react-icons/bi";

export default function Home() {
  const navigate = useNavigate();

  // --- stanje prijave i uloga
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // "student" ili "pacijent"

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(logged);
    setUserRole(role);
  }, []);

  // --- Definicija dugmadi i uloga kojima su dostupna
  const buttons = [
    { icon: <BiMap size={80} />, text: "Informacije o odjelima", path: "/odjeli", allowedRoles: ["student", "pacijent", null] },
    { icon: <BiPaste size={80} />, text: "Pregled nalaza", path: "/nalazi", allowedRoles: ["pacijent"] },
    { icon: <BiBook size={80} />, text: "Studentska stranica", path: "/studentska", allowedRoles: ["student"] },
    { icon: <BiCog size={80} />, text: "Opcije", path: "/opcije", allowedRoles: ["student", "pacijent", null] }
  ];

  // --- Funkcija koja provjerava da li dugme treba biti enabled
 const isButtonEnabled = (allowedRoles) => {
  if (!isLoggedIn && allowedRoles.includes(null)) return true;
  if (isLoggedIn && allowedRoles.includes(userRole)) return true;
  return false;
};





  return (
    <div style={{ padding: "40px", color: "white", background: "#3a3485", minHeight: "100vh", position: "relative" }}>
      
      {/* Top-right dugmad */}
      <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "12px" }}>
        {!isLoggedIn && (
          <>
            <button onClick={() => navigate("/prijava")} style={topButtonStyle}>Prijava</button>
            <button onClick={() => navigate("/registracija")} style={topButtonStyle}>Registracija</button>
          </>
        )}
        {isLoggedIn && (
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userRole");
              setIsLoggedIn(false);
              setUserRole(null);
            }}
            style={topButtonStyle}
          >
            Odjavi se
          </button>
        )}
      </div>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/Slike/Logo-KCUS_featured.png" alt="Logo" style={{ maxWidth: "200px", width: "100%", height: "auto", marginBottom: "-40px" }} />
      </div>

      <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "0.8rem", marginBottom: "10px" }}>INFORMACIONI SISTEM</h1>
      <hr style={{ border: "2px solid white", width: "80%", margin: "0 auto 30px auto" }} />
      <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "30px" }}>Odaberite jednu od opcija:</h1>

      {/* Grid dugmadi */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: "15px", width: "90vw", height: "50vh", margin: "0 auto" }}>
        {buttons.map((b, i) => {
          const enabled = isButtonEnabled(b.allowedRoles);
          return (
            <button
              key={i}
              onClick={() => enabled && navigate(b.path)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                background: enabled ? "#3a3485" : "#888888",
                color: enabled ? "white" : "#ccc",
                borderRadius: "20px", // zaobljeni
                border: "4px solid white",
                fontFamily: "Arial, sans-serif",
                fontSize: "1.5rem",
                width: "100%",
                height: "100%",
                padding: "0 20px",
                cursor: enabled ? "pointer" : "not-allowed",
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
