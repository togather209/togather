import React from "react";
import "./MeetingCard.css"
import { useNavigate } from "react-router-dom";
import Delete from "../../assets/meeting/delete.png"
import Change from "../../assets/meeting/change.png"
import Out from "../../assets/meeting/out.png"
import axiosInstance from "../../utils/axiosInstance";

function MeetingCard({id, image_url, name, desc}) {
    const navigation = useNavigate()

    // 모임장인지 아닌지 나타내는 상태 (임시)
    const a = true

    // 모임 삭제 요청 axios
    const deleteMeeting = async () => {
        try {
          const response = await axiosInstance.delete(`/teams/${id}`);
          // 리덕스 상태에 데이터 저장
        //   dispatch(setMeetings(response.data.data)); 
            console.log(response)
        } catch (error) {
          console.error('데이터 불러오기 실패', error);
        }
      };

    return (

        <div className="meeting-card">
            <div onClick={() => navigation(`${id}`)}>
                <img className="meeting-img" src={image_url} alt="" />
                <div className="text-section">
                    <h3 className="title">{name}</h3>
                    <p className="desc">{desc}</p>
                </div>
            </div>
            
            <div className="button-section">
                { a ? (
                    <div>
                        <button className="meeting-card-button-form"><img className="update-button" src={Change} alt="수정버튼" /></button>
                        <button onClick={deleteMeeting} className="meeting-card-button-form"><img className="delete-button" src={Delete} alt="삭제버튼" /></button>
                    </div>
                ) : (
                    <button className="meeting-card-button-form"><img src={Out} alt="나가기버튼" /></button>
                )}
            </div>
        </div>

    )
    
}

export default MeetingCard