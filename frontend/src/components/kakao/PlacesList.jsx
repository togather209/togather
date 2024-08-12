import React from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PlacesList.css";
import purpleSearch from "../../assets/schedule/purplesearch.png";

const PlacesList = ({ places, onPlaceClick, id, schedule_id }) => {
  // 버튼 클릭 이벤트 핸들러
  const onButtonClick = (place) => async (e) => {
    e.preventDefault(); // 폼 제출을 방지 (버튼 클릭 시 기본 동작 방지)

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

    // axios 요청
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

  // 리스트 아이템 생성
  const createListItem = (place, index) => {
    return (
      <li key={index} className="item" onClick={() => onPlaceClick(place)}>
        <span className={`markerbg marker_${index + 1}`}></span>
        <div className="info">
          <h5 className="place-list-name">{place.place_name}</h5>
          {place.road_address_name ? (
            <>
              <div className="jibun">{place.road_address_name}</div>
            </>
          ) : (
            <span className="jibun">{place.address_name}</span>
          )}
        </div>
        <button onClick={onButtonClick(place)}>찜하기</button>{" "}
        {/* 버튼 클릭 시 onButtonClick 함수 실행 */}
      </li>
    );
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
          {places.map(createListItem)}{" "}
          {/* places 배열에 데이터가 있을 때 리스트를 출력 */}
        </ul>
      )}
    </div>
  );
};

export default PlacesList;
