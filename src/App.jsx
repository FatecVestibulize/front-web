import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import Caderno from "./pages/Caderno";
import Anotacao from "./pages/Anotacao";
import Meta from "./pages/Meta";
import Prova from "./pages/Prova";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import AlterarSenha from "./pages/AlterarSenha";

function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={ (localStorage.getItem('token') ? 
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute> : 
            <Login />) 
          } />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} />
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
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export const ProtectedRoute = ({ children }) => {
  return (
    localStorage.getItem('token') && localStorage.getItem('userData') ? children : <Navigate to="/" replace />
  );
};

export default App;