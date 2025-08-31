import React from "react";

const Formulario = ({ titulo, subtitulo, children }) => {
  return (
    <div className="flex w-full h-screen">
      {/* Lado direito com formulário */}
      <div className="w-6 flex flex-column justify-content-center align-items-center">
        <div className="w-10 md:w-6">
          <h1
            style={{
              fontSize: "1.8rem",
              color: "#f97316",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "0.5rem",
              fontFamily: "'Poppins', sans-serif", 
            }}
          >
            {titulo}
          </h1>
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginBottom: "1rem",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {subtitulo}
          </p>

          {/* Linha separadora entre subtítulo e inputs */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #2b2c2eff",
              marginBottom: "1.5rem",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Formulario;
