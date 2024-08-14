import React, { useEffect, useState } from "react";
import "./PlaceLIstItem.css";
import market from "../../assets/search/market.jpg";
import attraction from "../../assets/search/attraction.jpg";
import facility from "../../assets/search/facility.png";
import accomodation from "../../assets/search/accomodation.jpg";
import restaurant from "../../assets/search/restaurant.jpg";
import parking from "../../assets/search/parking.png";
import subway from "../../assets/search/subway.jpg";
import cafe from "../../assets/search/cafe.jpg";
import conviny from "../../assets/search/conviny.jpg";
import defaultimage from "../../../public/defaultimage.png";

// PlaceListItem 컴포넌트 정의
const PlaceListItem = ({ place, index, onPlaceClick, onButtonClick }) => {
  console.log(place.category_group_code);

  const [imgType, setImgType] = useState(null);

  const typeSelect = (type) => {
    switch (type) {
      case "MT1":
        return market;
      case "CS2":
        return conviny;
      case "SW8":
        return subway;
      case "PK6":
        return parking;
      case "CT1":
        return facility;
      case "AT4":
        return attraction;
      case "AD5":
        return accomodation;
      case "FD6":
        return restaurant;
      case "CE7":
        return cafe;
      default:
        return defaultimage;
    }
  };

  console.log(place.place_url);

  useEffect(() => {
    setImgType(typeSelect(place.category_group_code));
  }, [place.category_group_code]);

  return (
    <li key={index} className="item" onClick={() => onPlaceClick(place)}>
      <div className="info">
        <span className={`markerbg marker_${index + 1}`}></span>
        <a className="search-place-detail-info" href={place.place_url}>
          <img className="search-result-image" src={imgType} alt="결과임시" />
        </a>
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
