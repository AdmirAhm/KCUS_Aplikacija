import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Department from "./pages/Department";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";
import Odjeli from "./pages/Odjeli";
import Nalazi from "./pages/Nalazi"

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />
      <Route path="/odjeli" element={<Odjeli />}/>
      <Route path="/nalazi" element={<Nalazi />} />
      {/* Prijava & Registracija */}
      <Route path="/prijava" element={<Prijava />} />
      <Route path="/registracija" element={<Registracija />} />

      {/* Department */}
      <Route path="/department/:id" element={<Department />} />
      
    </Routes>
  );
}

export default App;

