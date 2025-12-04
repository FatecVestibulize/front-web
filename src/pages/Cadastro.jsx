import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Banner from '../components/Banner'
import Formulario from '../components/Formulario'
import InputText from '../components/InputText'
import Button from '../components/Button'
import RedirecionamentoLinks from '../components/RedirecionamentoLinks'
import apiVestibulizeClient from '../utils/apiVestibulizeClient'
import { Toast } from 'primereact/toast'

function Cadastro() {
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    nascimento: '',
    senha: '',
    confirmar: ''
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

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleCadastro = async ({ usuario, email, nascimento, senha, confirmar }) => {
    if (!usuario || !email || !nascimento || !senha || !confirmar) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos antes de continuar.',
        life: 3000
      })
      return
    }

    if (!validarEmail(email)) {
      toast.current.show({
        severity: 'warn',
        summary: 'Email inválido',
        detail: 'Digite um endereço de email válido.',
        life: 3000
      })
      return
    }

    if (senha !== confirmar) {
      toast.current.show({
        severity: 'error',
        summary: 'Senhas diferentes',
        detail: 'As senhas digitadas não coincidem.',
        life: 3000
      })
      return
    }

    const payload = {
      username: usuario,
      email,
      password: senha,
      birth_date: nascimento
    }

    try {
      const response = await apiVestibulizeClient.post('user/register', payload)

      toast.current.show({
        severity: 'success',
        summary: 'Cadastro realizado!',
        detail: 'Seu cadastro foi concluído com sucesso.',
        life: 2500
      })

      setTimeout(() => {
        navigate('/')
      }, 2600);

      console.log(response.data)
    } catch (error) {
      console.error(error)
      toast.current.show({
        severity: 'error',
        summary: 'Erro ao cadastrar',
        detail: 'Não foi possível realizar o cadastro. Tente novamente.',
        life: 3000
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCadastro(formData)
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
          <Formulario titulo="Cadastro" subtitulo="Faça um novo cadastro">
            <InputText label="Usuário" id="usuario" type="text" value={formData.usuario} onChange={handleChange} />
            <InputText label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
            <InputText label="Data de nascimento" id="nascimento" type="date" value={formData.nascimento} onChange={handleChange} />
            <InputText label="Senha" id="senha" type="password" value={formData.senha} onChange={handleChange} />
            <InputText label="Confirmar senha" id="confirmar" type="password" value={formData.confirmar} onChange={handleChange} />
            <Button label="CADASTRAR" onClick={handleSubmit} />
            <RedirecionamentoLinks links={[
              { prefix: "Já tem cadastro? ", to: "/", label: "Clique aqui", linkStyle: {} }
            ]} />
          </Formulario>
        </div>
      </div>
    </>
  )
}

export default Cadastro

