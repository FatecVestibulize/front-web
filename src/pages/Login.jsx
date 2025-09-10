import { useState } from "react"
import Banner from "../components/Banner"
import Formulario from "../components/Formulario"
import InputText from "../components/InputText"
import Button from "../components/Button"
import RedirecionamentoLinks from "../components/RedirecionamentoLinks"
import apiVestibulizeClient from "../utils/apiVestibulizeClient"

function Login() {
  const [formData, setFormData] = useState({
    usuario: "",
    senha:""
  })

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
      alert("Login realizado com sucesso!")
      console.log(response.data)
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
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <div style={{width: '50vw', height: '100%'}}>
        <Banner />
      </div>
      <div style={{width: '50vw', padding: '100px'}}>
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