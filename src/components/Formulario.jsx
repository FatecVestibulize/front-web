import React from "react";

const Formulario = ({ titulo, subtitulo, children }) => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            color: "#f97316",
            fontWeight: "400",
            marginBottom: "0.3rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {titulo}
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {subtitulo}
        </p>
      </div>

      <hr
        style={{
          border: "0",
          height: "1px",
          width: "100%",
          backgroundColor: "#7A7A7A",
          margin: "1rem 0 1.5rem 0",
        }}
      />

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {children}
      </form>
    </div>
  );
};

export default Formulario;
