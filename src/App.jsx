import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedirecionamentoLinks from "./components/RedirecionamentoLinks";

function App() {
  const linksLogin = [
    { prefix: "Não possui conta?", to: "/cadastro", label: "Clique aqui" },
    { prefix: "Esqueceu sua senha?", to: "/esqueci-senha", label: "Clique aqui" },
  ];

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Tela de Login (Simulada)</h1>
              <button>ACESSAR</button>
              <RedirecionamentoLinks links={linksLogin} />
            </div>
          }
        />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;