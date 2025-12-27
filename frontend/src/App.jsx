import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Department from "./pages/Department";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/department/:id" element={<Department />} />
    </Routes>
  );
}

export default App;
