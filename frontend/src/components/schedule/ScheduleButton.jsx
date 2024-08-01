import React from "react";
import "./ScheduleButton.css";

function ScheduleButton({ children, type, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`schedule-button schedule-button-${type}`}
    >
      {children}
    </button>
  );
}

export default ScheduleButton;
