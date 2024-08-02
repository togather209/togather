import React from "react";
import "./MeetingParticipantManage.css"
import agree from "../../assets/meeting/agree.png"
import disagree from "../../assets/meeting/disagree.png"

function MeetingParticipantManage ({name}) {
    return (
        <div className="meeting-participant-request-box">
            <p className="meeting-participant-name">{ name }</p>
            <div>
                <img className="meeting-request-icon" src={agree} alt="수락" />
                <img className="meeting-request-icon" src={disagree} alt="거절" />
            </div>
        </div>
    )
}

export default MeetingParticipantManage