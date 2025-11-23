import React, { useState, useEffect } from "react";
import { BookOpen, Target, Calendar, Brain } from "lucide-react"; // importei Brain
import { useNavigate } from "react-router-dom";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";

// componente de atalho reutilizavel
const ShortcutCard = ({ card, navigate }) => (
  <div
    key={card.titulo}
    className="shortcut-card-item"
    style={{
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
      padding: "24px",
      cursor: "pointer",
      transition: "box-shadow 0.2s ease-in-out",
      width: "100%",
    }}
    onClick={() => navigate(card.rota)}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.12)")}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.08)")}
  >
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: card.cor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {card.icone}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: card.cor, margin: "0 0 4px 0", fontWeight: "normal", fontSize: "14px" }}>{card.titulo}</h3>
        <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 6px 0" }}>{card.descricao}</p>
        <p style={{ color: "#9CA3AF", fontSize: "12px", margin: 0 }}>{card.info}</p>
      </div>
    </div>
  </div>
);

export default function PerfilAtalhos() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState({
    cadernos: 0,
    quizzes: 0,
    metasAtivas: 0,
    proximaData: "—",
  });

  useEffect(() => {
    async function fetchResumo() {
      try {
        const token = localStorage.getItem("token");
        const res = await apiVestibulizeClient.get("/user/resumo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumo(res.data);
      } catch (err) {
        console.error("Erro ao buscar resumo:", err);
      }
    }
    fetchResumo();
  }, []);

  const cards = [
    {
      titulo: "Meu Caderno",
      descricao: "Suas anotações e resumos",
      info: `${resumo.cadernos} cadernos`,
      cor: "#47427C",
      icone: <BookOpen size={24} color="#fff" />,
      rota: "/caderno",
    },
    {
      titulo: "Quiz",
      descricao: "Pratique com questões",
      info: `${resumo.quizzes} disponíveis`,
      cor: "#F4BB3C",
      icone: <Brain size={24} color="#fff" />, 
      rota: "/quiz",
    },
    {
      titulo: "Minhas Metas",
      descricao: "Acompanhe seu progresso",
      info: `${resumo.metasAtivas} ativas`,
      cor: "#FF8C42",
      icone: <Target size={24} color="#fff" />,
      rota: "/metas",
    },
    {
      titulo: "Minhas Datas",
      descricao: "Cronograma de estudos",
      info: `Próxima: ${resumo.proximaData}`,
      cor: "#B565D8",
      icone: <Calendar size={24} color="#fff" />,
      rota: "/datas",
    },
  ];

  return (
    <>
      <style>
        {`
          @media (min-width: 768px) {
            .shortcut-container {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}
      </style>
      
      <div 
        className="shortcut-container"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "16px" 
        }}
      >
        {cards.map((card) => (
          <ShortcutCard key={card.titulo} card={card} navigate={navigate} />
        ))}
      </div>
    </>
  );
}
