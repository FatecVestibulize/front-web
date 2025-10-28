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
      <div style={{ paddingTop: localStorage.getItem('token') ? "50px" : "0px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/metas" element={
            <ProtectedRoute>
              <Meta />
            </ProtectedRoute>} />
          <Route path="/caderno" element={
            <ProtectedRoute>
              <Caderno />
            </ProtectedRoute>} />
          <Route path="/caderno/:notebook_id/anotacoes" element={
            <ProtectedRoute>
              <Anotacao />
            </ProtectedRoute>} />
          <Route path="/datas" element={
            <ProtectedRoute>
              <Prova />
            </ProtectedRoute>} />
          <Route path="/caderno" element={<Caderno />} />
        </Routes>
      </div>
    </div>
  );
}

export const ProtectedRoute = ({ children }) => {
  return (
    localStorage.getItem('token') && localStorage.getItem('userData') ? children : <Navigate to="/login" replace />
  );
};

export default App;