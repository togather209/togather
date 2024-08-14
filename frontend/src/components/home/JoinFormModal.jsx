import React from "react";
import "./JoinFormModal.css";

function JoinFormModal({ joinModalOpen, content, onClose }) {
  if (!joinModalOpen) return null;

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="join-modal-content-text">{content}</p>
        <button className="join-modal-close" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

export default JoinFormModal;
