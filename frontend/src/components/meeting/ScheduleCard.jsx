import React from "react";
import { useNavigate } from "react-router-dom";

import "./ScheduleCard.css";
import schedulereceipt from "../../assets/schedule/schedulereceipt.png";

function ScheduleCard({ id, name, meetingName, meetingImg }) {
  const navigation = useNavigate();
  return (
    <div className="schedule-card">
      <div
        className="to-schedule-detail"
        onClick={() =>
          navigation(`schedule/${id}`, {
            state: { meetingName: meetingName, meetingImg: meetingImg },
          })
        }
      >
        {name}
      </div>
    </div>
  );
}

export default ScheduleCard;
