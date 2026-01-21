import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Department from "./pages/Department";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";
import Odjeli from "./pages/Odjeli";
import Nalazi from "./pages/Nalazi"
import Studenti from "./pages/Studenti"
import Grupe from "./pages/Grupe"

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
      <Route path="/studentska" element={<Studenti />} />
      <Route path="/grupe" element={<Grupe />} />

      {/* Department */}
      <Route path="/department/:id" element={<Department />} />
      
    </Routes>
  );
}

export default App;

