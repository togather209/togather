import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinFormModal.css";

function JoinFormModal({ joinModalOpen, content, onClose, onConfirm }) {
  useEffect(() => console.log("모달 열림", joinModalOpen));
  const navigation = useNavigate();

  if (!joinModalOpen) return null;

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="join-modal-content-text">{content}</p>
        <button
          className="join-modal-close"
          onClick={() => {
            onclose;
            navigation("/home");
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default JoinFormModal;
