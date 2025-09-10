import { useState } from "react"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"

function EsqueciSenha() {
  const [formData, setFormData] = useState({
    email: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEnviar = async ({ email }) => {
    if (!email) {
      alert("Preencha o campo de e-mail")
      return
    }

    if (!validarEmail(email)) {
      alert("E-mail inválido")
      return
    }

    try {
      const payload = { email }
      const response = await apiVestibulizeClient.post('user/forgot-password', payload)
      alert("Se o e-mail estiver cadastrado, você vai receber instruções para redefinir sua senha.")
      console.log(response.data)
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleEnviar(formData)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50vw', height: '100vh' }}>
        <Banner />
      </div>
      <div style={{ width: '50vw', padding: '100px' }}>
        <Formulario titulo="Recuperar senha" subtitulo="Informe o e-mail cadastrado para continuar">
          <InputText label="E-mail" id="email" type="email" value={formData.email} onChange={handleChange}/>
          <Button label="Recuperar senha" onClick={handleSubmit}/>
          <RedirecionamentoLinks links={[
            { prefix: "Lembrou sua senha? ", to:"/login", label:"Faça login", linkStyle:{} },
            { prefix: "Não possui conta? ", to:"/cadastro", label:"Cadastre-se", linkStyle:{} }
          ]}/>
        </Formulario>
      </div>
    </div>
  )
}

export default EsqueciSenha
