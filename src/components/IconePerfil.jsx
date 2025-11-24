import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";

export default function IconePerfil() {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const loggedIn = !!localStorage.getItem("token");
  const bgColor = userData?.avatarColor;

  const initials = userData?.username
    ? userData.username.split(" ")[0].substring(0, 2).toUpperCase()
    : "";

  const loadUserFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await apiVestibulizeClient.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuário no ícone:", err);
    }
  };

  useEffect(() => {
    loadUserFromBackend();
    const handleRefresh = () => loadUserFromBackend();
    window.addEventListener("profileUpdated", handleRefresh);

    return () => window.removeEventListener("profileUpdated", handleRefresh);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await apiVestibulizeClient.post("/user/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleClick = () => {
    if (loggedIn) navigate("/perfil");
  };

  // 🔧 CONTROLE LIMPO DE HOVER (SEM LOOP INFINITO)
  const handleMouseEnter = () => setShowLogout(true);
  const handleMouseLeave = () => setShowLogout(false);

  const container = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    backgroundColor: bgColor,
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    userSelect: "none",
  };

  const logoutBoxStyle = {
    position: "absolute",
    top: "52px",
    right: 0,
    background: "rgba(255, 255, 255, 0.92)",
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
    pointerEvents: showLogout ? "auto" : "none",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {initials}

      <div style={logoutBoxStyle} onClick={handleLogout}>
        <LogOut size={16} /> Sair
      </div>
    </div>
  );
}
