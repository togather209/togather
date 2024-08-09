import React from "react";
import "./MeetingParticipants.css"
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function MeetingParticipants ({name, guestId}) {
    
    const { id } = useParams()
    console.log(id)
    console.log(guestId)

    const memberDelete = async () => {

        try {
            const response = await axiosInstance.delete(`/teams/${id}/members/${guestId}`);
            // setJoinMember(response.data.data)
            // console.log(joinMember)
        } catch (error) {
          console.error("데이터 불러오기 실패", error)
        }
      }

    return (
        <div className="meeting-participants-box">
            <p>{ name }</p>
            <button onClick={memberDelete} className="naga-button">추방</button>
        </div>
    )
}

export default MeetingParticipants