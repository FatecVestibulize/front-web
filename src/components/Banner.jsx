import logo from "../assets/logo.png";
import imagemBanner from "../assets/imagem-banner.png";

export default function Banner() {
  return (
    
    <div
      style={{
        position: "relative",
        width: "50vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        height: "832px",
        left: "0px",
        right: "652px",
        top: "0px",
        background: "linear-gradient(143.35deg, #FFC514 68.63%, #000000 166.73%)",
      }}
    >
      {/* Logo no topo */}
      <img
        src={logo}
        alt="Logo Vestibulize"
        style={{
          width: "100%",
          height: "auto",
          display: "block",    
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
          width: "100%",                  
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