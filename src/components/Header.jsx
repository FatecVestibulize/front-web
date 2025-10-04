import React from "react";
import InputText from "./InputText";
import Button from "./Button";

const Header = ({ title, searchText, onSearchChange, onAddClick }) => {
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
      {/*Titulo*/}
      <h1
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 480,
          fontSize: "45px",
          color: "white",
          margin: 0,
          padding: 0,
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

      {/*Barra de ação*/}
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/*Contêiner do Botão*/}
        <div
          style={{
            width: '120px',
            flexShrink: 0,
            height: '40px',
          }}
        >
          <Button
            label="ADICIONAR"
            onClick={onAddClick}
            className="h-full"
            style={{
              backgroundColor: '#625997',
              height: '100%',
              padding: '0 5px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '6px',
            }}
          />
        </div>
        {/*Contêiner do InputText:*/}
        <div
          style={{
            flex: "1",
            minWidth: "250px",
            height: '40px',
          }}
        >
          <InputText
            placeholder="Pesquisar por Título..."
            value={searchText}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;