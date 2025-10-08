import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"

function Login() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    usuario: "",
    senha:""
  })

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
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async ({ usuario, senha }) => {
    if (!usuario || !senha) {
      alert("Preencha todos os campos")
      return
    }

    const payload = {
      username: usuario,
      password: senha
    }

    try {
      const response = await apiVestibulizeClient.post('user/login', payload)
      
      // Salva o token e dados do usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userData', JSON.stringify({
          username: usuario,
          email: response.data.email || ''
        }))
        alert("Login realizado com sucesso!")
        navigate('/caderno')
      } else {
        alert("Resposta inválida do servidor")
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao fazer login. Tente novamente.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(formData)
  }

  return (

    <div style={{display: isMobile ? 'block' : 'flex', width: '100%'}}>
      <div style={{display: isMobile ? 'none' : '', width: '50vw', height: '100vh'}}>
        <Banner isMobile={isMobile}/>
      </div>
      <div style={{
        width: isMobile ? '100vw' : '50vw',
        padding: isMobile ? '10px' : '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'center' : 'flex-start',
        height: '100vh',
        alignItems: isMobile ? 'center' : 'flex-start',
      }}>
        <Formulario titulo="Login" subtitulo="Faça seu login para continuar">
          <InputText label="Usuário" id="usuario" type="text" value={formData.usuario} onChange={handleChange}/>
          <InputText label="Senha" id="senha" type="password" value={formData.senha} onChange={handleChange} />
          <Button label="ACESSAR" onClick={handleSubmit}/>
          <RedirecionamentoLinks links={[
            {prefix: "Não possui conta? ", to:"/cadastro", label:"Clique aqui", linkStyle:{}},
            {prefix: "Esqueceu sua senha? ", to:"/esqueci-senha", label:"Clique aqui", linkStyle:{}}
          ]}/>
        </Formulario>
      </div>
    </div>
  )
}

export default Login