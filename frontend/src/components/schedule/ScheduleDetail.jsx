import React, {useState, useEffect, useCallback} from "react";

import "./ScheduleDetail.css";
import meetingimg from "../../../public/다운로드.jpg";
import alarm from "../../assets/icons/common/alarm.png";
import exit from "../../assets/schedule/scheduleexit.png";
import heart from "../../assets/schedule/scheduleheartimg.png";

import BackButton from "../common/BackButton";
import ScheduleButton from "./ScheduleButton";
import ScheduleDates from "./ScheduleDates";
import ScheduleWeekdays from "./ScheduleWeekdays";

function ScheduleDetail() {

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        // 시간을 자정으로 설정
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const [startDate, setStartDate] = useState(parseDate('Thu AUG 1 2024 00:00:00 GMT+0900 (한국 표준시)')); // 예시 날짜
    const [endDate, setEndDate] = useState(parseDate('Sun AUG 4 2024 00:00:00 GMT+0900 (한국 표준시)'));   // 예시 날짜
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0'); // 날짜를 두 자리로 맞추기 위해 padStart 사용
        return `${year}-${month}-${day}`;
    };

    const getDatesWithWeekdays = (start, end) => {
        let dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            dates.push({
                date: formatDate(currentDate), // 변환된 날짜
                weekday: daysOfWeek[dayOfWeek]
            });

            // 다음 날짜로 이동
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // console.log(dates)

        return dates;
    };

        const datedata = getDatesWithWeekdays(startDate, endDate)
        console.log(datedata)


        
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
           
          <div className="schedule-detail-like">찜</div>
            {datedata.map((item, index) => 
                     <ScheduleWeekdays key={index}>{item.weekday}</ScheduleWeekdays>
                 )}

        </div>
        <div className="schedule-detail-weekdays">
          <img
            className="schedule-detail-like-icon"
            src={heart}
            alt="찜 아이콘"
          />
           {datedata.map((item, index) => 
                    <ScheduleDates key={index}>{parseInt(item.date.split('-')[2])}</ScheduleDates>
                )}
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
