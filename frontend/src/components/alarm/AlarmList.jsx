import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./AlarmList.css";
import BackButton from "../common/BackButton";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";
function AlarmList() {
  const [alarms, setAlarms] = useState([]);
  const [selectedAlarms, setSelectedAlarms] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const [deleteAlarm, setDeleteAlarm] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchAlarm = async () => {
      const response = await axiosInstance.get("/alarms");
      const sortedAlarms = response.data.data.sort((a, b) => b.id - a.id);

      setAlarms(sortedAlarms);
    };

    fetchAlarm();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAlarms([]);
    } else {
      const allAlarmIds = alarms.map((alarm) => alarm.id);
      setSelectedAlarms(allAlarmIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAlarm = (alarmId) => {
    if (selectedAlarms.includes(alarmId)) {
      setSelectedAlarms(selectedAlarms.filter((id) => id !== alarmId));
      console.log(alarmId);
    } else {
      setSelectedAlarms([...selectedAlarms, alarmId]);
    }
  };

  //선택된 알람 삭제하는 함수
  const deleteSelectedAlarms = async () => {
    try {
      await Promise.all(
        selectedAlarms.map(
          (alarmId) => axiosInstance.delete(`/alarms/${alarmId}`),
          setCount(count + 1)
        )
      );
      setAlarms(alarms.filter((alarm) => !selectedAlarms.includes(alarm.id)));
      setSelectedAlarms([]);
      setSelectAll(false);
      setDeleteAlarm(true);
    } catch (error) {
      console.error("Failed to delete alarms:", error);
    }
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
      <BackButton />
      <h1 className="alarm-page-title">알림</h1>
      <div className="alarm-controls">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="alarm-select-all-checkbox"
        />
        <label className="alarm-select-all-label">전체 선택</label>
        <button
          className="alarm-delete-button"
          onClick={deleteSelectedAlarms}
          disabled={selectedAlarms.length === 0}
        >
          삭제
        </button>
        {deleteAlarm && (
          <Modal
            mainMessage={`${count}개 알림이 삭제 되었습니다.`}
            onClose={() => {
              setDeleteAlarm(false);
              setCount(0);
            }}
          />
        )}
      </div>
      <div className="alarm-list">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div key={alarm?.id} className="alarm-list-line">
              <input
                type="checkbox"
                checked={selectedAlarms.includes(alarm?.id)}
                onChange={() => handleSelectAlarm(alarm?.id)}
                className="alarm-checkbox"
              />
              <button
                className="alarm-item"
                onClick={() => moveToPage(alarm?.type, alarm?.alarmDto)}
              >
                <img
                  src={alarm?.image}
                  alt="프로필 이미지"
                  className="alarm-item-img"
                />
                <span className="alarm-item-content">{alarm?.content}</span>
              </button>
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
