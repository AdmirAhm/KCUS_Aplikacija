import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Prijava() {
  const [ime, setIme] = useState("");
  const [sifra, setSifra] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    if (sifra.length !== 4) {
      alert("Greška: šifra mora imati tačno 4 karaktera!");
      return;
    }

    e.preventDefault();

    // Za sada samo provjera u konzoli
    console.log("Prijava:");
    console.log("Ime:", ime);
    console.log("Šifra:", sifra);

    alert("Prijava uspješna");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#3a3485",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
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

        {/* Ime input */}
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
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

          {/* Hint kada ništa nije uneseno */}
          {sifra.length === 0 && (
            <span style={{ fontSize: "0.85rem", color: "#ccc" }}>
              Unesite 4 karaktera
            </span>
          )}

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
            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>

        {/* Validacija */}
        {sifra.length > 0 && sifra.length !== 4 && (
          <span style={{ color: "#ffb3b3", fontSize: "0.85rem" }}>
            Šifra mora imati tačno 4 karaktera!
          </span>
        )}

        {/* Submit dugme */}
        <button type="submit" style={buttonStyle}>
          Prijavi se
        </button>
      </form>
    </div>
  );
}

// Zajednički stilovi
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
