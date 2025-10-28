import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import Navbar from "./components/Navbar";
import Caderno from "./pages/Caderno";
import Anotacao from "./pages/Anotacao";
import Meta from "./pages/Meta";
import Prova from "./pages/Prova";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: localStorage.getItem('token') ? "50px" : "0px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/caderno/:notebook_id/anotacoes" element={ <Anotacao /> } />
          <Route path="/metas" element={ <Meta /> } />
          <Route path="/datas" element={ <Prova /> } />
          <Route path="/caderno" element={<Caderno />} />
        </Routes>
      </div>
    </div>
  );
}


export default App;