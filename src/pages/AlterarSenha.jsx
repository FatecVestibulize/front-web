import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
function AlterarSenha() {
  
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const toast = useRef(null); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    senha: "",
    senha_confirmar: ""
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEnviar = async ({ senha, senha_confirmar }) => {

    console.log(senha, senha_confirmar)
    if (!senha || !senha_confirmar) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha os campos de senha",
        life: 3000
      });
      return;
    }

    if (senha !== senha_confirmar) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "As senhas não coincidem",
        life: 3000
      });
      return;
    }

    apiVestibulizeClient.patch("user/reset-password", { token: searchParams.get("token"), password: senha }).then((response) => {
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Senha alterada com sucesso.",
        life: 4000
      });

      navigate("/");

    }).catch((error) => {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao alterar senha: " + error.response.data,
        life: 3000
      });
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEnviar(formData);
  };

  return (
    <div style={{ display: isMobile ? "block" : "flex", width: "100%" }}>
      <Toast ref={toast} position="bottom-right"/> 

      <div style={{ display: isMobile ? "none" : "", width: "50vw", height: "100vh" }}>
        <Banner isMobile={isMobile} />
      </div>

      <div
        style={{
          width: isMobile ? "100vw" : "50vw",
          padding: isMobile ? "10px" : "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "center" : "flex-start",
          height: "100vh",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        <Formulario
          titulo="Alterar senha"
          subtitulo="Informe a nova senha para continuar"
        >
          <InputText
            label="Senha"
            id="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
          />
          <InputText
            label="Confirmar senha"
            id="senha_confirmar"
            type="password"
            value={formData.senha_confirmar}
            onChange={handleChange}
          />
          <Button label="Alterar senha" onClick={handleSubmit} />
          <RedirecionamentoLinks
            links={[
              {
                prefix: "Lembrou sua senha? ",
                to: "/",
                label: "Faça login",
                linkStyle: {},
              },
            ]}
          />
        </Formulario>
      </div>
    </div>
  );
}

export default AlterarSenha;
