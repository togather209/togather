import React from "react";
import "./PlaceLIstItem.css";

// PlaceListItem 컴포넌트 정의
const PlaceListItem = ({ place, index, onPlaceClick, onButtonClick }) => {
  return (
    <li key={index} className="item" onClick={() => onPlaceClick(place)}>
      <div className="info">
        <span className={`markerbg marker_${index + 1}`}></span>
        <img className="search-result-image" src="" alt="결과임시" />
        <div className="search-result-content-container">
          <h5 className="place-list-name">{place.place_name}</h5>
          {place.road_address_name ? (
            <div className="jibun">{place.road_address_name}</div>
          ) : (
            <span className="jibun">{place.address_name}</span>
          )}
        </div>
      </div>
      <button className="place-jjim-hagi" onClick={onButtonClick(place)}>
        찜하기
      </button>
    </li>
  );
};

export default PlaceListItem;
