import React from "react";
import "./Meetings.css";
import promimg from "../../../public/다운로드.jpg";
import BackButton from "../common/BackButton";

import MeetingCard from "./MeetingCard";
import alarm from "../../assets/icons/common/alarm.png";

import { useNavigate } from "react-router-dom";

function Meetings() {
  const navigation = useNavigate();
  const meeting_card_mokup = [
    {
      id: 1,
      name: "비모",
      image_url: promimg,
      desc: "설명",
    },
    {
      id: 2,
      name: "FC inso",
      image_url: promimg,
      desc: "설명",
    },
    {
      id: 3,
      name: "지웨인팬모임",
      image_url: promimg,
      desc: "설명",
    },
    {
      id: 4,
      name: "가족모임",
      image_url: promimg,
      desc: "설명",
    },
  ];
  return (
    <div>
      <div className="meetings-header">
        <BackButton />
        <img className="meeting-alarm-button" src={alarm} alt="알람버튼" />
      </div>
      <div className="meetings">
        <div className="meetings-container">
          <div className="meetings-list">
            <div className="meetings-list-header">
              <p className="my-meetings">나의 모임</p>
              <p className="desc">모임을 더 쉽고 간편하게 !</p>
            </div>
            <div className="meetings-card-container">
              {meeting_card_mokup.map((item, index) => (
                <MeetingCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image_url={item.image_url}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meetings;
