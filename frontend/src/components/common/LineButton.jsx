import React from 'react';
import './LineButton.css';

function LineButton ({ type = "button", onClick, className, children, disabled }) {
  return (
    <button type={type} className={`line-button ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default LineButton;
