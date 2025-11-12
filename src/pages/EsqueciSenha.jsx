import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"

function EsqueciSenha() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const toast = useRef(null); 

  const [formData, setFormData] = useState({
    email: ""
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

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEnviar = async ({ email }) => {
    if (!email) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha o campo de e-mail",
        life: 3000
      });
      return;
    }

    if (!validarEmail(email)) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "E-mail inválido",
        life: 3000
      });
      return;
    }

    try {
      const payload = { email };
      const response = await apiVestibulizeClient.post("user/forgot-password", payload);

      toast.current.show({
        severity: "success",
        summary: "Enviado",
        detail: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.",
        life: 4000
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao enviar solicitação. Tente novamente.",
        life: 3000
      });
    }
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
          titulo="Recuperar senha"
          subtitulo="Informe o e-mail cadastrado para continuar"
        >
          <InputText
            label="E-mail"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Button label="Recuperar senha" onClick={handleSubmit} />
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

export default EsqueciSenha;
