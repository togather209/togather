import React, {useState, useEffect} from "react";
import "./ScheduleRegist.css"

import BackButton from "../common/BackButton"
import Button from "../common/Button"
import DatePicker from "./DatePicker"

function ScheduleRegist() {
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
    useEffect(() => {console.log(startDate, endDate)}, [startDate, endDate])

  return (
    <div className="schedule-regist">
      <div className="schedule-regist-container-box">
      <div>
        <BackButton />
      </div>

      <div className="schedule-regist-header">
        <p className="schedule-regist-header-text">어떤 일정인가요 ?</p>
        <p className="schedule-regist-header-desc-text">일정 정보를 입력해주세요</p>
      </div>

      <form className="schedule-regist-form" action="">
        <div className="schedule-regist-form-date-input">
        <p className="schedule-regist-form-date-input-text">일정 시작일 및 종료일</p>
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates
              setStartDate(start)
              setEndDate(end)
            }}
          />
          {/* <div>
            <p>시작일: {startDate ? startDate.toLocaleDateString() : '선택되지 않음'}</p>
            <p>종료일: {endDate ? endDate.toLocaleDateString() : '선택되지 않음'}</p>
          </div> */}
        </div>

      
        <div className="schedule-regist-input-box">
          <label htmlFor=""></label>
          <input className="schedule-regist-input-tag" type="text" placeholder="일정명" />
        </div>

        <div className="schedule-regist-input-box">
          <label htmlFor=""></label>
          <input className="schedule-regist-input-tag" type="text" placeholder="일정 설명" />
        </div>

        <Button type={"purple"}>생성</Button>
      </form>
      </div>
    
    </div>
  )
}

export default ScheduleRegist;
