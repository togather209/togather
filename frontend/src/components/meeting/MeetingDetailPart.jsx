import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import MiddleButton from "../common/MiddleButton";
import ScheduleCard from "./ScheduleCard";

function MeetingDetailPart() {
  const navigation = useNavigate();
  const { id } = useParams();

  const [meetingDetail, setMeetingDetail] = useState({});
  const [meetingPlans, setMeetingPlans] = useState([]);

  useEffect(() => {
    meetingDetailInfo();
  }, []);

  const meetingDetailInfo = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}`);
      const data = response.data.data;

      // 데이터 역순으로 저장
      setMeetingDetail(data);
      const reversedPlans = data.plans.slice().reverse(); // 원본 배열을 변경하지 않고 복사하여 역순으로 변환
      setMeetingPlans(reversedPlans);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  if (Object.entries(meetingPlans).length === 0) {
    return (
      <div>
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
      </div>
    );
  }

  if (Object.entries(meetingPlans).length !== 0) {
    return (
      <div>
        <div className="yes-schedule-container">
          <div className="meetingdetail-schedule2">일정 목록</div>
          <div className="schedule-list-box">
            {meetingPlans.map((item, index) => (
              <ScheduleCard
                key={item.planId}
                id={item.planId}
                name={item.title}
                meetingName={meetingDetail.title}
                meetingImg={meetingDetail.teamImg}
              />
            ))}
          </div>
          <MiddleButton onClick={() => navigation("schedule-regist")}>
            + 일정 만들기
          </MiddleButton>
        </div>
      </div>
    );
  }

  return null; // 기본적으로 반환할 내용이 없을 때
}

export default MeetingDetailPart;
