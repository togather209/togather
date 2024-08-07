import React from "react";

import "./ScheduleModal.css"

function ScheduleModal ({ isOpen, onClose, content }) {
    if (!isOpen) return null
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {content}
                <button className="modal-close" onClick={onClose}>닫기</button>
            </div>
        </div>
    ) 
}

export default ScheduleModal