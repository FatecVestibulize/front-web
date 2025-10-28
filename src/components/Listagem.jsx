import React from "react";
import Card from "./Card";

const Listagem = ({ listagem, headerTitle, headerActions, cardActionsGenerator, onCardClick }) => {
  return (
    <section>
      {/* Cabeçalho da listagem */}
      <div
        style={{
          padding: "0 0 8px 0",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "600",
          fontSize: "14px",
          color: "#888888",
        }}
      >
      </div>

      {/* Grid de cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          padding: "0 10px",
        }}
      >
        {listagem.map((a, index) => (
          <Card
            key={a.id || index}
            titulo={a.titulo}
            data={a.data}
            actions={cardActionsGenerator(a)}
            onClick={() => onCardClick(a)}
          />
        ))}
      </div>
    </section>
  );
};

export default Listagem;
