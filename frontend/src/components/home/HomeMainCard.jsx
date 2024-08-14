import React from "react";
import "./HomeMainCard.css";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/meeting/defaultMeeting.png";

function HomeMainCard({ id, name, image_url }) {
  const navigation = useNavigate();

  // 이미지 로드 실패 시 호출되는 핸들러
  const handleImageError = (e) => {
    e.target.src = defaultImage; // 디폴트 이미지로 변경
  };

  return (
    <div className="card" onClick={() => navigation(`/home/meeting/${id}`)}>
      <img
        className="card-img"
        src={image_url || defaultImage}
        alt="name"
        onError={handleImageError}
      />
      <h3 className="card-name">{name}</h3>
    </div>
  );
}

export default HomeMainCard;
