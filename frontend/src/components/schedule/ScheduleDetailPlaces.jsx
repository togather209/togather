import React, {useState} from "react";
import "./ScheduleDetailPlaces.css";
import ScheduleReceiptPurple from "../../assets/schedule/schedulereceiptpurple.png";
import SideStick from "../../assets/schedule/sidestick.png";
import matjip from "../../assets/schedule/mayjip.jpg";
import SchedulePlaceCal from "./SchedulePlaceCal";

function ScheduleDetailPlaces({ img_url, name, address, meetingId, scheduleId, bookmarkId, datedate, firstDate, lastDate, forRendering, setForRendering }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalFunction = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
    // console.log("어렵다");
  };

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
          <img className="side-stick" src={SideStick} alt="sidestick" />
        </div>
        <div>
          <img className="schedule-detail-place-img" src={matjip} alt="임시" />
        </div>
        <div>
          <p className="schedule-detail-place-name">{name}</p>
          <p className="schedule-detail-place-address">{address}</p>
        </div>
      </div>
      <div className="receipt-box-div">
        <img
          className="schedule-detail-place-receipt-img"
          src={ScheduleReceiptPurple}
          alt="영수증 이미지"
        />
        <p className="schedule-detail-place-receipt-num">1</p>
      </div>
    </div>
  );
}

export default ScheduleDetailPlaces;
