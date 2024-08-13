import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./AlarmList.css";
import BackButton from "../common/BackButton";

function AlarmList() {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchAlarm = async () => {
      const response = await axiosInstance.get("/alarms");
      const sortedAlarms = response.data.data.sort((a, b) => b.id - a.id);

      setAlarms(sortedAlarms);
      console.log(sortedAlarms);

    };

    fetchAlarm();
  }, [])

  return (
    <div className="alarm-page">
        <BackButton />
      <h1 className="alarm-page-title">알림</h1>
      <div className="alarm-list">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div key={alarm.id} className="alarm-item">
              <span className="alarm-content">{alarm?.content}</span>
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
