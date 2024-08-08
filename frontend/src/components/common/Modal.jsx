import React from "react";
import "./Modal.css";
import Button from "./Button";

const Modal = ({ mainMessage, subMessage, onClose }) => {
  return (
    <div className="common-modal-overlay">
      <div className="common-modal-content">
        <div className="common-modal-message">
          <div className="common-modal-main-message">{mainMessage}</div>
          <div className="common-modal-sub-message">{subMessage}</div>
        </div>
        <button className="common-modal-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
