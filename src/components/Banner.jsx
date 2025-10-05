import logo from "../assets/logo-isolada.png";
import imagemBanner from "../assets/imagem-banner.png";

export default function Banner({ isMobile }) {
  return (
    <div
      style={{
        position: "relative",
        height: isMobile ? "fit-content" : "100vh",
        overflow: "hidden",
        backgroundImage: "linear-gradient(143.35deg, #FFC514 68.63%, #000000 166.73%)"
      }}
    >
      {/* Faixa roxa inclinada (topo) */}
      <div
        style={{
          height: "30%",
          backgroundColor: "#4A4C78",
          clipPath: isMobile ? "none" : "polygon(0px 0, 100% 0px, 100% 50%, 0px 100%)",
          textAlign: "center",
        }}
      >

        {/* Logo limpa (transparente) */}
        <img
          src={logo}
          alt="Logo Vestibulize"
          style={{
            width: isMobile ? "100%" : "auto",
            margin: isMobile ? "20px 0px" : 20,
          }}
        />

      </div>

      <div
        style={{
          display: isMobile ? "none" : "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "flex-end"
        }}
      >
        {/* Juninha */}
        <img
          src={imagemBanner}
          alt="Estudante"
          style={{
            width: "100%",
            height: "auto",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
      
    </div>
  );
}