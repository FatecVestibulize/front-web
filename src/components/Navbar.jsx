import React, { useState, useEffect } from "react";
import IconePerfil from "./IconePerfil";
import Menu from "./Menu";
import ImagemVestibulize from "./ImagemVestibulize";

export default function Navbar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navbarStyle = {
    width: "100%",
    height: "55px",
    backgroundColor: "#4a4c78",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
  };

  const leftGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    marginLeft: !isMobile ? "15%" : "0",
  };

  return (
    <div style={navbarStyle}>
      {!isMobile ? (
        <div style={leftGroupStyle}>
          <IconePerfil />
          <Menu />
        </div>
      ) : (
        <Menu />
      )}
      <ImagemVestibulize />
    </div>
  );
}