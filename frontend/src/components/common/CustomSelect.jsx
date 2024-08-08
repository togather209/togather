import React, { useState } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ id, placeholder, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container">
      <div
        className={`custom-select ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
      >
        <span className={`select-label ${isOpen || value ? "focused" : ""}`}>
          {placeholder}
        </span>
        <span className={`select-value ${value ? "selected" : ""}`}>
          {value ? options.find((option) => option.value === value).label : ""}
        </span>
        <div className="select-arrow">{isOpen ? "▲" : "▼"}</div>
      </div>
      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className="custom-select-option"
              onClick={() => handleSelect(option.value)}
            >
              <img
                src={option.image}
                alt={option.label}
                className="option-image"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
