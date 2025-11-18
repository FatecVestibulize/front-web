import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import { Toast } from 'primereact/toast';
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import BarraProgresso from "../components/BarraProgresso";

const Quiz = () => {

  const navigate = useNavigate();
  const { quiz_id } = useParams();
  const toast = useRef(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(60 * 15);
  const [quizCreatedAt, setQuizCreatedAt] = useState(null);
  const [quizFinishedAt, setQuizFinishedAt] = useState(null);

  useEffect(() => {
    if (quiz_id) {
      apiVestibulizeClient.get(`quiz/${quiz_id}`, {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      }).then((response) => {
        if (response.data && response.data.created_at) {

          setQuizCreatedAt(response.data.created_at);
          setQuizFinishedAt(response.data.finished_at);

          const quizStartTime = new Date(response.data.created_at);
          const now = new Date();
          const elapsedSeconds = Math.floor((now - quizStartTime) / 1000);
          const totalTime = 60 * 15;
          const remainingTime = Math.max(0, totalTime - elapsedSeconds);

          if(response.data.type === "exam") {
            setTotalQuestions(10);
          }
          
          setTimeElapsed(remainingTime);
          
        }
      }).catch((error) => {
        console.error("Erro ao carregar quiz:", error);
      });
    }
  }, [quiz_id]);

  useEffect(() => {
    if (!quizCreatedAt) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((new Date() - new Date(quizCreatedAt)) / 1000);
      const totalTime = 60 * 15;
      const remainingTime = Math.max(0, totalTime - elapsedSeconds);
      
      setTimeElapsed(remainingTime);
      
      if (remainingTime === 0) {

        saveQuizFinishedAt();

        toast.current?.show({
          severity: 'warn',
          summary: 'Tempo esgotado',
          detail: 'O tempo do quiz acabou!',
          life: 5000
        });

        navigate(`/quiz/${quiz_id}/resumo`);

      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizCreatedAt]);

  const saveQuizFinishedAt = () => {
    if(quizFinishedAt === null) {
      apiVestibulizeClient.patch(`quiz/${quiz_id}`, 
        {
          finished_at: moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')
        },
        {
          headers: {
            token: `${localStorage.getItem('token')}`
          }
      }).then((response) => {
        
      }).catch((error) => {
        console.error("Erro ao finalizar quiz:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao finalizar quiz. Tente novamente.',
          life: 3000
        });
      });
    }
  }

  useEffect(() => {

    if (quiz_id) {
      getCurrentQuestion();
    }

  }, [quiz_id]);

  const getCurrentQuestion = () => {

    getReviewData();

    apiVestibulizeClient.get(`quiz/${quiz_id}/question` , {
      headers: {
        token: `${localStorage.getItem('token')}`
      }
    }).then((response) => {
      if (response.data && response.data.id) {
        setCurrentQuestion(response.data);
        setCurrentCategory(response.data.category.name);
      }
    }).catch((error) => {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar questão. Tente novamente.',
        life: 3000
      });
    });

  }

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {

    if (selectedAnswer) {

      apiVestibulizeClient.post('quiz/answer-question', {
        quiz_id: parseInt(quiz_id),
        question_id: currentQuestion.id,
        answer_id: selectedAnswer
      }, {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      }).then(() => {

        toast.current?.show({
          severity: 'success',
          summary: 'Resposta salva',
          detail: 'Resposta salva com sucesso!',
          life: 500
        });

        setSelectedAnswer(null)
        setCurrentQuestion(null)
        getCurrentQuestion()

        if(reviewData.length + 1 === totalQuestions) {

          saveQuizFinishedAt();
          navigate(`/quiz/${quiz_id}/resumo`);

        }

      }).catch((error) => {
        console.error("Erro ao salvar resposta:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar resposta. Tente novamente.',
          life: 3000
        });
      });

    }else{
      toast.current?.show({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione uma resposta para prosseguir.',
        life: 3000
      });
    }
  };

  const getReviewData =  async () => {

    try {


      const response = await apiVestibulizeClient.get(`quiz/${quiz_id}/review`, {
        headers: {
          token: `${localStorage.getItem('token')}`
        }
      });

      setReviewData(response.data);

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar revisão. Tente novamente.',
        life: 3000
      });
    }

  }

  const handleReview = () => {

    getReviewData();
    setShowReview(true);
      
  };

  const handleContinueAnswering = () => {
    setShowReview(false);
  };

  const handleFinishQuiz = () => {
    if (window.confirm("Tem certeza que deseja finalizar o quiz?")) {
      saveQuizFinishedAt();
      navigate(`/quiz/${quiz_id}/resumo`);
    }
  };

  const handleQuestionClick = (questionId) => {
    const questionIndex = allQuestions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setShowReview(false);
    }
  };

  const handleExit = () => {
    if (window.confirm("Tem certeza que deseja sair? Seu progresso será salvo.")) {
      saveQuizFinishedAt();
      navigate('/quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const categoryNames = {
    'ciencias': 'Ciências',
    'matematica': 'Matemática',
    'linguagens': 'Linguagens',
    'humanas': 'Humanas',
    'portugues': 'Português'
  };

  useEffect(() => {
    if (showReview && reviewData.length > 0) {
      
      const questionsArray = [];
      
      reviewData.forEach(item => {
        if (item.question) {
          questionsArray.push({
            id: item.question.id,
            category: item.question.category.name,
            isAnswered: true
          });
        }
      });
    
      setAllQuestions(questionsArray);

    }
  }, [showReview, reviewData]);

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar />

      {/* Header */}
      <div
        style={{
          backgroundColor: "#3D3A66",
          padding: "16px 24px",
          marginTop: "55px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={handleExit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "#FFFFFF",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={20} />
          Sair
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            Questão {reviewData.length} {totalQuestions ? 'de ' + totalQuestions : ''}
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            {currentCategory}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          <Clock size={20} />
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          display: totalQuestions ? 'block' : 'none',
          padding: "20px 24px",
          backgroundColor: "#F9F9F9",
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        <span style={{ fontSize: "14px", color: "#666666", fontWeight: "500", minWidth: "80px"}}>
          Progresso
        </span>
        <BarraProgresso current={reviewData.length} total={totalQuestions} color="#3D3A66" />
      </div>

      {showReview ? (
        <>
          <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              Revisão Final
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: '#666666',
              marginBottom: '40px'
            }}>
              Você respondeu {reviewData.length} de {totalQuestions} questões
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '40px'
            }}>
              {reviewData.map((review) => {

                return (
                  <div
                    key={review.id}
                    onClick={() => review.id && handleQuestionClick(review.id)}
                    style={{
                      border: `2px solid ${review.answer.is_correct ? '#10B981' : '#EF4444'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#FFFFFF',
                      cursor: review.id ? 'pointer' : 'default',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (review.id) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (review.id) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px'
                    }}>
                      {review.answer.is_correct ? (
                        <Check size={24} color="#10B981" />
                      ) : (
                        <X size={24} color="#EF4444" />
                      )}
                    </div>
                    
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1F2937',
                      marginBottom: '8px'
                    }}>
                      Questão {review.number}
                    </div>
                    
                    <div style={{
                      fontSize: '14px',
                      color: '#666666'
                    }}>
                      {review.question.category?.name ?? ''}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px'
            }}>

              <div>
                <Button label="Continuar Respondendo" onClick={handleContinueAnswering} className="w-fit"/>
              </div>

              <div>
                <Button label="Finalizar Quiz" onClick={handleFinishQuiz} className="w-fit"/>
              </div>

            </div>
          </div>
        </>

      ) : (

      <>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        {/* Question Card */}
        {currentQuestion && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              marginBottom: "32px",
            }}
          >
            {/* Question Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#3D3A66",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {reviewData.length + 1}
              </div>
              <div
                style={{
                  backgroundColor: "#F4BB3C",
                  color: "#3D3A66",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {currentCategory}
              </div>
            </div>

            {/* Question Text */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
            {currentQuestion.exam !== null ? '['+currentQuestion.exam.toUpperCase()+'] - ' : null} {currentQuestion.statement}
            </div>

            {/* Answers */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              {currentQuestion.answers && currentQuestion.answers.map((answer, index) => {
                
                const isSelected = selectedAnswer === answer.id;
                
                return (
                  <div
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    style={{
                      border: `2px solid ${isSelected ? "#3D3A66" : "#E5E5E5"}`,
                      borderRadius: "12px",
                      padding: "16px 20px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#F5F5F5" : "#FFFFFF",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#3D3A66";
                        e.currentTarget.style.backgroundColor = "#FAFAFA";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "#3D3A66" : "#CCCCCC"}`,
                          backgroundColor: isSelected ? "#3D3A66" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && "✓"}
                      </div>
                      <span
                        style={{
                          color: "#1F2937",
                          fontSize: "16px",
                        }}
                      >
                        {answer.statement}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "24px",
                borderTop: "1px solid #E5E5E5",
              }}
            >

              <div>
                <Button label="Revisar" onClick={handleReview} className="w-fit"/>
              </div>

              <div>
                <Button label="Próximo" onClick={handleNext} className="w-fit"/>
              </div>

            </div>
          </div>
        )}
      </div>
        </>
      )}
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default Quiz;
