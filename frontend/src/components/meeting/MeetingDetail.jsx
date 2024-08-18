import { useState, useEffect } from "react";
import React from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import "./MeetingDetail.css";
import meetingsetting from "../../assets/meeting/meetingsetting.png";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";
import defaultImage from "../../assets/meeting/defaultMeeting.png";

import MeetingDetailPart from "./MeetingDetailPart";
import MeetingSetting from "./MeetingSetting";
import { useSelector } from "react-redux";

function MeetingDetail({ folderName }) {
  const navigation = useNavigate();

  const [isManageOpen, setIsManageOpen] = useState(false);

  const handleIsManageOpen = () => {
    setIsManageOpen(true);
  };

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
    joinMembers();

  }, []);

  // 모임 상세 요청
  const meetingDetailInfo = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}`);
      await setMeetingDetail(response.data.data);
      if (response.data.data.admin) {
        wantJoinMembers();
      }
      setMeetingPlans(response.data.data.plans);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  // 참여 요청 인원 조회
  const wantJoinMembers = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}/join-requests`);
      setJoinMembersRequest(response.data.data);
    } catch (error) {
      console.error("모임장이 아니라 요청 인원 조회가 안되서 그런거임.");
    }
  };

  // 참여 인원 조회
  const joinMembers = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}/members`);
      setJoinMember(response.data.data);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage; // 이미지 로드 실패 시 디폴트 이미지로 변경
  };

  return (
    <div className="none-meetingdetail">
      <div className="none-meetingdetail-header">
        <BackButton />
        {meetingDetail.admin && !isManageOpen ? (
          <div
            className="none-meetingdetail-header-setting"
            onClick={() =>
              navigation(`/home/meeting/${id}/manage`, {
                state: {
                  teamName: meetingDetail.title,
                  teamDesc: meetingDetail.description,
                  teamImg: meetingDetail.teamImg,
                  teamCode: meetingDetail.code,
                },
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
        ) : (
          <></>
        )}
      </div>

      <div className="meeting-info-container">
        <img
          className="meetingdetail-img"
          src={meetingDetail.teamImg || defaultImage} // 디폴트 이미지 사용
          alt="모임 이미지"
          onError={handleImageError} // 이미지 로드 실패 시 핸들러 호출
        />
        <div className="overlay"></div>
        <div className="text-overlay">
          <p className="meeting-name-in-detail">{meetingDetail.title}</p>
          <p className="meeting-desc-in-detail">{meetingDetail.description}</p>
        </div>
      </div>

      {!isManageOpen ? (
        <MeetingDetailPart></MeetingDetailPart>
      ) : (
        <MeetingSetting></MeetingSetting>
      )}

      {/* <Outlet /> */}
    </div>
  );
}

export default MeetingDetail;
