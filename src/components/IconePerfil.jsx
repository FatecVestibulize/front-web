import React, { useState } from "react";
import ImagemPerfilPadrao from "../assets/imagem-perfil.png"; 

export default function IconePerfil() {
  const [isHovered, setIsHovered] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const initials = userData?.username
    ? userData.username.substring(0, 2).toUpperCase()
    : "";

  const loggedIn = !!userData?.username;

  const bgColor = loggedIn
    ? ["#47427C", "#F58220"][Math.floor(Math.random() * 2)]
    : "#B0B0B0";

  const baseContainerStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible", 
    boxSizing: "border-box",
  };

  const outerBorderStyle = {
    position: "absolute",
    top: isHovered ? "-4px" : "50%", 
    left: isHovered ? "-4px" : "50%",
    width: isHovered ? "calc(100% + 8px)" : "0", 
    height: isHovered ? "calc(100% + 8px)" : "0", 
    borderRadius: "50%",
    border: "2px solid #F58220",
    opacity: isHovered ? 1 : 0,
    transition: "all 0.4s ease-out",
    boxSizing: "border-box",
    zIndex: 0,
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onClick={() => (window.location.href = "/perfil")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={baseContainerStyle}
    >
      <div style={outerBorderStyle} />
      {!loggedIn ? (
        <img
          src={ImagemPerfilPadrao}
          alt="Perfil Padrão"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            position: "relative",
            zIndex: 1,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "bold",
            fontSize: 14,
            color: "#fff",
            position: "relative",
            zIndex: 1,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}