import React from "react";
import { useNavigate } from "react-router-dom";

import "./ScheduleCard.css";
import schedulereceipt from "../../assets/schedule/schedulereceipt.png";

function ScheduleCard({ id, name, meetingName }) {
  const navigation = useNavigate();
  return (
    <div className="schedule-card">
      <div
        className="to-schedule-detail"
        onClick={() =>
          navigation(`schedule/${id}`, { state: { meetingName: meetingName } })
        }
      >
        {name}
      </div>
      <img
        className="schedule-receipt"
        onClick={() => navigation("/receipt/regist-form")}
        src={schedulereceipt}
        alt="영수증 사진"
      />
    </div>
  );
}

export default ScheduleCard;
