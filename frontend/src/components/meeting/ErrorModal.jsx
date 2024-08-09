import React from "react";
import "./ErrorModal.css";

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default ErrorModal;