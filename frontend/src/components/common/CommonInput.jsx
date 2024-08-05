import React, { useState } from 'react';
import './CommonInput.css';

const CommonInput = ({ id, type, placeholder, value, onChange, onBlur, maxLength }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-container">
      <label htmlFor={id} className={`input-label ${isFocused || value ? 'focused' : ''}`}>
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={onBlur}
        className="common-input"
      />
    </div>
  );
};

export default CommonInput;
