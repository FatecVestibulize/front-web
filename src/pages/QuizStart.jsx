import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Trophy, Play, Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import { Toast } from 'primereact/toast';
import apiVestibulizeClient from "../utils/apiVestibulizeClient";

const QuizStart = () => {

  const navigate = useNavigate();
  const toast = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMode, setSelectedMode] = useState("exam");
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    if(categories){
      apiVestibulizeClient.get('category', {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      }).then(response => {

        setCategories(response.data);
        
        if(selectedMode === "exam") {
          setSelectedCategories(response.data.map((c) => c.id));
        }
      });
    }
    
  }, []);

  useEffect(() => {
    if(selectedMode === "exam") {
      setSelectedCategories(categories.map((c) => c.id));
    }else{
      setSelectedCategories([]);
    }
  }, [selectedMode]);

  const modes = [
    { id: "practice", name: "Para Praticar", color: "" },
    { id: "exam", name: "Para Valer", color: "" },
  ];

  const toggleMode = (modeId) => {
    setSelectedMode((prev) => (prev === modeId ? prev : modeId));
  };

  const toggleCategory = (categoryId) => {
    if(selectedMode !== "exam") {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };

  const selectAllCategories = () => {
      setSelectedCategories(categories.map((c) => c.id));
  };

  const handleStartQuiz = () => {

    if (!selectedMode) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Selecione o modo de quiz',
        detail: 'Selecione o modo de quiz para criar iniciar.',
        life: 3000
      })
      return false;
    }

    if (selectedCategories.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Selecione as matérias',
        detail: 'Selecione as matérias para criar o quiz.',
        life: 3000
      })
      return false;
    }

    const body = {
      type: selectedMode,
      categories_ids: selectedCategories,
    }

    apiVestibulizeClient.post('quiz', body, { headers: {
      token: `${localStorage.getItem('token')}` 
    }}).then(response => {
      toast.current.show({
        severity: 'success',
        summary: 'Quiz criado com sucesso',
        detail: 'Quiz criado com sucesso.',
        life: 3000
      })

      navigate(`/quiz/${response.data.id}`);
      
    }).catch(error => {
      toast.current.show({
        severity: 'warn',
        summary: 'Erro ao criar quiz',
        detail: 'Erro ao criar quiz. Tente novamente.',
        life: 3000
      })
    });

  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        paddingTop: "80px",
        paddingBottom: "40px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          backgroundColor: "#F4BB3C",
          borderRadius: "50%",
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "500px",
          height: "500px",
          backgroundColor: "#D6D1EB",
          borderRadius: "50%",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Main Card Container */}
        <div
          style={{
            backgroundColor: "#3D3A66",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(61, 58, 102, 0.2)",
          }}
        >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#F4BB3C",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={32} color="#3D3A66" />
          </div>
          <div>
            <h1
              style={{
                color: "#FFFFFF",
                fontSize: "48px",
                fontWeight: "bold",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              QUIZ VESTIBULAR
            </h1>
            <p
              style={{
                color: "#FFFFFF",
                fontSize: "18px",
                margin: "8px 0 0 0",
                opacity: 0.9,
              }}
            >
              Teste seus conhecimentos e se prepare para o vestibular
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#4A4670",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-around",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "2px solid #F4BB3C",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={24} color="#F4BB3C" />
            </div>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
               {selectedMode == "practice" ? "Questões ilimitadas" : "10 Questões"} 
              </div>
              <div style={{ color: "#FFFFFF", fontSize: "14px", opacity: 0.8 }}>
                Perguntas selecionadas
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "2px solid #F4BB3C",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={24} color="#F4BB3C" />
            </div>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                15 min
              </div>
              <div style={{ color: "#FFFFFF", fontSize: "14px", opacity: 0.8 }}>
                Tempo estimado
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "2px solid #F4BB3C",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trophy size={24} color="#F4BB3C" />
            </div>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Ranking
              </div>
              <div style={{ color: "#FFFFFF", fontSize: "14px", opacity: 0.8 }}>
                Compare resultados
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#4A4670",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Selecione o modo de quiz:
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {modes.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => toggleMode(mode.id)}
                  style={{
                    backgroundColor: isSelected ? "#5A5680" : "#4A4670",
                    border: `2px solid ${isSelected ? "#F4BB3C" : "transparent"}`,
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#5A5680";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#4A4670";
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="quiz-mode"
                    checked={isSelected}
                    onChange={() => toggleMode(mode.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: mode.color,
                      display: !mode.color || mode.color === "" ? "none" : "block",
                    }}
                  />
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {mode.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#4A4670",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Selecione as matérias:
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                color: "#FFFFFF",
                fontSize: "14px",
                margin: 0,
                opacity: 0.9,
              }}
            >
              {selectedCategories.length === 0
                ? "Nenhuma matéria selecionada (todas serão incluídas)"
                : `${selectedCategories.length} matéria(s) selecionada(s)`}
            </p>
            <button
              onClick={selectAllCategories}
              style={{
                background: "transparent",
                border: "none",
                color: "#F4BB3C",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Selecionar Todas
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <div
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    backgroundColor: isSelected ? "#5A5680" : "#4A4670",
                    border: `2px solid ${isSelected ? "#F4BB3C" : "transparent"}`,
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#5A5680";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#4A4670";
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category.id)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: category.color,
                    }}
                  />
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it Works Section */}
        <div
          style={{
            backgroundColor: "#4A4670",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 16px 0",
            }}
          >
            Como funciona o quiz:
          </h2>
          <ul
            style={{
              color: "#FFFFFF",
              fontSize: "16px",
              lineHeight: "1.8",
              margin: 0,
              paddingLeft: "20px",
              opacity: 0.9,
            }}
          >
            <li>Responda as questões até o tempo acabar</li>
            <li>Cada questão vale 1 ponto</li>
            <li>Ao final, veja seu desempenho detalhado por matéria</li>
          </ul>
        </div>

        <button
          onClick={handleStartQuiz}
          style={{
            width: "100%",
            backgroundColor: "#F4BB3C",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "20px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(244, 187, 60, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFC947";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(244, 187, 60, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F4BB3C";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(244, 187, 60, 0.3)";
          }}
        >
          <Play size={24} fill="#FFFFFF" />
          COMEÇAR QUIZ
        </button>
        </div>
        <Toast ref={toast} position="bottom-right"/>
      </div>
    </div>
  );
};

export default QuizStart;
