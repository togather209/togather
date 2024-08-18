import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinFormModal.css";

function JoinFormModal({ modalOpen, content, onClose }) {
  const navigate = useNavigate();

  if (!modalOpen) return null;

  const handleConfirm = () => {
    onClose(); // 모달 닫기
    navigate("/home"); // 페이지 이동
  };

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="join-modal-content-text">{content}</p>
        <button
          className="join-modal-close"
          onClick={handleConfirm} // 수정된 부분
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default JoinFormModal;
