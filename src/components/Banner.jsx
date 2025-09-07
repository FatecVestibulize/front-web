import logo from "../assets/logo.png";
import imagemBanner from "../assets/imagem-banner.png";

export default function Banner() {
  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
        height: "100vh",
        backgroundColor: "#facc15",
        overflow: "hidden", // corta qualquer sobra
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo no topo */}
      <img
        src={logo}
        alt="Logo Vestibulize"
        style={{
          width: "100%",
          height: "auto",
          display: "block",    // remove espaço extra de imagem inline
          objectFit: "cover",
        }}
      />

      <img
        src={imagemBanner}
        alt="Estudante"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,                   
          transform: "translateX(-50%)",
          maxWidth: "100%",
          height: "auto",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}