import React from "react";
import "./HomeMainCard.css";
import { useNavigate } from "react-router-dom";

function HomeMainCard({ id, name, image_url }) {
  const navigation = useNavigate();
  return (
    <div className="card" onClick={() => navigation(`/home/meeting/${id}`)}>
      <img className="card-img" src={image_url} alt="임시용임" />
      <h3 className="card-name">{name}</h3>
    </div>
  );
}

export default HomeMainCard;
