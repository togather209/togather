import React from "react";

import "./ScheduleCard.css"
import schedulereceipt from "../../assets/schedule/schedulereceipt.png"

function ScheduleCard({id, name}) {
    return (
        <div className="schedule-card">
            <p>{name}</p>
            <img className="schedule-receipt" src={schedulereceipt} alt="영수증 사진" />
        </ div>
    )
}

export default ScheduleCard