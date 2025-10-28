import React, { useEffect, useState } from "react";
import PerfilHeader from "../components/PerfilHeader";
import PerfilAtalhos from "../components/PerfilAtalhos";
import ListaAmigos from "../components/ListaAmigos";

export default function Perfil() {
  const [dropdownAberto, setDropdownAberto] = useState(false);

  useEffect(() => {
    document.body.style.overflow = dropdownAberto ? "auto" : "auto";
  }, [dropdownAberto]);

  return (
    <>
      <style>
        {`
          .perfil-container {
            flex-direction: column;
            padding: 24px;
            gap: 24px;
            align-items: center;
          }
          .principal-content {
            width: 100%;
            max-width: 500px;
          }
          .amigos-content {
            width: 100%;
            max-width: 500px;
          }
          @media (min-width: 768px) {
            .perfil-container {
              flex-direction: row;
              align-items: flex-start;
              padding: 40px;
              gap: 40px;
            }
            .principal-content {
              width: auto;
              max-width: none;
            }
            .amigos-content {
              width: 300px;
              max-width: none;
            }
          }
        `}
      </style>

      <div
        className="perfil-container"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#E8E8E8",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-100px",
              width: "400px",
              height: "350px",
              backgroundColor: "#D6D1EB",
              borderRadius: "50%",
              opacity: "0.6",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "-140px",
              left: "-120px",
              width: "300px",
              height: "300px",
              backgroundColor: "#D6D1EB",
              borderRadius: "50%",
              opacity: "0.5",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "10%",
              width: "120px",
              height: "120px",
              backgroundColor: "#CBC5E3",
              borderRadius: "50%",
              opacity: "0.4",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "60%",
              right: "15%",
              width: "120px",
              height: "120px",
              backgroundColor: "#DCD7F0",
              borderRadius: "50%",
              opacity: "0.3",
              transform: "rotate(-25deg)",
            }}
          ></div>
        </div>

        <div
          className="principal-content"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            zIndex: 1,
          }}
        >
          <PerfilHeader onDropdownChange={setDropdownAberto} />
          <PerfilAtalhos />
        </div>

        <div
          className="amigos-content"
          style={{ position: "relative", zIndex: 1 }}
        >
          <ListaAmigos />
        </div>
      </div>
    </>
  );
}
