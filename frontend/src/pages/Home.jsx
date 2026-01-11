import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMap, BiPaste, BiCog, BiBook } from "react-icons/bi";

export default function Home() {
  const navigate = useNavigate();

  // On mount, disable scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const buttons = [
    { icon: <BiMap size={80} />, text: "Informacije o odjelima" },
    { icon: <BiPaste size={80} />, text: "Pregled nalaza" },
    { icon: <BiBook size={80} />, text: "Studentska stranica" },
    { icon: <BiCog size={80} />, text: "Opcije" }
  ];

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        background: "#3a3485",
        minHeight: "100vh",
        position: "relative" // potrebno za top-right dugmad
      }}
    >
      {/* Top-right dugmad */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "12px"
        }}
      >
        <button
          onClick={() => navigate("/prijava")}
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
          Prijava
        </button>

        <button
          onClick={() => navigate("/registracija")}
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
          Registracija
        </button>
      </div>

      {/* Logo */}
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

      {/* Naslov */}
      <h1
        style={{
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: "0.8rem",
          marginBottom: "10px"
        }}
      >
        INFORMACIONI SISTEM
      </h1>

      <hr
        style={{
          border: "2px solid white",
          width: "80%",
          margin: "0 auto 30px auto"
        }}
      />

      <h1
        style={{
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "30px"
        }}
      >
        Odaberite jednu od opcija:
      </h1>

      {/* Grid dugmadi */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "15px",
          width: "90vw",
          height: "50vh",
          margin: "0 auto"
        }}
      >
        {buttons.map((b, i) => (
          <button
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              background: "#3a3485",
              color: "white",
              borderRadius: "40px",
              border: "4px solid white",
              fontFamily: "Arial, sans-serif",
              fontSize: "1.5rem",
              width: "100%",
              height: "100%",
              padding: "0 20px",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            {b.icon}
            <span>{b.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
