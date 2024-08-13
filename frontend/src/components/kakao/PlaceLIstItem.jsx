import React from "react";

// PlaceListItem 컴포넌트 정의
const PlaceListItem = ({ place, index, onPlaceClick, onButtonClick }) => {
  //   console.log(place.place_url);

  //   console.log(index);

  return (
    <li key={index} className="item" onClick={() => onPlaceClick(place)}>
      <span className={`markerbg marker_${index + 1}`}></span>
      <div className="info">
        <h5 className="place-list-name">{place.place_name}</h5>
        {place.road_address_name ? (
          <div className="jibun">{place.road_address_name}</div>
        ) : (
          <span className="jibun">{place.address_name}</span>
        )}
      </div>
      <button onClick={onButtonClick(place)}>찜하기</button>
    </li>
  );
};

export default PlaceListItem;
