import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./AlarmList.css";
import BackButton from "../common/BackButton";
import EmptyAlarm from "../../assets/icons/empty/alarm.png";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/icons/common/defaultProfile.png";

function AlarmList() {
  const [alarms, setAlarms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlarm = async () => {
      const response = await axiosInstance.get("/alarms");
      const sortedAlarms = response.data.data.sort((a, b) => b.id - a.id);

      setAlarms(sortedAlarms);
    };

    fetchAlarm();
  }, []);

  //선택된 알람 삭제하는 함수
  const deleteSelectedAlarms = async (alarmId) => {
    try {
      await axiosInstance.delete(`/alarms/${alarmId}`);
    } catch (error) {
      console.error("Failed to delete alarms:", error);
    }
  };

  const handleAlarm = (alarm) => {
    moveToPage(alarm?.type, alarm?.alarmDto);
    deleteSelectedAlarms(alarm.id);
  };

  const moveToPage = (type, alarmDto) => {
    switch (type) {
      // 최종 정산 동의 요청 및 최종 정산 송금 요청
      case 1:
      case 6:
        navigate("/receipt/bookmark", {
          state: { teamId: alarmDto.teamId, planId: alarmDto.planId },
        });
        break;

      // 최종 정산 이의 신청
      case 2:
        navigate("/receipt", {
          state: { teamId: alarmDto.teamId, planId: alarmDto.planId },
        });
        break;

      // 모임 추방 알림 (페이지 이동 없음)
      case 3:
        break;

      // 모임 가입 신청
      case 4:
        navigate(`/home/meeting/${alarmDto.teamId}/manage`);
        break;

      // 입금 알림
      case 5:
        navigate("/wallet");
        break;

      // 모임 요청 수락 알림
      case 7:
        navigate(`/home/meeting/${alarmDto.teamId}`);
        break;

      // 영수증 업로드 알림
      case 8:
        navigate("/receipt", {
          state: { teamId: alarmDto.teamId, planId: alarmDto.planId },
        });
        break;

      // 출금 알림
      case 9:
        navigate("/wallet");
        break;

      default:
        break;
    }
  };

  return (
    <div className="alarm-page">
      <div className="alarm-page-header-contianer">
        <BackButton />
        <h1 className="alarm-page-title">알림</h1>
      </div>
      <div className="alarm-list">
        {alarms.length > 0 &&
          alarms.map((alarm) => (
            <div key={alarm?.id} className="alarm-list-line">
              <button className="alarm-item" onClick={() => handleAlarm(alarm)}>
                <img
                  src={alarm?.image ? alarm.image : DefaultProfile}
                  alt="프로필 이미지"
                  className="alarm-item-img"
                />
                <span className="alarm-item-content">{alarm?.content}</span>
              </button>
            </div>
          ))}
      </div>
      {alarms.length === 0 && (
        <div className="empty-alarm-container">
          <img className="empty-alarm-image" src={EmptyAlarm} alt="" />
          <div className="alarm-no-content">알림이 없습니다</div>
        </div>
      )}
    </div>
  );
}

export default AlarmList;
