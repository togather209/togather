import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PlacesList.css";
import purpleSearch from "../../assets/schedule/purplesearch.png";
import PlaceListItem from "./PlaceLIstItem";

const PlacesList = ({ places, onPlaceClick, id, schedule_id }) => {
  console.log(places);

  const [imageUrl, setImageUrl] = useState([]);
  // 장소 이미지 주소 담을 배열 생성
  useEffect(() => {
    // place_url 값을 추출하여 배열에 저장
    const extractedUrls = places.map((place) => place.place_url);
    setImageUrl(extractedUrls);
    console.log(imageUrl);
  }, [places]);

  // 찜하기 axios 요청
  const onButtonClick = (place) => async (e) => {
    e.preventDefault();
    console.log("fffffff");
    console.log(place);
    console.log("fffffff");
    // 요청 파라미터 값 생성
    const favoriteFormData = {
      placeId: place.id,
      placeName: place.place_name,
      placeAddr: place.address_name,
      placeImg: "아니 없어요", // 여기에 실제 이미지 URL을 넣어야 할 수 있습니다.
    };
    try {
      const response = await axiosInstance.post(
        `/teams/${id}/plans/${schedule_id}/bookmarks`,
        favoriteFormData
      );
      console.log(response); // 응답 데이터 확인
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  return (
    <div>
      {places.length === 0 ? (
        <div className="place-list-main-box">
          <div className="place-list-container">
            <img
              className="place-list-purple-search-button"
              src={purpleSearch}
              alt="보라돋보기"
            />
            <span className="palce-list-container-text">
              원하는 장소를 검색해보세요
            </span>
          </div>
          <p className="place-list-example">
            예) 대전 탄방동 맛집과 같이 입력해보세요
          </p>
        </div> // places 배열이 비어있을 때 표시할 메시지
      ) : (
        <ul id="placesList">
          {places.map((place, index) => (
            <PlaceListItem
              key={index}
              place={place}
              index={index}
              onPlaceClick={onPlaceClick}
              onButtonClick={onButtonClick}
            />
          ))}{" "}
        </ul>
      )}
    </div>
  );
};

export default PlacesList;
