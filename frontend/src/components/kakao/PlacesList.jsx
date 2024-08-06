import React from 'react';
import axiosInstance from '../../utils/axiosInstance';

const PlacesList = ({ places, onPlaceClick, id, schedule_id }) => {

  const onButtonClick = (place) => async (e) => {
    e.preventDefault(); // 폼 제출을 방지 (버튼 클릭 시 기본 동작 방지)

    // 요청 파라미터 값 생성
    const favoriteFormData = {
      placeName: place.place_name,
      placeAddr: place.address_name,
      placeImg: "아니 없어요" // 여기에 실제 이미지 URL을 넣어야 할 수 있습니다.
      // 아이디도 줘야한다.
    };

    console.log(place)

    console.log(favoriteFormData)
    console.log(id, schedule_id)

    // axios 요청
    try {
      const response = await axiosInstance.post(`/teams/${id}/plans/${schedule_id}/bookmarks`, favoriteFormData);
      console.log(response); // 응답 데이터 확인
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  const createListItem = (place, index) => {
    return (
      <li key={index} className="item" onClick={() => onPlaceClick(place)}>
        <span className={`markerbg marker_${index + 1}`}></span>
        <div className="info">
          <h5>{place.place_name}</h5>
          {place.road_address_name ? (
            <>
              <span>{place.road_address_name}</span>
              <span className="jibun gray">{place.address_name}</span>
            </>
          ) : (
            <span>{place.address_name}</span>
          )}
          <span className="tel">{place.phone}</span>
        </div>
        <button onClick={onButtonClick(place)}>찜하기</button> {/* 버튼 클릭 시 onButtonClick 함수 실행 */}
      </li>
    );
  };

  return <ul id="placesList">{places.map(createListItem)}</ul>;
};

export default PlacesList;
