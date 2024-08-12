import { useState, useEffect } from "react";
import React from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import "./MeetingDetail.css";
import meetingsetting from "../../assets/meeting/meetingsetting.png";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";

function MeetingDetail() {
  const navigation = useNavigate();

  // id 파라미터 값을 받음
  const { id } = useParams();
  // 모임 디테일 객체 상태
  const [meetingDetail, setMeetingDetail] = useState({});
  const [meetingPlans, setMeetingPlans] = useState([]);

  const [joinMembersRequest, setJoinMembersRequest] = useState([]);
  const [joinMember, setJoinMember] = useState([]);

  // 해당 페이지 렌더링 되면 모임 상세 조회
  useEffect(() => {
    meetingDetailInfo();
    wantJoinMembers();
    joinMembers();
  }, []); // => 이거 의존성 해치우고 싶다.

  // 모임 상세 요청
  const meetingDetailInfo = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}`);
      setMeetingDetail(response.data.data);
      setMeetingPlans(response.data.data.plans);
      console.log(response.data.data);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  // 참여 요청 인원 조회
  const wantJoinMembers = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}/join-requests`);
      setJoinMembersRequest(response.data.data);
      // console.log(response.data.data)
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  // 참여 인원 조회
  const joinMembers = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}/members`);
      setJoinMember(response.data.data);
      // console.log(joinMember)
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  return (
    <div className="none-meetingdetail">
      <div className="none-meetingdetail-header">
        <BackButton />
        <div
          className="none-meetingdetail-header-setting"
          onClick={() =>
            navigation(`/home/meeting/${id}/manage`, {
              state: { code: meetingDetail.code },
            })
          }
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
        <img
          className="meetingdetail-img"
          src={meetingDetail.teamImg}
          alt="모임 이미지"
        />
        <div className="overlay">
          <p className="meeting-name-in-detail">{meetingDetail.title}</p>
          <p className="meeting-desc-in-detail">{meetingDetail.description}</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default MeetingDetail;
