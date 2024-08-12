import React, { useState } from "react";
// import "./CheckModal.css";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

function ScheduleDeleteModal({
  teamId,
  planId,
  isExitModalOpen,
  setIsExitModalOpen,
}) {
  const navigation = useNavigate();

  // 일정 삭제 axios 요청
  const scheduleExit = async () => {
    try {
      const response = await axiosInstance.delete(
        `/teams/${teamId}/plans/${planId}`
      );
      console.log(response.data);
      navigation(`/home/meeting/${teamId}`);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  if (!isExitModalOpen) return null;

  return (
    <div className="exit-check-modal-overlay">
      <div className="exit-check-modal-content">
        <p className="exit-check-modal-text">정말로 삭제하시겠습니까 ?</p>
        <div className="exit-check-modal-buttons">
          <button
            className="exit-check-cancle"
            onClick={() => setIsExitModalOpen(null)}
          >
            취소
          </button>
          <button className="exit-check-confirm" onClick={scheduleExit}>
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDeleteModal;
