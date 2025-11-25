import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const baseLinks = [
    // { to: "/", label: "Início" },
    { to: "/caderno", label: "Cadernos" },
    { to: "/metas", label: "Metas" },
    { to: "/datas", label: "Datas" },
    { to: "/quiz", label: "Quiz" },
    // { to: "/forum", label: "Fórum" },
  ];

  const links = isMobile
    ? [...baseLinks, { to: "/perfil", label: "Perfil" }]
    : baseLinks;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const expandedMaxHeight = `${links.length * 60}px`;

  return (
    <div style={{ position: "relative" }}>
      {isMobile ? (
        <>
          <div
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            style={{
              cursor: "pointer",
              width: "30px",
              height: "22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              position: "fixed",
              top: "17px",
              left: open ? "50%" : "20px", 
              transform: open ? "translateX(-50%)" : "translateX(0)",
              transition: "left 0.5s ease, transform 0.5s ease",
              zIndex: 1200,
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                height: "3px",
                background: "#fff",
                borderRadius: "2px",
                transition: "all 0.4s ease",
                transform: open ? "translateY(9.5px) rotate(-45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "100%",
                height: "3px",
                background: "#fff",
                borderRadius: "2px",
                transition: "all 0.4s ease",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "100%",
                height: "3px",
                background: "#fff",
                borderRadius: "2px",
                transition: "all 0.4s ease",
                transform: open ? "translateY(-9.5px) rotate(45deg)" : "none",
              }}
            />
          </div>
          <div
            style={{
              position: "fixed",
              top: "50px",
              left: 0,
              right: 0,
              width: "100%",
              background: "#47427C",
              borderRadius: "0 0 8px 8px",
              overflow: "hidden",
              maxHeight: open ? expandedMaxHeight : "0px",
              transition:
                "max-height 0.8s cubic-bezier(.2,.8,.2,1), opacity 0.45s ease, transform 0.45s ease",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-6px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {links.map((link, idx) => {
              const baseColor = idx % 2 === 0 ? "#4f4b85" : "#5a568f";
              return (
                <Link
                  key={idx}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "16px 20px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    lineHeight: "21px",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontWeight: "normal",
                    cursor: "pointer",
                    background: baseColor,
                    transition: "background 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#6b66a8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = baseColor)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", gap: "35px", alignItems: "center" }}>
          {links.map((link, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredLink(idx)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                position: "relative",
                display: "inline-block",
                paddingBottom: "5px",
              }}
            >
              <Link
                to={link.to}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12.91px",
                  lineHeight: "21px",
                  color: hoveredLink === idx ? "#F58220" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: "normal",
                  cursor: "pointer",
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                }}
              >
                {link.label}
              </Link>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: hoveredLink === idx ? "100%" : "0",
                  height: "2px",
                  backgroundColor: "#F58220",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}