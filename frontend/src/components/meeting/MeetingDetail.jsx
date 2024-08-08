import { useState, useEffect } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./MeetingDetail.css";
import meetingsetting from "../../assets/meeting/meetingsetting.png";
import promimg from "../../../public/다운로드.jpg";
import BackButton from "../common/BackButton";
import MiddleButton from "../common/MiddleButton";
import ScheduleCard from "./ScheduleCard";
import MeetingSetting from "./MeetingSetting";
import axiosInstance from "../../utils/axiosInstance";

function MeetingDetail() {
  const navigation = useNavigate();

  // id 파라미터 값을 받음
  const { id } = useParams()
  // 모임 디테일 객체 상태
  const [meetingDetail, setMeetingDetail] = useState({})
  
  // 일정은 plans로 들어온다. => meetingDetail.plan
  
  // 미팅 창 상태
  const [meetingSetting, setMeetingSetting] = useState(false);
  
  // 미팅 세팅 창 열고, 닫기 함수
  const handleSetting = () => {
    setMeetingSetting(!meetingSetting);
  };
  

  // 해당 페이지 렌더링 되면 모임 상세 조회
  useEffect(() => {
    meetingDetailInfo()
  }, [])  // => 이거 의존성 해치우고 싶다.

  // 모임 상세 요청
  const meetingDetailInfo = async () => {
    try {
        const response = await axiosInstance.get(`/teams/${id}`);
        setMeetingDetail(response.data.data)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }


  console.log(meetingDetail)


  if (Object.entries(meetingDetail).length === 0) {
    return (
      <div className="none-meetingdetail">
        <div className="none-meetingdetail-header">
          <BackButton />
          <div
            className="none-meetingdetail-header-setting"
            onClick={handleSetting}
          >
            <p className="meeting-setting-text">모임관리</p>
            <img
              className="meeting-setting"
              src={meetingsetting}
              alt="settingicon"
            />
          </div>
        </div>

        <div className="meeting-info-container">
          <img className="meetingdetail-img" src={meetingDetail.teamImg} alt="모임 이미지" />
          <div className="overlay">
            <p className="meeting-name-in-detail">{meetingDetail.title}</p>
            <p className="meeting-desc-in-detail">{meetingDetail.description}</p>
          </div>
        </div>

        {meetingSetting ? (
          <MeetingSetting></MeetingSetting>
        ) : (
          <div className="meeting-detail-no-schedule-container">
            <div className="meetingdetail-schedule">일정</div>

            <div className="no-schedule-box">
              <p className="no-schedule-text">등록된 일정이 없습니다</p>
              <p className="make-new-schedule">새로운 일정을 만들어 보세요 !</p>
              <MiddleButton onClick={() => navigation("schedule-regist")}>
                + 일정 만들기
              </MiddleButton>
              
            </div>
          </div>
        )}
      </div>
    );
  }
  // Object.entries(emptyObject).length === 0
  if (Object.entries(meetingDetail).length !== 0) {
    return (
      <div className="none-meetingdetail">
        <div className="none-meetingdetail-header">
          <BackButton />
          <div
            className="none-meetingdetail-header-setting"
            onClick={handleSetting}
          >
            <p className="meeting-setting-text">모임관리</p>
            <img
              className="meeting-setting"
              src={meetingsetting}
              alt="settingicon"
            />
          </div>
        </div>

        <div className="meeting-info-container">
          <img className="meetingdetail-img" src={promimg} alt="모임 이미지" />
          <div className="overlay">
            <p className="meeting-name-in-detail">{meetingDetail.title}</p>
            <p className="meeting-desc-in-detail">{meetingDetail.description}</p>
          </div>
        </div>

        <div className="meetingdetail-schedule2">일정 목록</div>

        <div className="schedule-list-box">
          {meetingDetail.plans.map((item, index) => (
            <ScheduleCard key={item.planId} id={item.planId} name={item.title} />
          ))}
        </div>

        <MiddleButton onClick={() => navigation("schedule-regist")}>
          + 일정 만들기
        </MiddleButton>
      </div>
    );
  }

  // <div>미팅 상세{params.id}</div>;
}

export default MeetingDetail;
