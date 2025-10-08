import React from "react";
import Card from "./Card";

const Listagem = ({ listagem, headerTitle, headerActions, cardActionsGenerator, onCardClick }) => {

  return (
    <section>
      <div
        style={{
          padding: "0 0 8px 0",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "600",
          fontSize: "14px",
          color: "#888888",
        }}
      >
        <span style={{ paddingLeft: "20px" }}>{headerTitle}</span>
        <span style={{ paddingRight: "90px" }}>{headerActions}</span>
      </div>

      {listagem.map((a, index) => (
        <Card
          key={a.id || index}
          titulo={a.titulo}
          data={a.data}
          actions={cardActionsGenerator(a)}
          onClick={() => onCardClick(a)}
        />
      ))}
    </section>
  );
};

export default Listagem;