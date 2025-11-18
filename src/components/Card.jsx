import React from "react";
import { Card as PrimeCard } from "primereact/card";
import { Button } from "primereact/button";

const CARD_COLORS = {
  background: "#fffefeff",
  border: "rgba(0, 0, 0, 0.1)",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  glow: "0 0 12px rgba(165, 156, 255, 0.45)",
  dataText: "#888888",
};

const Card = ({ titulo, data, actions, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle = {
    width: "100%",
    marginBottom: "12px",
    borderRadius: "14px",
    border: isHovered ? "1px solid rgba(223, 188, 255, 0.6)" : `1px solid ${CARD_COLORS.border}`,
    padding: "14px 18px",
    backgroundColor: CARD_COLORS.background,
    boxShadow: isHovered ? CARD_COLORS.glow : CARD_COLORS.shadow,
    transform: isHovered ? "scale(1.015)" : "scale(1)",
    transition:
      "transform 0.25s ease-out, box-shadow 0.25s ease-out, border 0.25s ease-out",
    cursor: "pointer",
  };

  const contentContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  };

  const textBlockStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  };

  const buttonBlockStyle = {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  };

  return (
    <PrimeCard
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={contentContainerStyle}>
        <div style={textBlockStyle}>
          <div
            style={{
              fontWeight: "600",
              marginBottom: "4px",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.3",
              fontSize: "1.05rem",
              color: "#2b2b2b",
            }}
          >
            {titulo}
          </div>

          <div
            style={{
              fontSize: "0.8em",
              color: CARD_COLORS.dataText,
            }}
          >
            {data}
          </div>
        </div>

        <div style={buttonBlockStyle}>
          {actions}
        </div>
      </div>
    </PrimeCard>
  );
};

export default Card;
