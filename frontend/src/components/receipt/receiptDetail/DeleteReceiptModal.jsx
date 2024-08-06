import React from "react";
import Close from "../../../assets/icons/common/close.png";
import "./DeleteReceiptModal.css";

function DeleteReceiptModal({ onClose, onDelete }) {
  return (
    <div className="delete-receipt-modal-overlay">
      <div className="delete-receipt-modal-content">
        <img
          src={Close}
          className="delete-receipt-modal-close"
          onClick={onClose}
        ></img>
        <div>
          <div>정말 영수증을 삭제하시겠습니까 ?</div>
          <p>🚨 삭제된 영수증은 되돌릴 수 없어요 !</p>
        </div>
        <button className="delete-receipt-modal-confirm" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}

export default DeleteReceiptModal;
