import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import "./ScheduleDetail.css";
import axiosInstance from "../../utils/axiosInstance";
import defaultImg from "../../../public/defaultimage.png";
import defaultMeeting from "../../assets/meeting/defaultMeeting.png";
import alarm from "../../assets/icons/common/alarm.png";
import exit from "../../assets/schedule/scheduleexit.png";
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png";
import update from "../../assets/schedule/update.png";
import deleteimg from "../../assets/schedule/deleteimg.png";
import BackButton from "../common/BackButton";
import ScheduleButton from "./ScheduleButton";
import ScheduleDates from "./ScheduleDates";
import ScheduleWeekdays from "./ScheduleWeekdays";
import ScheduleDetailPlaces from "./ScheduleDetailPlaces";
import ScheduleDetailFavoritePlaces from "./ScheduleDetailFavoritePlaces";

import backImage from "../../assets/icons/common/back.png";
import SearchForm from "../kakao/SearchForm";
import PlacesList from "../kakao/PlacesList";
import Pagination from "../kakao/Pagination";
import CheckModal from "../common/CheckModal";
import ScheduleDeleteModal from "./ScheduleDeleteModal";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import JoinFormModal from "../home/JoinFormModal";

function ScheduleDetail() {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  // 날짜별 장소 배열 상태
  const [datePlaces, setDatePlaces] = useState([]);
  const { id, schedule_id } = useParams();
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const navigation = useNavigate();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const location = useLocation();
  const { meetingName, meetingImg } = location.state || {};

  const [openCantSearchModal, setOpenCantSearchModal] = useState(false);

  const handleCloseCantSearchModal = () => {
    setOpenCantSearchModal(false);
  };

  // 카카오 API가 로드되었는지 확인
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
    } else {
      const checkKakaoLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          setKakaoLoaded(true);
          clearInterval(checkKakaoLoaded);
        }
      }, 100); // 100ms마다 확인
    }
  }, []);

  const handleSearch = useCallback(
    (keyword) => {
      if (!kakaoLoaded) {
        console.error("Kakao API is not loaded yet.");
        return;
      }

      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setPlaces(data);
          setPagination(pagination);
        } else {
          setOpenCantSearchModal(true);
        }
      });
    },
    [kakaoLoaded]
  );

  const { deletedBookmarkId } = useOutletContext();
  const { newBookmark } = useOutletContext();

  useEffect(() => {
    if (deletedBookmarkId) {
      setFavoritePlaces((prevPlaces) => {
        prevPlaces?.filter((place) => place.bookmarkId !== deletedBookmarkId);
      });
      setDatePlaces((prevPlaces) => {
        prevPlaces?.filter((place) => place.bookmarkId !== deletedBookmarkId);
      });
    }
  }, [deletedBookmarkId]);

  // 일정 상세 상태
  const [scheduleDetail, setScheduleDetail] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [datedata, setDatedata] = useState([]);

  // 일정 상세 요청
  const fetchScheduleDetail = async () => {
    try {
      const response = await axiosInstance.get(
        `/teams/${id}/plans/${schedule_id}`
      );
      const data = response.data.data;
      setScheduleDetail(data);

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      setStartDate(start);
      setEndDate(end);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  // 날짜 배열 생성
  useEffect(() => {
    if (startDate && endDate) {
      const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const getDatesWithWeekdays = (start, end) => {
        let dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
          const dayOfWeek = currentDate.getDay();
          dates.push({
            date: formatDate(currentDate),
            weekday: daysOfWeek[dayOfWeek],
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
      };

      const dates = getDatesWithWeekdays(startDate, endDate);
      setDatedata(dates);
    }
  }, [startDate, endDate]);

  // 데이터 요청 시 실행
  useEffect(() => {
    fetchScheduleDetail();
  }, [id, schedule_id]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isHeartClicked, setIsHeartClicked] = useState(true);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsHeartClicked(false);

  };
  const handleHeartClick = () => {
    setSelectedDate(null);
    setIsHeartClicked(true);
  };

  // 검색창 출력을 위한 상태 저장
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const onOpenSearch = () => {
    setIsOpenSearch(true);
  };

  useEffect(() => {
    setIsOpenSearch(false);
  }, []);

  const [forRendering, setForRendering] = useState(true);
  const { newDay } = useOutletContext();
  const { newOrder } = useOutletContext();

  // 찜목록 조회하는 요청
  useEffect(() => {
    if (isHeartClicked) {
      const favoritePlace = async () => {
        try {
          const response = await axiosInstance.get(
            `/teams/${id}/plans/${schedule_id}/bookmarks/jjim`
          );
          console.log(response);

          setFavoritePlaces(response.data.data);

        } catch (error) {
          console.error("데이터 불러오기 실패", error);
        }
      };
      favoritePlace();
    }
  }, [
    isHeartClicked,
    id,
    schedule_id,
    isOpenSearch,
    forRendering,
    deletedBookmarkId,
    newBookmark,
    newDay,
  ]);

  useEffect(() => {

  }, [favoritePlaces]);

  // 날짜가 정해진 장소들 요청하는 axios
  useEffect(() => {

    if (!selectedDate) {
      return;
    }
    const getDatePlaces = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${id}/plans/${schedule_id}/bookmarks/${selectedDate}`
        );

        setDatePlaces(response.data.data);
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      }
    };
    getDatePlaces();
  }, [
    selectedDate,
    forRendering,
    deletedBookmarkId,
    newBookmark,
    newDay,
    newOrder,
  ]);

  // 일정 삭제 axios 요청
  const scheduleExit = async () => {
    try {
      const response = await axiosInstance.delete(
        `/teams/${id}/plans/${schedule_id}`
      );
      console.log(response.data);
      navigation(`/home/meeting/${id}`);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };


  // 드래그 완료 후 호출되는 함수
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const extractIdNumber = (draggableId) => {
      return parseInt(draggableId.split("-").pop(), 10);
    };

    const newbookmarkid = extractIdNumber(draggableId);

    const reorderedPlaces = Array.from(datePlaces);
    const [movedItem] = reorderedPlaces.splice(source.index, 1);
    reorderedPlaces.splice(destination.index, 0, movedItem);

    setDatePlaces(reorderedPlaces);

    // 날짜 북마크 내에서 순서 수정 (드래그 앤 드롭)
    const newBookMarkOrder = async () => {
      const orderForm = {
        newOrder: destination.index,
      };

      try {

        const response = await axiosInstance.patch(
          `/teams/${id}/plans/${schedule_id}/bookmarks/${newbookmarkid}/order`,
          orderForm,
          {
            header: {
              "Content-Type": "application/json",
            },
          }
        );

      } catch (error) {
        console.error("데이터 불러오기 실패", error.response);
      }
    };
    newBookMarkOrder();
  };

  // 날짜 북마크 내에서 순서 수정 (드래그 앤 드롭)
  const handleImageError = (e) => {
    e.target.src = defaultMeeting; // 이미지 로드 실패 시 디폴트 이미지로 변경
  };

  const containerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="schedule-detail">
      {!isOpenSearch ? (
        <div>
          <div className="schedule-detail-header">
            <BackButton />
            <SearchForm
              onOpenSearch={onOpenSearch}
              onSearch={handleSearch}
              isOpenSearch={isOpenSearch}
            />
            <button
              className="schedule-detail-alarm-button"
              onClick={() => navigation("/alarm")}
            >
              <img
                className="schedule-detail-alarm-icon"
                src={alarm}
                alt="알람"
              />
            </button>
          </div>
          <div className="schedule-detail-middle-box">
            <div className="schedule-detail-middle-info">
              <img
                className="schedule-detail-small-img"
                src={meetingImg || defaultMeeting}
                alt="모임 사진"
                onError={handleImageError}
              />
              <div className="schedule-detail-first-section">
                <div>
                  <p className="schedule-detail-meeting-name">{meetingName}</p>
                  <p className="schedule-detail-schedule-name">
                    {scheduleDetail.title}
                  </p>
                </div>

                {scheduleDetail.isManager ? (
                  <div>
                    <img
                      onClick={() =>
                        navigation(
                          `/home/meeting/${id}/schedule/${schedule_id}/update`,
                          {
                            state: {
                              title: scheduleDetail.title,
                              description: scheduleDetail.description,
                            },
                          }
                        )
                      }
                      className="schedule-exit-img"
                      src={update}
                      alt="일정수정"
                    />
                    <img
                      onClick={() => setIsExitModalOpen(true)}
                      className="schedule-exit-img"
                      src={deleteimg}
                      alt="일정삭제"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="schedule-detail-second-section">
              <p className="schedule-detail-schedule-name">
                {scheduleDetail.description}
              </p>
              <ScheduleButton
                type={"purple"}
                onClick={() =>
                  navigation("/receipt", {
                    state: { teamId: id, planId: schedule_id },
                  })
                }
              >
                영수증 조회
              </ScheduleButton>
            </div>
          </div>
          <div className="schedule-detail-date-box" ref={containerRef}>
            <div className="schedule-detail-weekdays">
              <div className="schedule-detail-like">찜</div>
              {datedata.map((item, index) => (
                <ScheduleWeekdays key={index}>{item.weekday}</ScheduleWeekdays>
              ))}
            </div>
            <div className="schedule-detail-weekdays">
              <img
                className="schedule-detail-like-icon"
                src={isHeartClicked ? heartpurple : heart}
                alt="찜 아이콘"
                onClick={handleHeartClick}
              />
              {datedata.map((item, index) => (
                <ScheduleDates
                  key={index}
                  onClick={() => handleDateClick(item.date)}
                  isSelected={item.date === selectedDate}
                >
                  {parseInt(item.date.split("-")[2])}
                </ScheduleDates>
              ))}
            </div>
          </div>
          <div className="schedule-detail-place-list-box">
            <p className="schedule-detail-choose-date-text">
              장소를 클릭해 방문일을 변경해보세요!
            </p>
            {isHeartClicked ? (
              <div>
                {favoritePlaces?.map((item, index) => (
                  <ScheduleDetailFavoritePlaces
                    key={item.placeId}
                    placeId={item.placeId}
                    placeImg={item.placeImg}
                    // placeUrl={item.place_url}
                    meetingId={id}
                    scheduleId={schedule_id}
                    bookmarkId={item.bookmarkId}
                    img_url="없음"
                    name={item.placeName}
                    address={item.placeAddr}
                    datedate={item.date}
                    firstDate={datedata[0]?.date}
                    lastDate={datedata[datedata.length - 1]?.date}
                    forRendering={forRendering}
                    setForRendering={setForRendering}
                    deletedBookmarkId={deletedBookmarkId}
                  />
                ))}
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-places">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {datePlaces?.map((item, index) => (
                        <ScheduleDetailPlaces
                          key={item.bookmarkId}
                          index={index}
                          meetingId={id}
                          placeUrl={item.palce_url}
                          placeImg={item.placeImg}
                          scheduleId={schedule_id}
                          bookmarkId={item.bookmarkId}
                          name={item.placeName}
                          address={item.placeAddr}
                          datedate={item.date}
                          receiptCnt={item.receiptCnt}
                          firstDate={datedata[0]?.date}
                          lastDate={datedata[datedata.length - 1]?.date}
                          forRendering={forRendering}
                          setForRendering={setForRendering}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          <ScheduleDeleteModal
            isOpen={isExitModalOpen}
            isClose={() => setIsExitModalOpen(false)}
            teamId={id}
            planId={schedule_id}
            isExitModalOpen={isExitModalOpen}
            setIsExitModalOpen={setIsExitModalOpen}
          />
        </div>
      ) : (
        <div>
          <div className="schedule-detail-header">
            <button
              className="search-back-button"
              onClick={() => setIsOpenSearch(false)}
            >
              <img src={backImage} alt="뒤로가기 버튼" />
            </button>
            <SearchForm
              onOpenSearch={onOpenSearch}
              onSearch={handleSearch}
              isOpenSearch={isOpenSearch}
            />
          </div>

          <PlacesList
            id={id}
            schedule_id={schedule_id}
            places={places}
            onPlaceClick={() => {}}
          />
          <div className="pagination-div">
            {pagination && <Pagination pagination={pagination} />}
          </div>
        </div>
      )}
      <JoinFormModal
        content={"검색결과가 존재하지 않습니다 !!"}
        modalOpen={openCantSearchModal}
        onClose={handleCloseCantSearchModal}
      />
    </div>
  );
}

export default ScheduleDetail;
