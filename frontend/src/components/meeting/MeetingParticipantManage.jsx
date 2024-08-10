import React from "react";
import { useParams } from "react-router-dom";
import "./MeetingParticipantManage.css"
import agree from "../../assets/meeting/agree.png"
import disagree from "../../assets/meeting/disagree.png"
import axiosInstance from "../../utils/axiosInstance";

function MeetingParticipantManage ({name, meetingDetail, guestId, forR, setForR, joinrequeststatus}) {
    const { id } = useParams()
    console.log(id)
    console.log(joinrequeststatus)

    // 참여요청 수락 axios
    const joinRequestAccept = async () => {
    try {
        const response = await axiosInstance.post(`/teams/${id}/join-requests/${guestId}/accept`);
        setForR(!forR)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }

    // 참여요청 거절 axios
    const joinRequestReject = async () => {
    try {
        const response = await axiosInstance.post(`/teams/${id}/join-requests/${guestId}/reject`);
        setForR(!forR)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }

  if (joinrequeststatus === 0) {
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
}

export default MeetingParticipantManage