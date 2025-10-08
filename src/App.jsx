import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import Navbar from "./components/Navbar";
import Caderno from "./pages/Caderno";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "50px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/caderno" element={<Caderno />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;