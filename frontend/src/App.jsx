import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Department from "./pages/Department";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Prijava & Registracija */}
      <Route path="/prijava" element={<Prijava />} />
      <Route path="/registracija" element={<Registracija />} />

      {/* Department */}
      <Route path="/department/:id" element={<Department />} />
    </Routes>
  );
}

export default App;

