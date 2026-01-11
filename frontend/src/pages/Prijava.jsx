import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Prijava() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [sifra, setSifra] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Šifra tačno 4 karaktera
    if (sifra.length !== 4) {
      alert("Greška: šifra mora imati tačno 4 karaktera!");
      return;
    }

    // Provjera email formata
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Unesite ispravan email!");
      return;
    }

    // Provjera da su sva polja unesena
    if (!ime || !prezime || !email) {
      alert("Molimo popunite sva polja!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/prijava", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ime, prezime, email, sifra })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Nepostojeći korisnik!");
      } else {
        alert(data.message);
        if (data.message === "Prijava uspješna") {
	  localStorage.setItem("isLoggedIn", "true");
	  localStorage.setItem("userRole", data.userRole);
// uloga = "student" ili "pacijent"
          navigate("/");
        }
      }
    } catch (error) {
      alert("Greška prilikom spajanja na server: " + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#3a3485",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Dugme Nazad */}
      <div
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          padding: "10px 26px",
          borderRadius: "30px",
          border: "2px solid white",
          background: "transparent",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        Nazad
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#2f2a70",
          padding: "40px",
          borderRadius: "20px",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Prijava</h2>

        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Prezime"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        {/* Password input sa show/hide */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="●●●●"
            value={sifra}
            onChange={(e) => setSifra(e.target.value.slice(0, 4))}
            maxLength={4}
            required
            style={{
              width: "100%",
              padding: "10px 40px 10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              boxSizing: "border-box"
            }}
          />

          {/* Show / Hide dugme */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.3rem",
              color: "#333"
            }}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {sifra.length > 0 && sifra.length !== 4 && (
          <span style={{ color: "#ffb3b3", fontSize: "0.85rem" }}>
            Šifra mora imati tačno 4 karaktera!
          </span>
        )}

        <button type="submit" style={buttonStyle}>
          Prijavi se
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  fontSize: "1rem"
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "20px",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  background: "white",
  color: "#3a3485",
  fontWeight: "bold"
};
