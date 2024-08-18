import React, { useEffect } from "react";
import "./JoinFormModal.css";

function JoinFormModal({ modalOpen, content, onClose }) {

  if (!modalOpen) return null;

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="join-modal-content-text">{content}</p>
        <button
          className="join-modal-close"
          onClick={() => {
            onClose(); // onClose 함수를 호출하여 모달 닫기
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default JoinFormModal;
