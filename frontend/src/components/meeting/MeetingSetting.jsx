import React from "react";

import "./MeetingSetting.css"
import MeetingParticipants from "./MeetingParticipants";
import MeetingParticipantManage from "./MeetingParticipantManage";

function MeetingSetting () {

    // 모임 인원 호출
    // 요청 호출

    const participants_mokup = [{name : "tngorla"},  {name : "tngorla"}, {name : "tngorla"}]
    const requests_mokup = [{name : "tngorla"},  {name : "tngorla"}, {name : "tngorla"}]

    return (
        <div>
            <div className="meeting-setting-member-manage-box">
                <div className="setting-member-manage">멤버 관리</div>
                <div className="part-code">참여코드 #980304</div>
            </div>

            <div className="hr"></div>

            <div>
                {/* 반복문 들어가야 한다. */}
                {participants_mokup.map((item, index) => 
                    <MeetingParticipants 
                        key={index}
                        name={item.name}
                    />

                )}
            </div>

            <div className="meeting-setting-request-manage-box">참여요청 관리</div>

            <div className="hr"></div>

            <div>
                {requests_mokup.map((item, index) => 
                    <MeetingParticipantManage 
                        key={index}
                        name={item.name}
                    />

                )}
            </div>

        </div>
    )
}

export default MeetingSetting