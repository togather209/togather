import React from "react";
import "./CheckModal.css"
// import { useNavigate } from "react-router-dom";

function checkModal ({ isOpen, isClose, onConfirm, firstbutton, secondbutton  }) {
    
    

    if (!isOpen) return null
    return (
        <div className="exit-check-modal-overlay">
            <div className="exit-check-modal-content">
                <p className="exit-check-modal-text">정말로 삭제하시겠습니까 ?</p>
                <div className="exit-check-modal-buttons">
                    <button className="exit-check-cancle" onClick={isClose}>{firstbutton}</button>
                    <button className="exit-check-confirm" onClick={onConfirm}>{secondbutton}</button>
                </div>
            </div>
        </div>
    )
}

export default checkModal