import React from "react";

import "./ScheduleDates.css"

function ScheduleDates ({ children, onClick, isSelected }) {
    return (
        <button 
            className={`schedule-detail-weekdays-element2 ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            { children }
        
        
        </button>
    )
}


export default ScheduleDates