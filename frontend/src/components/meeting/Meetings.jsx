import React, { useEffect, useState } from "react";
import "./Meetings.css";
import BackButton from "../common/BackButton";
import MeetingCard from "./MeetingCard";
import alarm from "../../assets/icons/common/alarm.png";
import { useDispatch, useSelector } from "react-redux";
import { setMeetings } from "../../redux/slices/meetingSlice";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function Meetings() {
  const [forR, setForR] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // homemain에서 요청한 모임들 데이터 받기
  const myMeetings = useSelector((state) => state.meetings.list);

  // 렌더링됐을 때 나의 모임 요청
  useEffect(() => {
    loadingMemberData();
    // setIsCheckModalOpen(false)
  }, [forR]);

  // axios 함수
  const loadingMemberData = async () => {
    try {
      const response = await axiosInstance.get("/teams/members/me");
      dispatch(setMeetings(response.data.data)); // 리덕스 상태에 데이터 저장
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  return (
    <div className="meetings-container-box">
      <div className="meetings-header">
        <BackButton />
        <img
          className="meeting-alarm-button"
          src={alarm}
          alt="알람버튼"
          onClick={() => navigate("/alarm")}
        />
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
                  admin={item.admin}
                  setForR={setForR}
                  forR={forR}
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
