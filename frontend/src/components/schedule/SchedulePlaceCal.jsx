import React, { useState } from "react";

import "./SchedulePlaceCal.css";

//임시 이미지
import mayjip from "../../assets/schedule/mayjip.jpg";

import Close from "../../assets/icons/common/close.png";
import SelectDatePicker from "./SelectDatePicker";
// import MiddleButton from "../../common/MiddleButton";

function SchedulePlaceCal({ onClose, onConfirm, firstDate, lastDate, name }) {
  console.log(firstDate);
  return (
    <div className="schedule-place-container">
      <div className="close-button-container">
        <img src={Close} onClick={onClose} alt="닫기 버튼" />
      </div>

      <div className="schedule-place-cal-body">
        <img className="date-setting-img" src={mayjip} alt="임시" />
        <div>
          <p className="schedule-place-cal-name">{name}에</p>
          <p className="when-visit">언제 방문할 계획이신가요 ?</p>
        </div>
      </div>

      <div className="purple-hr"></div>

      <SelectDatePicker firstDate={firstDate} lastDate={lastDate} />

      <form action="">
        <button className="schedule-place-cal-button" onClick={onConfirm}>
          확인
        </button>
      </form>
    </div>
  );
}

export default SchedulePlaceCal;
