import React, { useState, useEffect } from "react";
import InputText from "./InputText";
import Button from "./Button";
import { ChevronLeft } from "lucide-react"; // importei Brain
import { useNavigate, useParams } from "react-router-dom";

const useScreenSize = (breakpoint = 768) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width <= breakpoint;
};

const Header = ({ title, searchText, onSearchChange, onAddClick, searchPlaceholder, addButtonLabel, customButton, backButton = false }) => {
  
  const isMobile = useScreenSize(768); 
  const navigate = useNavigate();
  const buttonLabel = addButtonLabel || "Adicionar Anotação";
  const inputPlaceholder = isMobile ? "Pesquisar..." : (searchPlaceholder || "Pesquisar por título...");

  const inputContainerStyle = {
    flex: 1,
    maxWidth: isMobile ? "none" : "450px",
    height: "40px",
    textAlign: "left",
  };

  const buttonContainerStyle = {
    width: isMobile ? "40px" : "220px",
    height: "40px",
    flexShrink: isMobile ? 0 : 1, 
  };
  
  const nativeButtonStyle = {
    backgroundColor: "#625997",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
    color: "white",
    border: "none",
    cursor: "pointer",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
    fontSize: "36px", 
    paddingBottom: '2px',
    fontWeight: "bold",
  };

  const componentButtonStyle = {
    backgroundColor: "#625997",
    height: "100%",
    width: "100%",
    padding: "0 15px",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "6px",
  };

  return (
    <div
      style={{
        backgroundColor: "#958EC2",
        padding: "30px 0",
        width: "100vw",
        margin: 0,
        boxSizing: "border-box",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
    >
      {backButton && (
        <div style={{
          textAlign: "left",
          width: "100%",
          marginLeft: "25px",
          backgroundColor: "rgb(74, 76, 120)",
          borderRadius: "50%",
          width: "fit-content",
        }}
        onClick={() => navigate(-1)}
        >
          <ChevronLeft style={{fontSize: "20px", color: "white", width: "50px", height: "50px", padding: "5px"}} />
        </div>
      )}
      <h1
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 480,
          fontSize: "45px",
          color: "white",
          margin: 0,
          marginBottom: "15px",
        }}
      >
        {title}
      </h1>

      <hr
        style={{
          border: 0,
          borderTop: "1px solid rgba(255, 255, 255, 0.9)",
          width: "90%",
          maxWidth: "1100px",
          margin: "0 auto 20px auto",
          borderRadius: "2px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 60px", 
          gap: isMobile ? "10px" : "20px", 
        }}
      >
        <div style={inputContainerStyle}>
          <InputText
            placeholder={inputPlaceholder}
            value={searchText}
            onChange={onSearchChange}
          />
        </div>

        <div style={buttonContainerStyle}>
          {isMobile ? (
            <button 
              onClick={onAddClick}
              style={nativeButtonStyle}
            >
              +
            </button>
          ) : (
            <Button
              label={buttonLabel} 
              onClick={onAddClick}
              style={componentButtonStyle} 
            />
          )}
        </div>
        <div>
          {customButton}
        </div>
      </div>
    </div>
  );
};

export default Header;