import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function RedirecionamentoLinks({ links = [], align = "center", gap = 8 }) {
  if (!links.length) return null;

  return (
    <div style={{ marginTop: 10, textAlign: align }}>
      {links.map(({ prefix, to, label, linkStyle }, idx) => (
        <p key={idx} style={{ margin: `${idx ? gap : 0}px 0 0 `}}>
          {prefix ? <span style={{color: "#7A7A7A"}}>{prefix} </span> : null}
          <Link
            to={to}
            style={{ color: "#F58220", fontWeight: "bold", fontFamily: "'Inter', sans-serif", 
              textDecoration: "none", ...(linkStyle || {}) }}
          >
            {label}
          </Link>
        </p>
      ))}
    </div>
  );
}

RedirecionamentoLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,     
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      linkStyle: PropTypes.object,  
    })
  ),
  align: PropTypes.string,
  gap: PropTypes.number,
};