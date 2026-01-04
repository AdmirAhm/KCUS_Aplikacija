import { useEffect } from "react";
import { BiMap, BiPaste, BiCog, BiBook} from "react-icons/bi";
export default function Home() {
  useEffect(() => {
    // Save previous overflow value
    const originalOverflow = document.body.style.overflow;

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Restore scrolling when leaving Home
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
const buttons = [
  { icon: <BiMap size={80}/>, text: "Informacije o odjelima" },
  { icon: <BiPaste size={80}/>, text: "Pregled nalaza" },
  { icon: <BiBook size={80}/>, text: "Studentska stranica" },
  { icon: <BiCog size={80}/>, text: "Opcije" }
];

return (
<div style={{ padding: "40px", color: "white", background: "#3a3485", minHeight: "100vh" }}>
  
    {/* Image at the top */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img 
        src="Slike/Logo-KCUS_featured.png" 
        alt="Logo" 
        style={{ maxWidth: "200px", width: "100%", height: "auto", marginBottom: "-40px" }}
      />
    </div>
    <h1 style={{
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      fontSize: "0.8rem",
      marginBottom: "10px"
    }}>
      INFORMACIONI SISTEM
    </h1>
    {/* Horizontal line */}
    <hr style={{ 
      border: "2px solid white", 
      width: "80%", 
      margin: "0 auto 30px auto" 
    }} />

    {/* Header */}
    <h1 style={{
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "30px"
    }}>
      Odaberite jednu od opcija:
    </h1>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "15px",
        width: "90vw",
        height: "50vh",
        padding: "15px",
        boxSizing: "border-box"
      }}
    >
      {buttons.map((b, i) => (
        <button
          key={i}
          style={{
            display: "flex",
            alignItems: "center",          // ✅ vertically center icon + text
            justifyContent: "space-between", // ✅ icon left, text right within button
            gap: "10px",                   // space between icon and text
            background: "#3a3485",
            color: "white",
            borderRadius: "40px",
            cursor: "pointer",
            border: "4px solid white",
            fontFamily: "Arial, sans-serif",
            fontSize: "1.5rem",
            width: "100%",
            height: "100%",                 // make button fill its grid cell
            padding: "0 20px",
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

