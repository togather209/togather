import React, { useState } from "react";
// import "./CheckModal.css";
import axiosInstance from "../../utils/axiosInstance";
function ExitModal({
  isOpen,
  isClose,
  onConfirm,
  firstbutton,
  secondbutton,
  teamId,
  setForR,
  forR,
}) {
  const [teamIdNumber, setTeamIdNumber] = useState(teamId);
  console.log(teamIdNumber);
  // 모임 나가기 요청
  const exitMeeting = async () => {
    try {
      const response = await axiosInstance.delete(
        `/teams/${teamIdNumber}/members/me`
      );
      console.log(response);
      if (response) {
        isClose();
        setForR(!forR);
      }
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="exit-check-modal-overlay">
      <div className="exit-check-modal-content">
        <p className="exit-check-modal-text">정말로 나가시겠습니까 ?</p>
        <div className="exit-check-modal-buttons">
          <button className="exit-check-cancle" onClick={isClose}>
            {firstbutton}
          </button>
          <button className="exit-check-confirm" onClick={exitMeeting}>
            {secondbutton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExitModal;
