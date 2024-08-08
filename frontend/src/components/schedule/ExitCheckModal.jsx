import React from "react";
import "./ExitCheckModal.css"

function ExitCheckModal ({ isOpen, isClose, onConfirm  }) {
    if (!isOpen) return null
    return (
        <div className="exit-check-modal-overlay">
            <div className="exit-check-modal-content">
                <p className="exit-check-modal-text">정말로 삭제하시겠습니까 ?</p>
                <div className="exit-check-modal-buttons">
                    <button className="exit-check-cancle" onClick={isClose}>취소</button>
                    <button className="exit-check-confirm" onClick={onConfirm}>나가기</button>
                </div>
            </div>

        </div>
    )
}

export default ExitCheckModal