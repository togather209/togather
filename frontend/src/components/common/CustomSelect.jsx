import React, { useState } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ id, placeholder, value, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div className={`custom-select-container ${disabled ? "disabled" : ""}`}>
      <div
        className={`custom-select ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
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
      {isOpen && !disabled && (
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
