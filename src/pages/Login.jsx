import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"
import { Toast } from 'primereact/toast'

function Login() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isMobile = windowWidth <= 768
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    usuario: "",
    senha: ""
  })

  const toast = useRef(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async ({ email, senha }) => {
    if (!email || !senha) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos antes de continuar.',
        life: 3000
      })
      return
    }

    const payload = {
      email: email,
      password: senha
    }

    try {
      const response = await apiVestibulizeClient.post('user/login', payload)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userData', JSON.stringify({
          username: response.data.username,
          email: response.data.email || '',
          avatar_url: response.data.avatar_url || '',
          loginStreak: response.data.loginStreak || 0,
          id: response.data.id
        }))

        toast.current.show({
          severity: 'success',
          summary: 'Login realizado',
          detail: 'Bem-vindo de volta!',
          life: 2000
        })
        window.location.reload();
        navigate('/')
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Erro no servidor',
          detail: 'Resposta inválida do servidor.',
          life: 3000
        })
      }

    } catch (error) {
      console.error(error)
      toast.current.show({
        severity: 'error',
        summary: 'Falha no login',
        detail: 'Email ou senha incorretos. Tente novamente.',
        life: 3000
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(formData)
  }

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <div style={{ display: isMobile ? 'block' : 'flex', width: '100%' }}>
        <div style={{ display: isMobile ? 'none' : '', width: '50vw', height: '100vh' }}>
          <Banner isMobile={isMobile} />
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
            <InputText label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
            <InputText label="Senha" id="senha" type="password" value={formData.senha} onChange={handleChange} />
            <Button label="ACESSAR" onClick={handleSubmit} />
            <RedirecionamentoLinks links={[
              { prefix: "Não possui conta? ", to: "/cadastro", label: "Clique aqui", linkStyle: {} },
              { prefix: "Esqueceu sua senha? ", to: "/esqueci-senha", label: "Clique aqui", linkStyle: {} }
            ]} />
          </Formulario>
        </div>
      </div>
    </>
  )
}

export default Login
