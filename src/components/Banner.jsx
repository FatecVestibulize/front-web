import logo from "../assets/logo-isolada.png";
import imagemBanner from "../assets/imagem-banner.png";

export default function Banner() {
  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#FFC514", // fundo amarelo base
      }}
    >
      {/* Faixa roxa inclinada (topo) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "42%",
          backgroundColor: "#3d366c",
          clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 44%)",
          zIndex: 0,
        }}
      />

      {/* Logo limpa (transparente) */}
      <img
        src={logo}
        alt="Logo Vestibulize"
        style={{
          width: 260,
          margin: 28,
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Juninha */}
      <img
        src={imagemBanner}
        alt="Estudante"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "95%",
          height: "auto",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}