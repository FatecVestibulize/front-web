import React, { useState, useEffect, useRef } from "react";
import {
  Edit2,
  Mail,
  Flame,
  X,
  Lock,
  LogOut,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Landmark,
  FlaskConical,
  Leaf,
  Palette,
} from "lucide-react";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import { Toast } from "primereact/toast";

export default function PerfilHeader() {
  const toast = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    interesses: "",
    senha: "",
    avatar: "",
  });
  const [bgColor, setBgColor] = useState("#47427C");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [loginStreak, setLoginStreak] = useState(0);

  const materias = [
    { nome: "Português", cor: "#F43F5E", icone: <BookOpen size={14} /> },
    { nome: "Matemática", cor: "#3B82F6", icone: <Calculator size={14} /> },
    { nome: "Física", cor: "#A855F7", icone: <Atom size={14} /> },
    { nome: "Geografia", cor: "#10B981", icone: <Globe size={14} /> },
    { nome: "História", cor: "#F59E0B", icone: <Landmark size={14} /> },
    { nome: "Química", cor: "#14B8A6", icone: <FlaskConical size={14} /> },
    { nome: "Biologia", cor: "#22C55E", icone: <Leaf size={14} /> },
  ];

  const avatarColors = [
    "#10B981",
    "#9B8DC7",
    "#22D3EE",
    "#FBBF24",
    "#A855F7",
    "#F43F5E",
    "#6366F1",
    "#14B8A6",
    "#EC4899",
    "#F97316",
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const interessesSalvos =
      localStorage.getItem(`interesses_${userData.username}`) ||
      userData.interesses ||
      "";

    setFormData({
      nome: userData.username || "",
      email: userData.email || "",
      interesses: interessesSalvos,
      senha: "",
      avatar: userData.avatar_url || null,
      loginStreak: userData.loginStreak || 0,
    });

    setAvatar(userData.avatar_url);

    setLoginStreak(userData.loginStreak);

    if (userData.username) {
      const username = userData.username;
      let savedColor = localStorage.getItem(`avatarColor_${username}`);
      if (!savedColor) {
        savedColor =
          avatarColors[Math.floor(Math.random() * avatarColors.length)];
        localStorage.setItem(`avatarColor_${username}`, savedColor);
      }
      setBgColor(savedColor);
    }
  }, []);

  const initials = formData.nome
    ? formData.nome.split(" ")[0].substring(0, 2).toUpperCase()
    : "";

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: formData.nome,
        interesses: formData.interesses,
        password: formData.senha || undefined,
      };

      const response = await apiVestibulizeClient.put("/user/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          interesses: response.data.interesses,
        })
      );

      localStorage.setItem(
        `interesses_${response.data.username}`,
        formData.interesses
      );

      toast.current.show({
        severity: 'success',
        summary: 'Perfil atualizado com sucesso',
        detail: 'Seus dados foram atualizados com sucesso.',
        life: 2000
      });
      setIsEditing(false);
      setFormData({ ...formData, senha: "" });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Erro ao atualizar perfil',
        detail: 'Erro ao atualizar perfil. Tente novamente.',
        life: 3000
      });
    }
  };

  const handleColorChange = (color) => {
    setBgColor(color);
    localStorage.setItem(`avatarColor_${formData.nome}`, color);
    window.dispatchEvent(
      new CustomEvent("avatarColorChanged", { detail: { newColor: color } })
    );
  };

  const handleLogout = async () => {
    const savedColor = localStorage.getItem(`avatarColor_${formData.nome}`);
    const savedInteresses = localStorage.getItem(
      `interesses_${formData.nome}`
    );

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await apiVestibulizeClient.post("/user/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Erro ao deslogar',
        detail: 'Erro ao deslogar. Tente novamente.',
        life: 3000
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      if (savedColor)
        localStorage.setItem(`avatarColor_${formData.nome}`, savedColor);
      if (savedInteresses)
        localStorage.setItem(`interesses_${formData.nome}`, savedInteresses);
      toast.current.show({
        severity: 'success',
        summary: 'Deslogado com sucesso',
        detail: 'Você foi desconectado com sucesso.',
        life: 2000
      });
      window.location.href = "/";
      window.location.reload();
    }
  };

  const toggleInteresse = (nome) => {
    const interessesAtuais = formData.interesses
      ? formData.interesses.split(", ").filter(Boolean)
      : [];
    const jaSelecionado = interessesAtuais.includes(nome);

    const novosInteresses = jaSelecionado
      ? interessesAtuais.filter((i) => i !== nome)
      : [...interessesAtuais, nome];

    const texto = novosInteresses.join(", ");
    setFormData({ ...formData, interesses: texto });
  };

  const isMobile = windowWidth < 768;
  const isMedium = windowWidth >= 768 && windowWidth <= 1024;

  const containerStyle = {
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: isMobile ? "20px" : isMedium ? "24px" : "29px",
    position: "relative",
    width: isMobile ? "95%" : isMedium ? "90%" : "900px",
    margin: isMobile || isMedium ? "10px auto" : "0",
  };

  const flexStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "center" : "flex-start",
    gap: "20px",
    flexWrap: isMedium ? "wrap" : "nowrap",
  };

  const statsFlex = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "8px",
    marginTop: isMobile ? "12px" : isMedium ? "8px" : "0",
    flexWrap: isMedium ? "wrap" : "nowrap",
    justifyContent: isMobile ? "center" : "flex-start",
    alignItems: "center",
  };

  const changeAvatar = async (e) => {
    {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const token = localStorage.getItem("token");
        const formDataUpload = new FormData();
        formDataUpload.append("avatar", file);
        
        try {
          const response = await apiVestibulizeClient.post(
            "/user/avatar",
            formDataUpload,
            {
              headers: {
                token: token,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          
          if (response.data && response.data.avatar_url) {
            const newAvatarUrl = response.data.avatar_url;
            
            setAvatar(newAvatarUrl);
            
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            userData.avatar_url = newAvatarUrl;
            localStorage.setItem("userData", JSON.stringify(userData));
            
            window.dispatchEvent(
              new CustomEvent("avatarUpdated", { 
                detail: { avatar_url: newAvatarUrl } 
              })
            );
            
            toast.current.show({
              severity: 'success',
              summary: 'Avatar atualizado com sucesso',
              detail: 'Seu avatar foi atualizado com sucesso.',
              life: 2000
            });
          }
        } catch (err) {
          toast.current.show({
            severity: 'error',
            summary: 'Erro ao enviar avatar',
            detail: 'Erro ao enviar avatar. Tente novamente.',
            life: 3000
          });
        }
      }
    }
  }

  return (
    <div style={containerStyle}>
      <Toast ref={toast} position="bottom-right" />
      <div style={flexStyle}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: bgColor,
            color: "white",
            fontSize: "24px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "normal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: isMobile ? "12px" : "0",
            position: "relative",
            overflow: "visible",
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            initials
          )}
          
          {/* Edit Icon Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#F58220",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              border: "2px solid white",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <Edit2 size={12} color="white" />
          </div>

          <input
            type="file"
            accept="image/*"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              zIndex: 3,
            }}
            title="Alterar avatar"
            onChange={changeAvatar}
          />
        </div>

        <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
          <h1
            style={{
              color: "#f4923cff",
              fontSize: "22px",
              margin: 0,
              fontWeight: "normal",
            }}
          >
            {formData.nome}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
              gap: "6px",
              flexWrap: isMedium ? "wrap" : "nowrap",
              margin: 0,
            }}
          >
            <Mail size={14} color="#9CA3AF" />
            <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
              {formData.email}
            </p>
            <span
              onClick={handleLogout}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              style={{
                color: "#F97316",
                fontSize: "14px",
                marginLeft: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {hoverLogout && <LogOut size={16} color="#F97316" />}
              Sair
            </span>
          </div>

          <p
            style={{
              color: "#9CA3AF",
              fontSize: "13px",
              margin: "15px 0 4px 0",
              fontWeight: 500,
            }}
          >
            Estudante
          </p>

          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              margin: "0 0 12px 0",
            }}
          >
            {formData.interesses || "Nenhum interesse selecionado"}
          </p>

          <div style={statsFlex}>
            <div
              style={{
                backgroundColor: "#F4BB3C",
                color: "white",
                borderRadius: "10px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                textAlign: "center",
                gap: "4px",
                padding: "4px 10px",
              }}
            >
              <Flame size={14} />
              Sequência: {loginStreak || 0} dias
            </div>
            <div
              style={{
                backgroundColor: "#47427C",
                color: "white",
                borderRadius: "10px",
                fontSize: "12px",
                padding: "4px 10px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              📊 Progresso: 78%
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#efebfbff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Edit2 size={16} color="#9CA3AF" />
        </button>
      </div>

      {/* Formulário de edição */}
      <div
        style={{
          maxHeight: isEditing ? "600px" : "0",
          opacity: isEditing ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          marginTop: isEditing ? "24px" : "0",
        }}
      >
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "14px", color: "#374151" }}>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                marginTop: "4px",
                outline: "none",
              }}
            />
          </div>

          {/* Campo de interesses */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "14px", color: "#374151" }}>
              Interesses
            </label>
            <input
              type="text"
              value={formData.interesses}
              onChange={(e) =>
                setFormData({ ...formData, interesses: e.target.value })
              }
              placeholder="Selecione ou digite seus interesses"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                marginTop: "4px",
                outline: "none",
              }}
            />

            {/* Botões coloridos */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "12px",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              {materias.map((m) => {
                const ativo =
                  formData.interesses
                    .split(", ")
                    .filter(Boolean)
                    .includes(m.nome);
                return (
                  <button
                    key={m.nome}
                    onClick={() => toggleInteresse(m.nome)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: ativo ? m.cor : "#E5E7EB",
                      color: ativo ? "white" : "#374151",
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s",
                    }}
                  >
                    {m.icone}
                    {m.nome}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cor do avatar */}
          <div style={{ marginBottom: "16px", marginTop: "20px" }}>
            <label
              style={{
                fontSize: "14px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Palette size={16} /> Cor do Avatar
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              {avatarColors.map((color) => (
                <div
                  key={color}
                  onClick={() => handleColorChange(color)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      bgColor === color
                        ? "3px solid #4B5563"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Senha */}
          <div style={{ marginBottom: "16px", position: "relative" }}>
            <label style={{ fontSize: "14px", color: "#374151" }}>
              Nova Senha
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="#9CA3AF"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  marginTop: "4px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Botões finais */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                backgroundColor: "#47427C",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                flex: isMobile ? "1" : "0 0 48px",
                border: "1px solid #D1D5DB",
                backgroundColor: "white",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <X size={16} color="#6B7280" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
