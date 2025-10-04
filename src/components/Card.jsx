import React from "react";
import { Card as PrimeCard } from "primereact/card";
import { Button } from "primereact/button";

const CARD_COLORS = {
  background: "#FFFFFF",
  border: "rgba(0, 0, 0, 0.1)",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  hoverShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
  dataText: "#888888",
};

const Card = ({ titulo, data, actions }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle = {
    width: "100%",
    marginBottom: "15px",
    borderRadius: "12px",
    border: `1px solid ${CARD_COLORS.border}`,
    padding: "5px 16px",
    height: "auto",
    boxSizing: "border-box",
    backgroundColor: CARD_COLORS.background,
    boxShadow: isHovered ? CARD_COLORS.hoverShadow : CARD_COLORS.shadow,
    transform: isHovered ? "scale(1.01)" : "scale(1)",
    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
    cursor: "pointer",
  };

  const contentContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "30px",
  };

  const textBlockStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    marginRight: "20px",
  };

  const buttonBlockStyle = {
    display: "flex",
    flexShrink: 0,
    gap: "4px",
  };

  return (
    <PrimeCard
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentContainerStyle}>
        <div style={textBlockStyle}>
          <div
            style={{
              fontWeight: "600",
              marginBottom: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "#333333",
            }}
          >
            {titulo}
          </div>
          <div style={{
            fontSize: "0.8em",
            color: CARD_COLORS.dataText
          }}>
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