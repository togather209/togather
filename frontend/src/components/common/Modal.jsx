import React from "react";
import "./Modal.css";

const Modal = ({
  mainMessage,
  subMessage,
  onClose,
  onConfirm,
  buttonText = "확인",
}) => {
  const handleButtonClick = () => {
    if (onConfirm) {
      onConfirm(); // 특정 상호작용이 필요할 때 처리
    }
    onClose(); // 모달 닫기
  };

  return (
    <div className="common-modal-overlay">
      <div className="common-modal-content">
        <div className="common-modal-message">
          <div className="common-modal-main-message">{mainMessage}</div>
          <div className="common-modal-sub-message">{subMessage}</div>
        </div>
        <button className="common-modal-button" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
