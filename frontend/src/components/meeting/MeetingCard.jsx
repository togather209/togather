import React, { useState } from "react";
import "./MeetingCard.css";
import { useNavigate, useParams } from "react-router-dom";
import Delete from "../../assets/meeting/delete.png";
import Change from "../../assets/meeting/change.png";
import Out from "../../assets/meeting/out.png";
import defaultImage from "../../assets/meeting/defaultMeeting.png";
import CheckModal from "../common/CheckModal";
import ExitModal from "./ExitModal";

function MeetingCard({ id, image_url, name, desc, admin, setForR, forR }) {
  const navigation = useNavigate();

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handelCheckModalOpen = () => {
    setIsCheckModalOpen(true);
  };

  const handleExitModalOpen = () => {
    setIsExitModalOpen(true);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage; // 이미지 로드 실패 시 디폴트 이미지로 변경
  };

  return (
    <div className="meeting-card">
      <CheckModal
        isOpen={isCheckModalOpen}
        isClose={() => setIsCheckModalOpen(false)}
        firstbutton={"취소"}
        secondbutton={"삭제"}
        teamId={id}
        setForR={setForR}
        forR={forR}
      />

      <ExitModal
        isOpen={isExitModalOpen}
        isClose={() => setIsExitModalOpen(false)}
        firstbutton={"취소"}
        secondbutton={"나가기"}
        teamId={id}
        setForR={setForR}
        forR={forR}
      />

      <div onClick={() => navigation(`${id}`)}>
        <img
          className="meeting-img"
          src={image_url || defaultImage}
          alt="모임사진"
          onError={handleImageError}
        />
        <div className="text-section">
          <h3 className="title">{name}</h3>
          <p className="desc">{desc}</p>
        </div>
      </div>

      <div className="button-section">
        {admin ? (
          <div>
            <button
              onClick={() =>
                navigation(`/home/meeting/${id}/meeting-update`, {
                  state: { title: name, description: desc, id: id },
                })
              }
              className="meeting-card-button-form"
            >
              <img className="update-button" src={Change} alt="수정버튼" />
            </button>
            <button
              onClick={handelCheckModalOpen}
              className="meeting-card-button-form"
            >
              <img className="delete-button" src={Delete} alt="삭제버튼" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleExitModalOpen}
            className="meeting-card-button-form"
          >
            <img className="update-button" src={Out} alt="나가기버튼" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MeetingCard;
