import React from "react";
import "./Button.css";

function Button({ children, type, onClick }) {
  return (
    <button onClick={onClick} className={`button button-${type}`}>
      {children}
    </button>
  );
}

export default Button;
