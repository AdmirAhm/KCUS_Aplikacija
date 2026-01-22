import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const getBgColor = (status) => {
  switch (status) {
    case 1:
      return "white"; // green
    case 0:
      return "#3a3485"; // gray
    default:
      return "#3a3485";
  }
};

const getFontColor = (status) => {
  switch (status) {
    case 1:
      return "#3a3485"; // green
    case 0:
      return "white"; // gray
    default:
      return "#3a3485";
  }
};

export default function Grupe() {

  const navigate = useNavigate();
  const [grupe, setGrupe] = useState([]);

  const handleGroupClick = async (group) => {
  const studentID = localStorage.getItem("userID");

  // If user is trying to SUBSCRIBE
  if (group.prijavljen === 0) {
    const alreadySubscribed = grupe.some(
      g =>
        g.predmet === group.predmet &&
        g.prijavljen === 1 &&
        g.ID !== group.ID
    );

    if (alreadySubscribed) {
      alert(
        "Već ste prijavljeni na ovaj predmet!"
      );
      return;
    }
  }

  try {
    await fetch("http://localhost:8000/GrupaToggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentID: Number(studentID),
        grupaID: group.ID,
      }),
    });

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Greška pri prijavi");
  }
};

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    fetch(`http://localhost:8000/grupe?user=${userID}`)
      .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
      })
      .then(data => setGrupe(data))
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
        Grupe
      </h1>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 2px 60%",
          gap: "20px",
          alignItems: "flex-start"
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          <h3>Informacije</h3>
          <p>
            Ovdje možete odabrati grupe u kojima prisustvujete praktičnoj nastavi. Pretplatom na neku od grupa, dobit ćete pristup pregledu termina u kojima se trebate pojaviti na odgovarajućem odjelu. Ukoliko se desi bilo kakva promjena u raspored održavanja nastave, bit ćete obavješteni preko e-maila, kao i na svom računu unutar aplikacije.

          </p>

        </div>

        {/* DIVIDER */}
        <div style={{ background: "white", height: "100%" }} />

        {/* RIGHT COLUMN */}
        <div>
          {grupe.length === 0 ? (
            <p>Nema dostupnih grupa.</p>
          ) : (
            // Group by 'predmet'
            Object.entries(
              grupe.reduce((acc, curr) => {
                if (!acc[curr.predmet]) acc[curr.predmet] = [];
                acc[curr.predmet].push(curr); 
                return acc;
              }, {})
            ).map(([predmet, grupeList], index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#3a3485",
                  border: "4px solid white",
                  borderRadius: "30px",
                  marginBottom: "15px",
                  padding: "20px",
                  color: "white",
                }}
              >
                <p style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
                  <strong> {predmet}</strong>
                </p>
                
                  {grupeList.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => handleGroupClick(g)}
                      style={{
                        backgroundColor: getBgColor(g.prijavljen),
                        border: `4px solid white`,
                        borderRadius: "0px",
                        marginBottom: "10px",
                        padding: "10px",
                        width: "60%",
                        color: getFontColor(g.prijavljen),
                        cursor: "pointer"
                      }}
                    >
                      <strong>{g.grupa}</strong>
                    </button>
                  ))}
               
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
