import { useState } from 'react'
import Banner from '../components/Banner'
import Formulario from '../components/Formulario'
import InputText from '../components/InputText'
import Button from '../components/Button'
import RedirecionamentoLinks from '../components/RedirecionamentoLinks'
import apiVestibulizeClient from '../utils/apiVestibulizeClient'

function Cadastro() {
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    nascimento: '',
    senha: '',
    confirmar: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleCadastro = async ({ usuario, email, nascimento, senha, confirmar }) => {
    if (!usuario || !email || !nascimento || !senha || !confirmar) {
      alert("Preencha todos os campos")
      return
    }

    if (!validarEmail(email)) {
      alert("Email inválido")
      return
    }

    if (senha !== confirmar) {
      alert("Senhas não coincidem!")
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
      alert("Cadastro realizado com sucesso!")
      console.log(response.data)
    } catch (error) {
      console.error(error)
      alert("Erro ao cadastrar. Tente novamente.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCadastro(formData)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50vw', height: '100vh' }}>
        <Banner />
      </div>
      <div style={{ 
        width: '50vw', 
        height: '100vh', 
        padding: '5vh 5vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Formulario titulo="Cadastro" subtitulo="Faça um novo cadastro">
          <InputText label="Usuário" id="usuario" type="text" value={formData.usuario} onChange={handleChange} />
          <InputText label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
          <InputText label="Data de nascimento" id="nascimento" type="date" value={formData.nascimento} onChange={handleChange} />
          <InputText label="Senha" id="senha" type="password" value={formData.senha} onChange={handleChange} />
          <InputText label="Confirmar senha" id="confirmar" type="password" value={formData.confirmar} onChange={handleChange} />
          <Button label="CADASTRAR" onClick={handleSubmit} />
          <RedirecionamentoLinks links={[
            { prefix: "Já tem cadastro? ", to:"/login", label:"Clique aqui", linkStyle:{} }
          ]}/>
        </Formulario>
      </div>
    </div>
  )
}

export default Cadastro
