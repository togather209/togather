import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./MeetingSetting.css";
import MeetingParticipants from "./MeetingParticipants";
import MeetingParticipantManage from "./MeetingParticipantManage";
import axiosInstance from "../../utils/axiosInstance";
import BackButton from "../common/BackButton";
import defaultImage from "../../assets/meeting/defaultMeeting.png";
import Modal from "../common/Modal";

function MeetingSetting() {
  const { id } = useParams();
  const [joinMembersRequest, setJoinMembersRequest] = useState([]);
  const [joinMember, setJoinMember] = useState([]);

  const [copySuccess, setCopySuccess] = useState(false);

  const location = useLocation();
  const state = location.state;

  const [forR, setForR] = useState(true);

  useEffect(() => {
    wantJoinMembers();
    joinMembers();
  }, [forR]);

  // 참여 요청 인원 조회
  const wantJoinMembers = async () => {
    try {
      const response = await axiosInstance.get(`/teams/${id}/join-requests`);
      setJoinMembersRequest(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
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

  const copyToClipboard = () => {
    if (state && state.teamCode) {
      navigator.clipboard
        .writeText(state.teamCode)
        .then(() => {
          setCopySuccess(true);
        })
        .catch((err) => {
          setCopySuccess(false);
        });
    }
  };

  return (
    <div className="none-meetingdetail">
      <div className="none-meetingdetail-header">
        <BackButton />
      </div>

      <div className="meeting-info-container">
        <img
          className="meetingdetail-img"
          src={state?.teamImg || defaultImage} // 디폴트 이미지 사용
          alt="모임 이미지"
          onError={handleImageError} // 이미지 로드 실패 시 핸들러 호출
        />
        <div className="overlay">
          <p className="meeting-name-in-detail">{state.title}</p>
          <p className="meeting-desc-in-detail">{state.description}</p>
        </div>
      </div>

      <div>
        <div className="meeting-setting-member-manage-box">
          <div className="setting-member-manage">멤버 관리</div>
          <div
            className="part-code"
            onClick={copyToClipboard}
            style={{ cursor: "pointer" }}
          >
            {state?.teamCode}
          </div>
          {copySuccess && (
            <Modal
              mainMessage={"초대코드가 복사됐어요!"}
              onClose={() => setCopySuccess(false)}
            />
          )}
        </div>
        <div className="hr"></div>
        <div>
          {joinMember.map((item, index) => (
            <MeetingParticipants
              key={index}
              name={item.nickname}
              guestId={item.memberId}
              forR={forR}
              setForR={setForR}
            />
          ))}
        </div>

        <div className="meeting-setting-request-manage-box">참여요청 관리</div>

        <div className="hr"></div>

        <div>
          {joinMembersRequest.map((item, index) => (
            <MeetingParticipantManage
              key={index}
              name={item.nickname}
              guestId={item.memberId}
              forR={forR}
              setForR={setForR}
              joinrequeststatus={item.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeetingSetting;
