import React, { useEffect, useState } from "react";
import "./HomeMain.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/icons/common/logo.png";
import HomeMainCard from "./HomeMainCard";
import FolderIcon from "../../assets/icons/common/foldericon.png";
import MouseIcon from "../../assets/icons/common/mouseicon.png";
import alarm from "../../assets/icons/common/alarm.png";
// import Meetings from "../meeting/Meetings";
import axiosInstance from "../../utils/axiosInstance";


// 홈 메인페이지
function HomeMain() {
  const navigation = useNavigate();

  const [myMeetings, setMyMeetings] = useState([])

  // 전체보기 및 편집로 이동
  const handleSeeAllClick = () => {
    navigation("/meeting", { state: { myMeetings } });
  };

  // 렌더링됐을 때 나의 모임 요청
  useEffect(() => {
    loadingMemberData();
  }, [])

  // axios 함수
  const loadingMemberData = async () => {
    try {
      const response = await axiosInstance.get("/teams/members/me");
      setMyMeetings(response.data.data)
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };

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

              {/* <Link className="seeall" to="meeting">
                전체보기 및 편집
              </Link> */}

              <button className="seeall" onClick={handleSeeAllClick}>
                전체보기 및 편집
              </button>
            </div>

            {/* 모임들 */}
            <div className="meeting-cards">
              {myMeetings.slice(0, 6).map((item) => (
                <HomeMainCard
                  key={item.teamId}
                  id={item.teamId}
                  name={item.title}
                  image_url={item.teamImg}
                />
              ))}
            </div>
          </div>

          <hr className="line" />

          {/* 모임 생성, 참여 컨테이너 */}
          <div className="new-meeting">
            <div className="new-meeting-header">
              <p className="my-meeting-title">새로운 모임</p>
              <p className="my-meeting-content">
                다른 모임을 만들어 보는건 어떠세요 ?
              </p>
            </div>

            {/* 모임 생성 버튼 */}
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

            {/* 모임 참여 버튼 */}
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
