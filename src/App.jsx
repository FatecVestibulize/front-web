import RedirecionamentoLinks from "./components/RedirecionamentoLinks"

function App() {

  return (
    <>
    <RedirecionamentoLinks links={[
          {prefix: "Caso não tenha cadastro, ", to:"/cadastro", label:"clique aqui", linkStyle:{}},
          {prefix: "Caso tenha cadastro, ", to:"/login", label:"clique aqui", linkStyle:{}}
        ]}/>
    </>
  )
}

export default App