import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/departments")
      .then(res => res.json())
      .then(data => setDepartments(data));
  }, []);

  return (
    <div style={{ padding: "40px", color: "white", background: "#3a3485", minHeight: "100vh" }}>
      <h1>Departments</h1>

      {departments.map(dep => (
        <div
          key={dep.id}
          style={{
            background: "#4c46a3",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "12px",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/department/${dep.id}`)}
        >
          <h2>{dep.name}</h2>
          <p>Floor: {dep.floor}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
