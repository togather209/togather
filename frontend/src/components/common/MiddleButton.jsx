import React from 'react';
import './MiddleButton.css';

function MiddleButton ({ type = "button", onClick, className, children, disabled }) {
  return (
    <button type={type} className={`middle-button ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default MiddleButton;
