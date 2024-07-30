import React from 'react';
import './FinishedScheduleButton.css'; // 실제 스타일 시트 이름으로 변경하세요.
import NextButton from '../../../assets/receipt/next.png';

function FinishedScheduleButton({ scheduleState, onClick }) {
  return (
    <>
      {scheduleState === 'after' && (
        <button className="finished-schedule-button after" onClick={onClick}>
          <div className="finished-schedule-button-text">
            <span>종료된 일정입니다</span>
            <span>최종 정산 내역을 확인해보세요 !</span>
          </div>
          <img className='next-button' src={NextButton} alt="next" />
        </button>
      )}
      {scheduleState === 'complete' && (
        <button className="finished-schedule-button complete" onClick={onClick}>
          <div className="finished-schedule-button-text">
            <span>정산 완료딘 일정입니다</span>
            <span>최종 정산 내역을 확인해보세요 !</span>
          </div>
          <img className='next-button' src={NextButton} alt="next" />
        </button>
      )}
    </>
  );
}

export default FinishedScheduleButton;
