import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Search, Plus } from "lucide-react";

const useScreenSize = (breakpoint = 768) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width <= breakpoint;
};


const Header = ({ title, searchText, onSearchChange, onAddClick, searchPlaceholder, addButtonLabel }) => {
  const isMobile = useScreenSize(768);
  const [isHovered, setIsHovered] = useState(false);

  const buttonLabel = addButtonLabel || "Adicionar Anotação";
  const inputPlaceholder = isMobile ? "Pesquisar..." : (searchPlaceholder || "Pesquisa | Busque pelo título...");

  const inputContainerStyle = {
    flex: 1,
    maxWidth: isMobile ? "none" : "450px",
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
    paddingBottom: "2px",
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
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "12px",
              backgroundColor: CARD_COLORS.background,
              border: isHovered
                ? "1px solid rgba(223, 188, 255, 0.6)"
                : `1px solid ${CARD_COLORS.border}`,
              boxShadow: isHovered ? CARD_COLORS.glow : CARD_COLORS.shadow,
              transform: isHovered ? "scale(1.01)" : "scale(1)",
              transition:
                "transform 0.25s ease-out, box-shadow 0.25s ease-out, border 0.25s ease-out",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8f8fa3",
                pointerEvents: "none",
              }}
            />

            <input
              type="text"
              placeholder={inputPlaceholder}
              value={searchText}
              onChange={onSearchChange}
              style={{
                width: "100%",
                padding: "12px 15px 12px 42px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#3b3b3bff",
              }}
            />
          </div>
        </div>

        <div style={buttonContainerStyle}>
          {isMobile ? (
            <button onClick={onAddClick} style={nativeButtonStyle}>
              +
            </button>
          ) : (
            <Button label={buttonLabel} onClick={onAddClick} style={componentButtonStyle} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;