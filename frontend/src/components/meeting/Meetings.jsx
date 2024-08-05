import React from "react";
import "./Meetings.css";
// import promimg from "../../../public/다운로드.jpg";
import BackButton from "../common/BackButton";
import MeetingCard from "./MeetingCard";
import alarm from "../../assets/icons/common/alarm.png";
import { useNavigate, useLocation } from "react-router-dom";

function Meetings() {

  // homemain에서 요청한 모임들 데이터 받기
  const location = useLocation();
  const { myMeetings } = location.state || {};

  return (
    <div>
      <div className="meetings-header">
        <BackButton />
        <img className="meeting-alarm-button" src={alarm} alt="알람버튼" />
      </div>
      <div className="meetings">
        <div className="meetings-container">
          <div className="meetings-list">
            <div className="meetings-list-header">
              <p className="my-meetings">나의 모임</p>
              <p className="desc">모임을 더 쉽고 간편하게 !</p>
            </div>
            <div className="meetings-card-container">
              {myMeetings.map((item, index) => (
                <MeetingCard
                  key={item.teamId}
                  id={item.teamId}
                  name={item.title}
                  image_url={item.teamImg}
                  desc={item.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meetings;
