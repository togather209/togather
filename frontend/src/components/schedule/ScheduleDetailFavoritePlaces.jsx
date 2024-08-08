import React, { useState } from "react";
import "./ScheduleDetailFavoritePlaces.css";
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png";
import matjip from "../../assets/schedule/mayjip.jpg";
import SchedulePlaceCal from "./SchedulePlaceCal";
import axiosInstance from "../../utils/axiosInstance";

function ScheduleDetailFavoritePlaces({
  name,
  meetingId,
  scheduleId,
  bookmarkId,
  placeId,
  img_url,
  address,
  datedate,
  firstDate,
  lastDate,
  setForRendering,
  forRendering,
}) {
  const [isHeartPurple, setIsHeartPurple] = useState(false);

  const handleHeartPurple = () => {
    if (!isHeartPurple) {
      deleteJjimPlace()
      setIsHeartPurple(!isHeartPurple);
    } else {
      addJjimPlace()
      setIsHeartPurple(!isHeartPurple);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalFunction = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
    // console.log("어렵다");
  };

  // 모달 닫기 버튼
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForRendering(!forRendering)
  };

  // 찜하기 목록 삭제 axios 요청
  const deleteJjimPlace = async () => {
    try {
      const response = await axiosInstance.delete(`/teams/${meetingId}/plans/${scheduleId}/bookmarks/${bookmarkId}`);
      console.log(response.data)
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  // 찜하기 목록 추가 axios 요청
  const addJjimPlace = async () => {
    const addJjimFormData = {}
    addJjimFormData["placeId"] = placeId
    addJjimFormData["placeImg"] = "이미지없음"
    addJjimFormData["placeName"] = name
    addJjimFormData["placeAddr"] = address
    // console.log(addJjimFormData)
 
    try {
      const response = await axiosInstance.post(`/teams/${meetingId}/plans/${scheduleId}/bookmarks`, addJjimFormData);
      console.log(response.data)
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  return (
    <div className="schedule-detail-list-box">
      {isModalOpen && (
        <div className="schedule-date-setting-modal">
          <div className="date-setting-modal-content">
            <SchedulePlaceCal
              onClose={handleCloseModal}
              meetingId={meetingId}
              bookmarkId={bookmarkId}
              scheduleId={scheduleId}
              firstDate={firstDate}
              lastDate={lastDate}
              datedate={datedate}
              name={name}
              handleCloseModal={handleCloseModal}
            />
          </div>
        </div>
      )}
      <div className="schedule-detail-section1" onClick={openModalFunction}>
        <div>
          <img className="schedule-detail-place-img" src={matjip} alt="임시" />
        </div>
        <div>
          <p className="schedule-detail-place-name">{name}</p>
          <p className="schedule-detail-place-address">{address}</p>
        </div>
      </div>
      <div className="receipt-box-div">
        {isHeartPurple ? (
          <img
            className="heart-size"
            onClick={handleHeartPurple}
            src={heart}
            alt="empty-heart"
          />
        ) : (
          <img
            className="heart-size"
            onClick={handleHeartPurple}
            src={heartpurple}
            alt="full-heart"
          />
  
        )}
      </div>
    </div>
  );
}

export default ScheduleDetailFavoritePlaces;
