import React, { useState } from "react";

import "./ScheduleDetailFavoritePlaces.css";
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png";

import matjip from "../../assets/schedule/mayjip.jpg";

import SchedulePlaceCal from "./SchedulePlaceCal";

function ScheduleDetailFavoritePlaces({
  name,
  img_url,
  address,
  firstDate,
  lastDate,
}) {
  const [isHeartPurple, setIsHeartPurple] = useState(false);

  const handleHeartPurple = () => {
    setIsHeartPurple(!isHeartPurple);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalFunction = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
    console.log("어렵다");
  };

  // 모달 닫기 버튼
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="schedule-detail-list-box">
      {isModalOpen && (
        <div className="schedule-date-setting-modal">
          <div className="date-setting-modal-content">
            <SchedulePlaceCal
              onClose={handleCloseModal}
              firstDate={firstDate}
              lastDate={lastDate}
              name={name}
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
            src={heartpurple}
            alt="full-heart"
          />
        ) : (
          <img
            className="heart-size"
            onClick={handleHeartPurple}
            src={heart}
            alt="empty-heart"
          />
        )}
      </div>
    </div>
  );
}

export default ScheduleDetailFavoritePlaces;
