import React from "react";

const BarraProgresso = ({ current, total, color }) => {

  const progress = ((current) / total) * 100;

  return (
    <>
      <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
        <div style={{flex: 1, height: "8px", backgroundColor: "#E5E5E5", borderRadius: "4px", overflow: "hidden"}}>
          <div style={{width: `${progress}%`, height: "100%", backgroundColor: color || "#3D3A66", transition: "width 0.3s ease"}}/>
        </div>
        <span style={{fontSize: "14px", color: "#666666", fontWeight: "600", minWidth: "40px", textAlign: "right"}}>
          {Math.round(progress)}%
        </span>
      </div>
    </>
  );
};

export default BarraProgresso;
