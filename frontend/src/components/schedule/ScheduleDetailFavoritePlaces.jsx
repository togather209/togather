import React, { useState } from "react";
import "./ScheduleDetailFavoritePlaces.css";
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png";
import matjip from "../../assets/schedule/mayjip.jpg";
import SchedulePlaceCal from "./SchedulePlaceCal";

function ScheduleDetailFavoritePlaces({
  name,
  meetingId,
  scheduleId,
  bookmarkId,
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
    setIsHeartPurple(!isHeartPurple);
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
