import React from "react";
import "./MeetingParticipants.css"

function MeetingParticipants ({name}) {
    return (
        <div className="meeting-participants-box">
            <p>{ name }</p>
            <button className="naga-button">추방</button>
        </div>
    )
}

export default MeetingParticipants