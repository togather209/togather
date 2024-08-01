import React from "react";

import "./ScheduleDetail.css";
import meetingimg from "../../../public/다운로드.jpg";
import alarm from "../../assets/icons/common/alarm.png";
import exit from "../../assets/schedule/scheduleexit.png";
import heart from "../../assets/schedule/scheduleheartimg.png";

import BackButton from "../common/BackButton";
import ScheduleButton from "./ScheduleButton";

function ScheduleDetail() {
  return (
    <div className="schedule-detail">
      <div className="schedule-detail-header">
        <BackButton></BackButton>
        <input
          className="schedule-detail-header-search"
          type="text"
          placeholder="장소 검색"
        />
        <img className="schedule-detail-alarm-icon" src={alarm} alt="알람" />
      </div>
      <div className="schedule-detail-middle-box">
        <div className="schedule-detail-middle-info">
          <img
            className="schedule-detail-small-img"
            src={meetingimg}
            alt="모임 사진"
          />
          <div className="schedule-detail-first-section">
            <div>
              <p className="schedule-detail-meeting-name">모임명</p>
              <p className="schedule-detail-schedule-name">일정명</p>
            </div>
            <img className="schedule-exit-img" src={exit} alt="일정 나가기" />
          </div>
        </div>
        <div className="schedule-detail-second-section">
          <p className="schedule-detail-schedule-name">일정 설명</p>
          <ScheduleButton type={"purple"} onClick={() => {}}>
            영수증 조회
          </ScheduleButton>
        </div>
      </div>
      <div className="schedule-detail-date-box">
        <div className="schedule-detail-weekdays">
          <div className="schedule-detail-weekdays-element">찜</div>
          <div className="schedule-detail-weekdays-element">F</div>
          <div className="schedule-detail-weekdays-element">S</div>
          <div className="schedule-detail-weekdays-element">T</div>
        </div>
        <div className="schedule-detail-weekdays">
          <img
            className="schedule-detail-weekdays-element"
            src={heart}
            alt="찜 아이콘"
          />
          <div className="schedule-detail-weekdays-element">15</div>
          <div className="schedule-detail-weekdays-element">16</div>
          <div className="schedule-detail-weekdays-element">17</div>
        </div>
      </div>

      <div className="schedule-detail-place-list-box">
        <p className="schedule-detail-choose-date-text">
          장소를 클릭해 방문일을 변경해보세요 !
        </p>
        {/* 여기서 map 사용?? */}
        {/* 일단 카드를 만들어야 한다. 그리고 로직 생각해보자
        생각해 볼것 1. 날짜 클릭했을 때 보이는 장소 달라야 한다 2. 등등 */}
      </div>
    </div>
  );
}

export default ScheduleDetail;
