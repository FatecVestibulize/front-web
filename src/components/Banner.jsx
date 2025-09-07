import logo from "../assets/logo.png"
import imagemBanner from "../assets/imagem-banner.png"

export default function Banner() {
  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
        height: "100vh",
        backgroundColor: "#facc15",
      }}
    >
      {/* Logo no topo */}
      <div style={{ width: "100%" }}>
        <img
          src={logo}
          alt="Logo Vestibulize"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Imagem da estudante posicionada no centro inferior */}
      <img
        src={imagemBanner}
        alt="Estudante"
        style={{
          position: "absolute",
          bottom: "-30px",      // fixa no fundo do Banner
          left: "50%",     // centraliza horizontalmente
          transform: "translateX(-50%)",
          maxWidth: "90%",
          height: "auto",
        }}
      />
    </div>
  );
}
