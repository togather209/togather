import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PlacesList.css";
import purpleSearch from "../../assets/schedule/purplesearch.png";
import PlaceListItem from "./PlaceLIstItem";
import JoinFormModalT from "../kakao/JoinFormModalT";

import market from "../../assets/search/market.png";
import attraction from "../../assets/search/attraction.png";
import facility from "../../assets/search/facility.png";
import accomodation from "../../assets/search/accomodation.png";
import restaurant from "../../assets/search/restaurant.png";
import parking from "../../assets/search/parking.png";
import subway from "../../assets/search/subway.png";
import cafe from "../../assets/search/cafe.png";
import conviny from "../../assets/search/conviny.png";
import defaultimage from "../../../public/defaultimage.png";
import { useNavigate, useOutletContext } from "react-router-dom";

const PlacesList = ({ places, onPlaceClick, id, schedule_id }) => {
  console.log(places);

  // 이미 찜했습니다 모달 띄우기
  const [openAlreadyJjim, setOpenAlreadyJjim] = useState(false);
  const { newBookmark } = useOutletContext();

  const handleModalClose = () => {
    setOpenAlreadyJjim(false);
  };

  const [imageUrl, setImageUrl] = useState([]);
  // 장소 이미지 주소 담을 배열 생성
  useEffect(() => {
    // place_url 값을 추출하여 배열에 저장
    const extractedUrls = places.map((place) => place.place_url);
    setImageUrl(extractedUrls);
    console.log(imageUrl);
  }, [places]);

  // 여기서 이미지 데이터로 전달해줘야 한다.
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
  const [favoritePlaces, setFavoritePlaces] = useState(places); // 초기화

  useEffect(() => {
    if (newBookmark && newBookmark.scheduleId === schedule_id) {
      setFavoritePlaces((prevPlaces) => [...prevPlaces, newBookmark]);
    }
  }, [newBookmark, schedule_id]);

  // 크롤링 요청 보내는 코드가 필요합니다.
  // 크롤링 요청 보내는 코드가 필요합니다.

  // 찜리스트 배열
  // const [jjimList, setJjimList] = useState([]);
  // 찜리스트 palceId 배열
  const [jjimPlaceList, setJjimPlaceList] = useState([]);

  // 찜목록 조회하는 요청
  useEffect(() => {
    const favoritePlace = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${id}/plans/${schedule_id}/bookmarks/jjim`
        );

        // response.data.data가 배열이라고 가정하고 반복하면서 placeId 추출
        const placeIds = response.data.data.map((item) => item.placeId);

        // placeIds 배열을 상태에 설정
        setJjimPlaceList(placeIds);

        console.log("찜리스트:", placeIds); // 상태 업데이트 후 로그 출력
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      }
    };

    favoritePlace();
  }, [id, schedule_id]);

  // 크롤링 요청 보내는 코드가 필요합니다.
  // 크롤링 요청 보내는 코드가 필요합니다.

  // const [forRand, setForRand] = useState(true);

  // 찜하기 axios 요청
  const onButtonClick = (place) => async (e) => {
    e.preventDefault();

    // console.log("before", forRand);

    // console.log("after", forRand);

    const imgType = typeSelect(place.category_group_code);

    console.log("안녕하세요 반갑습니다.", imgType);

    // 요청 파라미터 값 생성
    const favoriteFormData = {
      placeId: place.id,
      placeName: place.place_name,
      placeAddr: place.address_name,
      placeImg: imgType, // 여기에 실제 이미지 URL을 넣어야 할 수 있습니다.
    };

    try {
      const response = await axiosInstance.post(
        `/teams/${id}/plans/${schedule_id}/bookmarks`,
        favoriteFormData
      );

      if (response) {
        console.log(response); // 응답 데이터 확인
      } else {
        setRequestModalOpen(true);
        // setForRand(!forRand);
      }
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
      console.log(openAlreadyJjim);
    }
  };

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const handleRequestModalClose = () => {
    setRequestModalOpen(false);
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
              jjimPlaceList={jjimPlaceList}
            />
          ))}{" "}
        </ul>
      )}
      <JoinFormModalT
        modalOpen={requestModalOpen}
        content={"이미 찜한 장소입니다"}
        onClose={handleRequestModalClose}
      />
    </div>
  );
};

export default PlacesList;
