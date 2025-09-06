import { Link } from "react-router-dom";

export default function RedirecionamentoLinks(){
    return(
        <div style={{ marginTop: "10px", textAlign: "center"}}>
            <p>
                Não possui conta?{" "}
                <Link to="/cadastro" style={{color: "#FF6600", fontWeight: "bold"}}>
                    Clique aqui
                </Link>
            </p>
            <p>
                Esqueceu sua senha?{" "}
                <Link to="/esqueci-senha" style={{color: "#FF6600", fontWeight: "bold"}}>
                    Clique aqui 
                </Link>
            </p>
        </div>
    )
}