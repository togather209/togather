import React from "react";
import "./HomeMain.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/icons/common/logo.png";
import promimg from "../../../public/다운로드.jpg";

import HomeMainCard from "./HomeMainCard";
import FolderIcon from "../../assets/icons/common/foldericon.png";
import MouseIcon from "../../assets/icons/common/mouseicon.png";
import alarm from "../../assets/icons/common/alarm.png";

function HomeMain() {
  const navigation = useNavigate();

  const meeting_card_mokup = [
    {
      id: 1,
      name: "비모",
      image_url: promimg,
    },
    {
      id: 2,
      name: "FC inso",
      image_url: promimg,
    },
    {
      id: 3,
      name: "지웨인팬모임",
      image_url: promimg,
    },
    {
      id: 4,
      name: "가족모임",
      image_url: promimg,
    },
    {
      id: 5,
      name: "ssafy",
      image_url: promimg,
    },
    {
      id: 6,
      name: "등산",
      image_url: promimg,
    },
  ];

  return (
    <div>
      <div className="main-header">
        <img
          onClick={() => navigation("/")}
          className="logo"
          src={logo}
          alt="로고 이미지"
        />
        <div>
          <img className="home-alarm-button" src={alarm} alt="알람 버튼" />
        </div>
      </div>
      <div className="homemain">
        <div className="homemain-container">
          <div className="main-meetings">
            <div className="meeting-header">
              <div className="my-meeting">
                <p className="my-meeting-title">나의 모임</p>
                <p className="my-meeting-content">모임을 더 쉽고 간편하게 !</p>
              </div>

              <Link className="seeall" to="meeting">
                전체보기 및 편집
              </Link>
            </div>
            <div className="meeting-cards">
              {meeting_card_mokup.map((item, index) => (
                <HomeMainCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image_url={item.image_url}
                />
              ))}
            </div>
          </div>

          <hr className="line" />

          <div className="new-meeting">
            <div className="new-meeting-header">
              <p className="my-meeting-title">새로운 모임</p>
              <p className="my-meeting-content">
                다른 모임을 만들어 보는건 어떠세요 ?
              </p>
            </div>

            <button
              className="create-button"
              onClick={() => navigation("regist_form")}
            >
              <div className="button-content">
                <div className="button-desc">
                  <p>모임 만들기</p>
                  <p className="button-text">모임장이 되어 직접 모임 생산</p>
                </div>
                <img
                  className="folder-icon"
                  src={FolderIcon}
                  alt="폴더 아이콘"
                />
              </div>
            </button>

            <button
              className="join-button"
              onClick={() => navigation("join_form")}
            >
              <div className="button-content">
                <img className="mouse-icon" src={MouseIcon} alt="아이콘" />
                <div className="button-desc2">
                  <p>모임 참여하기</p>
                  <p className="button-text">
                    초대 코드를 통해 빠르게 모임 가입
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeMain;
