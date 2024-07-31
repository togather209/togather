import { useState, useEffect } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./MeetingDetail.css"
import meetingsetting from "../../assets/meeting/meetingsetting.png"
import promimg from "../../../public/다운로드.jpg"
import BackButton from "../common/BackButton";
import MiddleButton from "../common/MiddleButton"
import ScheduleCard from "./ScheduleCard";

function MeetingDetail() {
  const [isPage, setIsPage] = useState(false)
  const params = useParams();
  const navigation = useNavigate()
  // 모임 디테일 단일 조회
  // 모임과 관련된 일정들 조회

  const schedule_mokup = [
    {
      id: 1,
      name : "우리의 첫번째 여행",
    },
    {
      id: 2,
      name : "우리의 두번째 여행",
    },
    {
      id: 3,
      name : "우리의 세번째 여행",
    },
  ]


  if (!isPage) {
    return (
      <div className="none-meetingdetail">
        <div className="none-meetingdetail-header">
          <BackButton />
          <div className="none-meetingdetail-header-setting">
            <p className="meeting-setting-text">모임관리</p>
            <img className="meeting-setting" src={meetingsetting} alt="settingicon" />
          </div>
        </div>
        
        <div className="meeting-info-container">
          <img className="meetingdetail-img" src={promimg} alt="모임 이미지" />
          <div className="overlay">
            <p className="meeting-name-in-detail">모임명</p>
            <p className="meeting-desc-in-detail">모임 설명</p>
          </div>
        </div>


        <div className="meetingdetail-schedule">일정</div>

        <div className="no-schedule-box">
          <p className="no-schedule-text">등록된 일정이 없습니다</p>
          <p className="make-new-schedule">새로운 일정을 만들어 보세요 !</p>
        </div>

        <MiddleButton onClick={() => navigation("schedule-regist")}>+ 일정 만들기</MiddleButton>

      </div>
    )
  }

  if (isPage) {
    return (
      <div className="none-meetingdetail">
      <div className="none-meetingdetail-header">
        <BackButton />
        <div className="none-meetingdetail-header-setting">
          <p className="meeting-setting-text">모임관리</p>
          <img className="meeting-setting" src={meetingsetting} alt="settingicon" />
        </div>
      </div>
      
      <div className="meeting-info-container">
          <img className="meetingdetail-img" src={promimg} alt="모임 이미지" />
          <div className="overlay">
            <p className="meeting-name-in-detail">모임명</p>
            <p className="meeting-desc-in-detail">모임 설명</p>
          </div>
        </div>

      <div className="meetingdetail-schedule2">일정 목록</div>

      <div className="schedule-list-box">

        {schedule_mokup.map((item, index) => (
          <ScheduleCard 
          key={item.id}
          id={item.id}
          name={item.name}
          />
        ))}

      </div>

      <MiddleButton onClick={() => navigation("schedule-regist")}>+ 일정 만들기</MiddleButton>

    </div>
    )
  }

  // <div>미팅 상세{params.id}</div>;
}

export default MeetingDetail;
