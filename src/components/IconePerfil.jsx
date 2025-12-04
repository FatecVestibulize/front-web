import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import { Toast } from "primereact/toast";

export default function IconePerfil() {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [bgColor, setBgColor] = useState("#47427C");
  const toast = useRef(null);
  const navigate = useNavigate();

  const loggedIn = !!localStorage.getItem("token");

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
      setAvatarUrl(res.data.avatar_url || null);
      setBgColor(res.data.avatarColor || "#47427C");
    } catch (err) {
      console.error("Erro ao carregar usuário no ícone:", err);
    }
  };

  useEffect(() => {
    loadUserFromBackend();

    const handleRefresh = () => loadUserFromBackend();
    const handleColorChange = (e) => setBgColor(e.detail.newColor);
    const handleAvatarUpdate = (e) => setAvatarUrl(e.detail.avatar_url);

    window.addEventListener("profileUpdated", handleRefresh);
    window.addEventListener("avatarColorChanged", handleColorChange);
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleRefresh);
      window.removeEventListener("avatarColorChanged", handleColorChange);
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
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
      toast.current.show({
        severity: "error",
        summary: "Erro ao deslogar",
        detail: "Erro ao deslogar. Tente novamente.",
        life: 3000,
      });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    toast.current.show({
      severity: "success",
      summary: "Deslogado com sucesso",
      detail: "Você foi desconectado com sucesso.",
      life: 2000,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleClick = () => {
    if (loggedIn) navigate("/perfil");
  };

  const wrapperRef = useRef(null);
  let hideTimeout = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setShowLogout(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowLogout(false);
    }, 200); 
  };

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
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      <div style={container} onClick={handleClick}>
        <Toast ref={toast} position="bottom-right" />

        {!loggedIn || (!avatarUrl && !initials) ? (
          <div style={{ fontSize: "12px" }}>?</div>
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div>{initials}</div>
        )}
      </div>

      {loggedIn && (
        <div style={logoutBoxStyle} onClick={handleLogout}>
          <LogOut size={16} color="#F58220" />
          <span>Sair</span>
        </div>
      )}
    </div>
  );
}
