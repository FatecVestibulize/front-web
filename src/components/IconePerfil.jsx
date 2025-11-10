import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImagemPerfilPadrao from "../assets/imagem-perfil.png";

export default function IconePerfil() {
  const [isHovered, setIsHovered] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [bgColor, setBgColor] = useState("#47427C");

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const loggedIn = !!userData?.username;

  const colorPalette = [
    "#10B981", "#9B8DC7", "#22D3EE", "#FBBF24", "#A855F7",
    "#F43F5E", "#6366F1", "#14B8A6", "#EC4899", "#F97316",
  ];

  const initials = userData?.username
    ? userData.username.split(" ")[0].substring(0, 2).toUpperCase()
    : "";

  useEffect(() => {
    if (loggedIn) {
      const username = userData.username;
      let savedColor = localStorage.getItem(`avatarColor_${username}`);

      if (!savedColor) {
        savedColor =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        localStorage.setItem(`avatarColor_${username}`, savedColor);
      }

      setBgColor(savedColor);

      const handleColorChange = (e) => setBgColor(e.detail.newColor);
      window.addEventListener("avatarColorChanged", handleColorChange);
      return () =>
        window.removeEventListener("avatarColorChanged", handleColorChange);
    }
  }, [loggedIn, userData.username]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowLogout(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHovered) setShowLogout(false);
    }, 300); // tempo extra pra permitir mover o cursor pro menu
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.reload();
    window.location.href = "/";
  };

  const handleClick = () => {
    if (loggedIn) navigate("/");
  };

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
    zIndex: 0,
  };

  const logoutBoxStyle = {
    position: "absolute",
    top: "52px",
    right: 0,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 10,
    whiteSpace: "nowrap",
    opacity: showLogout ? 1 : 0,
    transform: showLogout ? "translateY(0)" : "translateY(-5px)",
    transition: "all 0.25s ease-out",
  };

  const logoutBoxArrowStyle = {
    position: "absolute",
    top: "-6px",
    right: "12px",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: "6px solid rgba(255, 255, 255, 0.9)",
    filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.1))",
  };

  return (
    <div
      style={baseContainerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
            fontWeight: "500",
            fontSize: 14,
            color: "#fff",
            position: "relative",
            zIndex: 1,
          }}
        >
          {initials}
        </div>
      )}

      {loggedIn && showLogout && (
        <div
          style={logoutBoxStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setShowLogout(false)}
          onClick={handleLogout}
        >
          <div style={logoutBoxArrowStyle} />
          <LogOut size={16} color="#F58220" />
          <span
            style={{
              transition: "color 0.2s ease",
            }}
          >
            Logout
          </span>
        </div>
      )}
    </div>
  );
}
