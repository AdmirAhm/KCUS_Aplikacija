import { useState, useEffect } from "react";

export default function Odjeli() {
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Fetch departments for combo box
    fetch("http://localhost:8000/odjeli")
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selected) {
      // Fetch info for selected department
      fetch(`http://localhost:8000/odjeli/${selected}`)
        .then(res => res.json())
        .then(data => setInfo(data))
        .catch(err => console.log(err));
    }
  }, [selected]);

  return (
    <div style={{ padding: "20px", color: "white", background: "#3a3485", minHeight: "100vh" }}>
      <button onClick={() => window.history.back()} style={{ marginBottom: "20px" }}>Nazad</button>

      <h2>Odaberite odjel:</h2>
      <select onChange={e => setSelected(e.target.value)} value={selected || ""}>
        <option value="" disabled>Odaberite...</option>
        {departments.map(d => (
          <option key={d.ID} value={d.ID}>{d.naziv}</option>
        ))}
      </select>

      {info && (
        <div style={{ marginTop: "20px" }}>
          <h3>{info.naziv}</h3>
          <img src={info.slika} alt="Map" style={{ width: "80%", maxWidth: "600px" }} />
          <p>{info.opis}</p>
          <p><strong>Zaposlenici:</strong> {info.opis}</p>
          <p><strong>Uputstvo:</strong> {info.uputstva}</p>
        </div>
      )}
    </div>
  );
}
