import React from "react";

import "./ScheduleDetailPlaces.css";
import ScheduleReceiptPurple from "../../assets/schedule/schedulereceiptpurple.png";
import SideStick from "../../assets/schedule/sidestick.png";
import matjip from "../../assets/schedule/mayjip.jpg";

function ScheduleDetailPlaces({ img_url, name, address }) {
  return (
    <div className="schedule-detail-list-box">
      <div className="schedule-detail-section1">
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
