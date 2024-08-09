import React from "react";

import "./MeetingSetting.css"
import MeetingParticipants from "./MeetingParticipants";
import MeetingParticipantManage from "./MeetingParticipantManage";

function MeetingSetting ({ joinMembersRequest, meetingDetail, joinMember }) {

    // 모임 인원 호출
    // 요청 호출

    return (
        <div>
            <div className="meeting-setting-member-manage-box">
                <div className="setting-member-manage">멤버 관리</div>
                <div className="part-code">{meetingDetail.code}</div>
            </div>

            <div className="hr"></div>

            <div>
                {/* 반복문 들어가야 한다. */}
                {joinMember.map((item, index) => 
                    <MeetingParticipants 
                        key={index}
                        name={item.nickname}
                        guestId={item.memberId}
                        meetingDetail={meetingDetail}
                    />

                )}
            </div>

            <div className="meeting-setting-request-manage-box">참여요청 관리</div>

            <div className="hr"></div>

            <div>
                {joinMembersRequest.map((item, index) => 
                    <MeetingParticipantManage 
                        key={index}
                        name={item.nickname}
                        guestId={item.memberId}
                        meetingDetail={meetingDetail}
                    />

                )}
            </div>

        </div>
    )
}

export default MeetingSetting