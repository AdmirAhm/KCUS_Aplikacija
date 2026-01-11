import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Registracija() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");

  const [sifra, setSifra] = useState("");
  const [uloga, setUloga] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sifra.length !== 4) {
      alert("Greška: šifra mora imati tačno 4 karaktera!");
      return;
    }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Unesite ispravan email!");
      return;
    }
  // Slanje podataka na backend
fetch("http://localhost:8000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    ime, 
    prezime, 
    password: sifra, 
    email, 
    uloga 
  })
})
  .then(res => {
    if (!res.ok) return res.json().then(err => { throw new Error(err.detail) });
    return res.json();
  })
  .then(data => {
    alert(data.message);
    // Opcionalno očisti formu nakon uspješne registracije
    setIme("");
    setPrezime("");
    setEmail("");
    setSifra("");
    setUloga("student");
  })
  .catch(err => alert(err.message));



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
    <div
      onClick={() => navigate("/")}
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        background: "#e5e5e5",
        color: "black",
        padding: "8px 14px",
        cursor: "pointer",
        fontSize: "0.95rem",
        border: "1px solid #aaa",
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
        <h2 style={{ textAlign: "center" }}>Registracija</h2>

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
              boxSizing: "border-box" //da input ne prelazi sirinu forme
    	    }}
  	  />
          {sifra.length == 0 && (
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

	{sifra.length > 0 && sifra.length !== 4 && (
  	  <span style={{ color: "#ffb3b3", fontSize: "0.85rem" }}>
    	    Unesite tačno 4 karaktera!
          </span>
	)}



        <select
          value={uloga}
          onChange={(e) => setUloga(e.target.value)}
          style={inputStyle}
        >
          <option value="student">Student</option>
          <option value="pacijent">Pacijent</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Registruj se
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

