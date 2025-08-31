import React, { useState } from "react";

const Button = ({ label, onClick, type = "button", className = "" }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full ${className}`}
      style={{
        backgroundColor: hover ? "#EE7F36" : "#4A4C78",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </button>
  );
};

export default Button;
