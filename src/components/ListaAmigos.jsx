import React, { useState, useEffect } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  UserPlus,
  Check,
  Clock,
  Handshake,
  X,
  Trash2,
} from "lucide-react";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";

export default function ListaAmigos() {
  const [expandido, setExpandido] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [friendIds, setFriendIds] = useState(new Set());
  const [pendingSent, setPendingSent] = useState(new Set());
  const [pendingReceived, setPendingReceived] = useState([]);
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [hoveredAccept, setHoveredAccept] = useState(null);
  const [hoveredReject, setHoveredReject] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  const getAvatarColor = (nome) => {
    if (!nome) return "#ccc";
    const cor = localStorage.getItem(`avatarColor_${nome}`);
    return cor || "#9B8DC7";
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    fetchUsers();
    fetchFriends();
    fetchRequests();

    const atualizarCores = () => setAllUsers((prev) => [...prev]);
    window.addEventListener("avatarColorChanged", atualizarCores);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("avatarColorChanged", atualizarCores);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiVestibulizeClient.get("/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersWithOnline = res.data.map((u) => ({
        ...u,
        online: Math.random() < 0.7,
      }));
      setAllUsers(usersWithOnline);
    } catch (err) {
      console.log("Erro fetchUsers:", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await apiVestibulizeClient.get("/user/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.map((u) => u.id);
      setFriendIds(new Set(ids));
    } catch (err) {
      console.log("Erro fetchFriends:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await apiVestibulizeClient.get("/user/friend-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.map((u) => u.id);
      setPendingReceived(ids);
    } catch (err) {
      console.log("Erro fetchRequests:", err);
    }
  };

  const handleSendRequest = async (id) => {
    try {
      await apiVestibulizeClient.post(`/user/friend-request/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingSent((prev) => new Set([...Array.from(prev), id]));
    } catch (err) {
      console.log("Erro handleSendRequest:", err);
    }
  };

  const handleAcceptRequest = async (fromId) => {
    try {
      await apiVestibulizeClient.post(`/user/friend-request/accept/${fromId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendIds((prev) => new Set([...Array.from(prev), fromId]));
      setPendingReceived((prev) => prev.filter((id) => id !== fromId));
    } catch (err) {
      console.log("Erro handleAcceptRequest:", err);
    }
  };

  const handleRejectRequest = async (fromId) => {
    try {
      await apiVestibulizeClient.post(`/user/friend-request/reject/${fromId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log("Erro reject:", err);
    } finally {
      setPendingReceived((prev) => prev.filter((id) => id !== fromId));
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await apiVestibulizeClient.delete(`/user/friend/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    } catch (err) {
      console.log("Erro ao remover amigo:", err);
    }
  };

  const generateInitials = (username) => {
    if (!username) return "";
    const partes = username.trim().split(" ");
    return partes[0].substring(0, 2).toUpperCase();
  };

  const usersToShow =
    searchQuery.trim() === ""
      ? allUsers.filter((u) => friendIds.has(u.id) || pendingReceived.includes(u.id))
      : allUsers.filter((u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const visiveis = expandido ? usersToShow : usersToShow.slice(0, 3);
  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: "24px",
        width: "100%",
        maxWidth: "280px",
        margin: isMobile ? "10px auto" : "0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <Users size={20} color="#47427C" />
        <h2 style={{ color: "#47427C", fontSize: "14px", margin: 0, fontWeight: "normal" }}>Amigos</h2>
      </div>

      <div style={{ position: "relative", marginBottom: "16px" }}>
        <Search
          size={16}
          color="#9CA3AF"
          style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)" }}
        />
        <input
          type="text"
          placeholder="Pesquisar usuários..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px 6px 28px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "13px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" }}>
        {visiveis.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
            Nenhum usuário encontrado
          </p>
        ) : (
          visiveis.map((user) => {
            const isFriend = friendIds.has(user.id);
            const hasSent = pendingSent.has(user.id);
            const hasReceived = pendingReceived.includes(user.id);
            const initials = generateInitials(user.username);
            const color = getAvatarColor(user.username);

            return (
              <div key={user.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {initials}
                  </div>
                  {user.online && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#22C55E",
                        border: "2px solid white",
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px 0", color: "#374151", fontSize: "13px" }}>
                    {user.username}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isFriend ? (
                      <>
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            backgroundColor: "#E5E7EB",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `78%`,
                              height: "100%",
                              backgroundColor: "#47427C",
                              borderRadius: "6px",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#6B7280",
                            width: "32px",
                            textAlign: "right",
                          }}
                        >
                          78%
                        </span>
                      </>
                    ) : (
                      <div style={{ flex: 1 }}>
                        {hasSent ? (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#9CA3AF",
                              fontStyle: "italic",
                            }}
                          >
                            Solicitação enviada
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#6B7280",
                              wordBreak: "break-all",
                            }}
                          >
                            {user.email}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isFriend ? (
                  <div
                    onMouseEnter={() => setHoveredFriend(user.id)}
                    onMouseLeave={() => setHoveredFriend(null)}
                    onClick={() => {
                      if (hoveredFriend === user.id) handleRemoveFriend(user.id);
                    }}
                    style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: hoveredFriend === user.id ? "#EF4444" : "#47427C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {hoveredFriend === user.id ? (
                      <Trash2 size={12} color="#fff" />
                    ) : (
                      <Check size={12} color="#fff" />
                    )}
                  </div>
                ) : hasSent ? (
                  <div
                    style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "2px solid #D1D5DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9CA3AF",
                    }}
                  >
                    <Clock size={12} />
                  </div>
                ) : hasReceived ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Botão aceitar */}
                    <button
                      onMouseEnter={() => setHoveredAccept(user.id)}
                      onMouseLeave={() => setHoveredAccept(null)}
                      onClick={() => handleAcceptRequest(user.id)}
                      style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "2px solid #47427C",
                        backgroundColor:
                          hoveredAccept === user.id ? "#47427C" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Handshake
                        size={12}
                        color={hoveredAccept === user.id ? "#fff" : "#47427C"}
                      />
                    </button>

                    {/* Botão rejeitar */}
                    <button
                      onMouseEnter={() => setHoveredReject(user.id)}
                      onMouseLeave={() => setHoveredReject(null)}
                      onClick={() => handleRejectRequest(user.id)}
                      style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "2px solid #EF4444",
                        backgroundColor:
                          hoveredReject === user.id ? "#EF4444" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <X
                        size={12}
                        color={hoveredReject === user.id ? "#fff" : "#EF4444"}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "2px solid #D1D5DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <UserPlus size={12} color="#9CA3AF" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={() => setExpandido(!expandido)}
        style={{
          width: "100%",
          backgroundColor: "#3D3869",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {expandido ? (
          <>
            Ver menos <ChevronUp size={16} />
          </>
        ) : (
          <>
            Ver mais <ChevronDown size={16} />
          </>
        )}
      </button>
    </div>
  );
}
