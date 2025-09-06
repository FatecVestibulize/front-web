import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedirecionamentoLinks from "./components/RedirecionamentoLinks";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{textAlign: "center", marginTop: "50px"}}>
            <h1>Tela de Login (Simulada)</h1>
            <button>ACESSAR</button>
            <RedirecionamentoLinks/>
          </div>
        }/>
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/esqueci-senha" element={<EsqueciSenha/>}/>
      </Routes>
    </Router>
  )
}

export default App;