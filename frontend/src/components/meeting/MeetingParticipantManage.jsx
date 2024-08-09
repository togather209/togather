import React from "react";
import { useParams } from "react-router-dom";
import "./MeetingParticipantManage.css"
import agree from "../../assets/meeting/agree.png"
import disagree from "../../assets/meeting/disagree.png"
import axiosInstance from "../../utils/axiosInstance";

function MeetingParticipantManage ({name, meetingDetail, guestId}) {
    const { id } = useParams()
    console.log(id)
    // 참여 인원 조회
    const joinRequestAccept = async () => {
    try {
        const response = await axiosInstance.post(`/teams/${id}/join-requests/${guestId}/accept`);
        // setJoinMember(response.data.data)
        // console.log(joinMember)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }

    const joinRequestReject = async () => {
    try {
        const response = await axiosInstance.post(`/teams/${id}/join-requests/${guestId}/reject`);
        // setJoinMember(response.data.data)
        // console.log(joinMember)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }


    return (
        <div className="meeting-participant-request-box">
            <p className="meeting-participant-name">{ name }</p>
            <div>
                <img onClick={joinRequestAccept} className="meeting-request-icon" src={agree} alt="수락" />
                <img onClick={joinRequestReject} className="meeting-request-icon" src={disagree} alt="거절" />
            </div>
        </div>
    )
}

export default MeetingParticipantManage