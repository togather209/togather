import React from "react";
import "./FinishedScheduleButton.css";
import NextButton from "../../../assets/receipt/next.png";

function FinishedScheduleButton({ status, onClick }) {
  return (
    <>
      {status >= 1 && status <= 3 && (
        <button className="finished-schedule-button after" onClick={onClick}>
          <div className="finished-schedule-button-text">
            <span>종료된 일정입니다</span>
            <span>최종 정산 내역을 확인해보세요 !</span>
          </div>
          <img className="next-button" src={NextButton} alt="next" />
        </button>
      )}
      {status === 4 && (
        <button className="finished-schedule-button complete" onClick={onClick}>
          <div className="finished-schedule-button-text">
            <span>정산 완료딘 일정입니다</span>
            <span>최종 정산 내역을 확인해보세요 !</span>
          </div>
          <img className="next-button" src={NextButton} alt="next" />
        </button>
      )}
    </>
  );
}

export default FinishedScheduleButton;
