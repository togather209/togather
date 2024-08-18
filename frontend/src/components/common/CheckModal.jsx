import React, { useState } from "react";
import "./CheckModal.css";
import axiosInstance from "../../utils/axiosInstance";

function CheckModal({
  isOpen,
  isClose,
  onConfirm,
  firstbutton,
  secondbutton,
  teamId,
  setForR,
  forR,
}) {
  const [teamIdNumber, setTeamIdNumber] = useState(teamId)
  const [isError, setIsError] = useState(false);

  // 모임 삭제 요청 axios
  const deleteMeeting = async () => {
    try {
      const response = await axiosInstance.delete(`/teams/${teamIdNumber}`);
      console.log(response);
      if (response) {
        isClose();
        setForR(!forR);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="exit-check-modal-overlay">
      {!isError ? (
        <div className="exit-check-modal-content">
          <p className="exit-check-modal-text">정말로 삭제하시겠습니까 ?</p>
          <div className="exit-check-modal-buttons">
            <button className="exit-check-cancle" onClick={isClose}>
              {firstbutton}
            </button>
            <button className="exit-check-confirm" onClick={deleteMeeting}>
              {secondbutton}
            </button>
          </div>
        </div>
      ) : (
        <div className="exit-check-modal-content">
          <p className="exit-check-modal-text">
            일정이 남아있어 모임을 삭제할 수 없습니다
          </p>
          <div className="exit-check-modal-buttons">
            <button
              className="exit-check-cancle"
              onClick={() => {
                setIsError(false);
                isClose();
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckModal;
