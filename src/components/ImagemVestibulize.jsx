import React, { useEffect, useState } from "react";
import logoGrande from "../assets/imagem-logo-vestibulize.png";
import logoPequeno from "../assets/imagem-v-vestibulize.png";

export default function ImagemVestibulize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <img
      onClick={() => (window.location.href = "/")}
      src={isMobile ? logoPequeno : logoGrande}
      alt="Vestibulize"
      style={{
        height: isMobile ? "40px" : "49px",
        marginRight: isMobile ? "0px" : "55px",
        objectFit: "contain",
        cursor: "pointer",
      }}
    />
  );
}