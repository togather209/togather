import React, { useState } from "react";
import "./CommonInput.css";

const CommonInput = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  onClick,
  onBlur,
  maxLength,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-container">
      <label
        htmlFor={id}
        className={`input-label ${isFocused || value ? "focused" : ""}`}
      >
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onClick={onClick}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={onBlur}
        className="common-input"
        disabled={disabled}
      />
    </div>
  );
};

export default CommonInput;
