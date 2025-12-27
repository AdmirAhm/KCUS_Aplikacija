import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Department() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/departments/${id}`)
      .then(res => res.json())
      .then(data => setDepartment(data));
  }, [id]);

  if (!department) return <div>Loading...</div>;

  return (
    <div style={{ padding: "40px", color: "white", background: "#3a3485", minHeight: "100vh" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      <h1>{department.name}</h1>
      <p><strong>Floor:</strong> {department.floor}</p>
      <p><strong>Working hours:</strong> {department.working_hours}</p>
      <p><strong>Expected wait:</strong> {department.expected_wait}</p>
    </div>
  );
}

export default Department;
