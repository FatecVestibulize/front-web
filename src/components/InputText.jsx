import React from "react";

const InputText = ({ label, type = "text", value, onChange, ...rest }) => {
  return (
    <div className="flex flex-column mb-3">
      {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="p-2 border-1 border-gray-300 border-round-lg w-full"
        {...rest}
      />
    </div>
  );
};

export default InputText;
