import React from "react";

import "./ScheduleDetail.css"

import BackButton from "../common/BackButton";
import alarm from "../../assets/icons/common/alarm.png"

function ScheduleDetail () {
    return (
        <div className="schedule-detail">
            <div className="schedule-detail-header">
                <BackButton></BackButton>
                <input className="schedule-detail-header-search" type="text" placeholder="장소 검색" />
                <img className="schedule-detail-alarm-icon" src={alarm} alt="알람" />
            </div>
            <div className="">
                <div>
                    <p>이미지</p>
                    <p>모임명</p>
                    <p>일정명</p>
                    <button>나가기 버튼</button>
                </div>
                <div>
                    <p>일정 설명</p>
                    <button>영수증 조회</button>
                </div>
            </div>
        </div>
    )
}

export default ScheduleDetail