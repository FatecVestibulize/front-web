import React from "react";

const InputTextArea = ({
  label,
  value,
  onChange,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-column mb-3 ${className}`}>
      {label && (
        <label
          className="mb-1"
          style={{
            fontSize: "0.9rem",
            color: "#374151",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </label>
      )}
      <textarea
          value={value}
          onChange={onChange}
          rows={15}
          className="w-full"
          style={{
            padding: "10px",
            border: "1px solid #909193ff",
            borderRadius: "6px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            resize: "vertical",
            // minHeight: "80px",
          }}
          {...rest}
        />
    </div>
  );
};

export default InputTextArea;
