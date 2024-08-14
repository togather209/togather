import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchedulePlaceCal.css";
import mayjip from "../../assets/schedule/mayjip.jpg";
import Close from "../../assets/icons/common/close.png";
import SelectDatePicker from "./SelectDatePicker";
import axiosInstance from "../../utils/axiosInstance";

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function SchedulePlaceCal({
  handleCloseModal,
  onClose,
  onConfirm,
  firstDate,
  placeImg,
  lastDate,
  name,
  datedate,
  scheduleId,
  bookmarkId,
  meetingId,
}) {
  const navigation = useNavigate();
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(datedate);

  const handleDateChange = (date) => {
    // date는 내가 눌렀을 때 나오는 데이터이다.
    const formattedDate = formatDateToYYYYMMDD(date);

    console.log(formattedDate);

    // 이미 선택된 날짜와 같으면 선택 해제, 다르면 선택
    if (selectedDate === formattedDate) {
      setSelectedDate(null);
      console.log(selectedDate);
    } else {
      setSelectedDate(formattedDate);
      console.log(selectedDate);
    }
  };

  const addPlaceDate = async () => {
    const formDateData = {};
    if (!selectedDate) {
      formDateData["date"] = null;
    } else {
      formDateData["date"] = formatDateToYYYYMMDD(new Date(selectedDate));
      console.log(formDateData);
      console.log("ddddd");
    }
    try {
      const response = await axiosInstance.patch(
        `/teams/${meetingId}/plans/${scheduleId}/bookmakrs/${bookmarkId}/date`,
        formDateData
      );
      console.log(response);
      handleCloseModal();
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  return (
    <div className="schedule-place-container">
      <div className="close-button-container">
        <img src={Close} onClick={onClose} alt="닫기 버튼" />
      </div>

      <div className="schedule-place-cal-body">
        <img className="date-setting-img" src={placeImg} alt="임시" />
        <div>
          <p className="schedule-place-cal-name">{name}에</p>
          <p className="when-visit">언제 방문할 계획이신가요 ?</p>
        </div>
      </div>

      <div className="purple-hr"></div>

      <SelectDatePicker
        selectedDate={selectedDate}
        firstDate={firstDate}
        lastDate={lastDate}
        datedate={datedate}
        handleDateChange={handleDateChange}
      />

      <button className="schedule-place-cal-button" onClick={addPlaceDate}>
        확인
      </button>
    </div>
  );
}

export default SchedulePlaceCal;
