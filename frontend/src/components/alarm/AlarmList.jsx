import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./AlarmList.css";
import BackButton from "../common/BackButton";

function AlarmList() {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchAlarm = async () => {
      const response = await axiosInstance.get("/alarms");
      console.log(response.data);
      setAlarms(response.data.data);
      console.log(alarms);
    };

    fetchAlarm();
  }, [])

  return (
    <div className="alarm-page">
      <div className="alarm-page-header">
        <BackButton />
        <h1 className="alarm-page-title">알림</h1>
      </div>
      <div className="alarm-list">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div key={alarm.id} className="alarm-item">
              <p className="alarm-message">{alarm?.title}</p>
              <span className="alarm-timestamp">{alarm?.content}</span>
            </div>
          ))
        ) : (
          <p>알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default AlarmList;
