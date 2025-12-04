import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { Trophy, Eye, Clock, TrendingUp, BookOpen, FileText, RefreshCw, Home, Check, X } from "lucide-react";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import Navbar from "../components/Navbar";
import BarraProgresso from "../components/BarraProgresso";
import Button from "../components/Button";
import { Toast } from 'primereact/toast';

const QuizFinish = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { quiz_id } = useParams();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (quiz_id) {
      loadQuizResults();
    }
  }, [quiz_id]);

  const loadQuizResults = async () => {
    try {

      const quizResponse = await apiVestibulizeClient.get(`quiz/${quiz_id}`, {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      })

      const reviewResponse = await apiVestibulizeClient.get(`quiz/${quiz_id}/review`, {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      })

      setQuizData({
        quiz: quizResponse.data,
        questions: reviewResponse.data
      });
      
    } catch (error) {
      console.error("Erro ao carregar resultados:", error);
    }
  };

  if (!quizData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      </div>
    );
  }

  const findCorrectAnswer = (question) => {
    if (!question || !question.answers) return null;
    return question.answers.find(answer => answer.is_correct) || question.answers[0];
  };

  const calculateStats = () => {

    const answers = quizData.questions;
    const totalQuestions = quizData.quiz.type === "exam" ? 10 : quizData.questions.length;
    let correctCount = 0;
    const subjectStats = {};

    const totalTime = quizData.quiz.finished_at ? Math.floor((new Date(quizData.quiz.finished_at) - new Date(quizData.quiz.created_at)) / 1000) : 0;

    answers.forEach((item) => {

      const correctAnswer = findCorrectAnswer(item.question);
      const isCorrect = correctAnswer && item.answer && correctAnswer.id === item.answer.id;
      
      if (isCorrect) {
        correctCount++;
      }

      const category = item.question?.category.name || 'Outros';
      if (!subjectStats[category]) {
        subjectStats[category] = { correct: 0, total: 0 };
      }
      subjectStats[category].total++;
      if (isCorrect) {
        subjectStats[category].correct++;
      }
    });

    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const avgTimePerQuestion = answers.length > 0 ? Math.floor(totalTime / answers.length) : 0;

    return {
      correctCount,
      totalQuestions,
      accuracy: accuracy.toFixed(1),
      totalTime,
      avgTimePerQuestion,
      subjectStats
    };
  };

  const stats = calculateStats();

  const getStatusMessage = () => {
    if (stats.accuracy >= 80) return "Excelente!";
    if (stats.accuracy >= 60) return "Bom Trabalho!";
    if (stats.accuracy >= 40) return "Continue Praticando";
    return "Precisa Melhorar";
  };

  const getStatusColor = () => {
    if (stats.accuracy >= 80) return "#10B981";
    if (stats.accuracy >= 60) return "#3B82F6";
    if (stats.accuracy >= 40) return "#F59E0B";
    return "#EC4899";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}min ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F9FAFB",
      fontFamily: "'Inter', sans-serif"
    }}>
      <Toast ref={toast} position="bottom-right" />
      <Navbar />

      {/* Header Section */}
      <div style={{
        background: "linear-gradient(135deg, #3D3A66 0%, #4A4C78 100%)",
        padding: "60px 24px 40px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(244, 187, 60, 0.2)",
          zIndex: 1
        }} />
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(244, 187, 60, 0.15)",
          zIndex: 1
        }} />

        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px"
          }}>
            <Trophy size={60} color="#F4BB3C" />
          </div>
          
          <h1 style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: "8px"
          }}>
            {stats.correctCount}/{stats.totalQuestions}
          </h1>
          
          <p style={{
            fontSize: "24px",
            color: "#FFFFFF",
            marginBottom: "24px",
            opacity: 0.9
          }}>
            {stats.accuracy}% de acertos
          </p>

          <div style={{
            display: "inline-block",
            padding: "12px 32px",
            backgroundColor: getStatusColor(),
            borderRadius: "8px",
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "24px"
          }}>
            {getStatusMessage()}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "-40px auto 40px",
        padding: "0 24px",
        position: "relative",
        zIndex: 3
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px"
        }}>
          {/* Acertos Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Eye size={32} color="#3D3A66" />
            </div>
            <div style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "8px"
            }}>
              {stats.correctCount}
            </div>
            <div style={{
              fontSize: "16px",
              color: "#6B7280"
            }}>
              Acertos
            </div>
          </div>

          {/* Tempo Total Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Clock size={32} color="#3D3A66" />
            </div>
            <div style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "8px"
            }}>
              {formatTime(stats.totalTime)}
            </div>
            <div style={{
              fontSize: "16px",
              color: "#6B7280"
            }}>
              Tempo Total
            </div>
          </div>

          {/* Por Questão Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <TrendingUp size={32} color="#3D3A66" />
            </div>
            <div style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "8px"
            }}>
              {formatTime(stats.avgTimePerQuestion)}
            </div>
            <div style={{
              fontSize: "16px",
              color: "#6B7280"
            }}>
              Por Questão
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px"
      }}>
        {/* Left Panel - Performance by Subject */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <BookOpen size={24} color="#3D3A66" />
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1F2937"
            }}>
              Desempenho por Matéria
            </h2>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {Object.entries(stats.subjectStats).map(([category, data]) => {
              const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;

              return (
                <div key={category}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1F2937"
                    }}>
                      {category}
                    </span>
                    <span style={{
                      fontSize: "16px",
                      color: "#6B7280"
                    }}>
                      {data.correct}/{data.total} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <BarraProgresso current={data.correct} total={data.total} color="#47427C" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Detailed Answers */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxHeight: "600px",
          overflowY: "auto"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <FileText size={24} color="#3D3A66" />
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1F2937"
            }}>
              Respostas Detalhadas
            </h2>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {quizData.questions.map((item, index) => {
              const chosenAnswer = item.answer;

              return (
                <div key={item.id} style={{
                  border: `2px solid ${chosenAnswer.id === item.answer.id && item.answer.is_correct ? "#10B981" : "#EF4444"}`,
                  borderRadius: "12px",
                  padding: "20px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    <span style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1F2937"
                    }}>
                      Q{index + 1} {item.question.category.name}
                    </span>
                  </div>

                  <p style={{
                    fontSize: "14px",
                    color: "#1F2937",
                    marginBottom: "16px",
                    lineHeight: "1.6"
                  }}>
                    {item.question?.statement}
                  </p>

                  {item.question.answers.map((answer) => (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                            padding: "8px",
                            justifyContent: "space-between",
                            backgroundColor: chosenAnswer.id !== answer.id ? "#F2F2F2" : chosenAnswer.is_correct ? "#ECFDF5" : "#FEF2F2",
                            borderRadius: "6px"
                        }}>
    
                        <div>
                            <span style={{fontSize: "14px",color: "#1F2937",fontWeight: "600"}}>
                                {answer.statement}
                            </span>
                        </div>
                        <div>
                            {chosenAnswer.id !== answer.id ? '' : chosenAnswer.is_correct ? (
                                <Check size={20} color="#10B981" />
                            ) : (
                                <X size={20} color="#EF4444" />
                            )}
                        </div>
                    </div>
    
                    </>

                  ))}

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "0 24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "24px"
        }}>

            <Button label="Fazer novo Quiz" onClick={() => navigate('/quiz')} className="w-fit text-lg"/>

            <Button label="Voltar ao Início" onClick={() => navigate('/')} className="w-fit text-lg"/>

        </div>

      </div>
        <div style={{
          textAlign: "center",
          color: "#6B7280",
          fontSize: "16px",
          lineHeight: "1.6"
        }}>
          <p style={{ marginBottom: "8px", fontWeight: "600" }}>
            Continue estudando! Você está quase lá!
          </p>
          <p style={{ fontSize: "14px" }}>
            Identifique o que precisa de mais atenção e se dedique mais aos estudos nessas áreas.
          </p>
        </div>
    </div>
  );
};

export default QuizFinish;

