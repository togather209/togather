import React, {useState} from "react";

import "./ScheduleDetail.css";
import meetingimg from "../../../public/다운로드.jpg";
import alarm from "../../assets/icons/common/alarm.png";
import exit from "../../assets/schedule/scheduleexit.png";
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png"

import BackButton from "../common/BackButton";
import ScheduleButton from "./ScheduleButton";
import ScheduleDates from "./ScheduleDates";
import ScheduleWeekdays from "./ScheduleWeekdays";
import ScheduleDetailPlaces from "./ScheduleDetailPlaces";
import ScheduleDetailFavoritePlaces from "./ScheduleDetailFavoritePlaces";
import headphone from "../../assets/schedule/headphone.png"
import mic from "../../assets/schedule/mic.png"

function ScheduleDetail() {

    
    const locations_mokup = [
        {
            id: 1,
            name: "서울 맛집",
            address: "서울특별시 중구 을지로 123",
            image: "https://example.com/images/seoul-matzip.jpg",
            date: "2024-08-01"
        },
        {
            id: 2,
            name: "홍대 카페",
            address: "서울특별시 마포구 홍익로 45",
            image: "https://example.com/images/hongdae-cafe.jpg",
            date: "2024-08-02"
        },
        {
            id: 3,
            name: "강남 베이커리",
            address: "서울특별시 강남구 강남대로 678",
            image: "https://example.com/images/gangnam-bakery.jpg",
            date: "2024-08-03"
        },
        {
            id: 4,
            name: "이태원 레스토랑",
            address: "서울특별시 용산구 이태원로 22",
            image: "https://example.com/images itaewon-restaurant.jpg",
            date: "2024-08-04"
        },
        {
            id: 5,
            name: "명동 쇼핑몰",
            address: "서울특별시 중구 명동길 45",
            image: "https://example.com/images/myeongdong-mall.jpg",
            date: "2024-08-05"
        },
        {
            id: 6,
            name: "명동 쇼핑몰",
            address: "서울특별시 중구 명동길 45",
            image: "https://example.com/images/myeongdong-mall.jpg",
            date: "2024-08-05"
        },
        {
            id: 7,
            name: "명동 쇼핑몰",
            address: "서울특별시 중구 명동길 45",
            image: "https://example.com/images/myeongdong-mall.jpg",
            date: "2024-08-05"
        },
        {
            id: 8,
            name: "명동 쇼핑몰",
            address: "서울특별시 중구 명동길 45",
            image: "https://example.com/images/myeongdong-mall.jpg",
            date: "2024-08-05"
        }
    ];




    const parseDate = (dateString) => {
        const date = new Date(dateString);
        // 시간을 자정으로 설정
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const [startDate, setStartDate] = useState(parseDate('Thu AUG 1 2024 00:00:00 GMT+0900 (한국 표준시)')); // 예시 날짜
    const [endDate, setEndDate] = useState(parseDate('Sun AUG 4 2024 00:00:00 GMT+0900 (한국 표준시)'));   // 예시 날짜
    const [selectedDate, setSelectedDate] = useState(null);
    const [isHeartClicked, setIsHeartClicked] = useState(true);
    const [isCallStarted, setIsCallStarted] = useState(false)
    const [isHeadPhone, setIsHeadPhone] = useState(false)
    const [isMic, setIsMic] = useState(false)
    

    const handleCallStart = () => {
      setIsCallStarted(!isCallStarted)
    }

    const handleHeadPhone = () => {
      setIsHeadPhone(!isHeadPhone)
    }

    const handleMic = () => {
      setIsMic(!isMic)
    }

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0'); // 날짜를 두 자리로 맞추기 위해 padStart 사용
        return `${year}-${month}-${day}`;
    };

    const getDatesWithWeekdays = (start, end) => {
        let dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            dates.push({
                date: formatDate(currentDate), // 변환된 날짜
                weekday: daysOfWeek[dayOfWeek]
            });

            // 다음 날짜로 이동
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // console.log(dates)

        return dates;
    };

        const datedata = getDatesWithWeekdays(startDate, endDate)
        console.log(datedata)

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsHeartClicked(false); // 하트 색상 토글
 // 클릭된 날짜 초기화
    };

    const handleHeartClick = () => {
        // 하트 클릭 취소
        setSelectedDate(null); // 클릭된 날짜 초기화
        setIsHeartClicked(true); // 하트 색상 토글
    };
        
  return (
    <div className="schedule-detail">
      <div className="schedule-detail-header">
        <BackButton></BackButton>
        <input
          className="schedule-detail-header-search"
          type="text"
          // placeholder="장소 검색"
        />
        <img className="schedule-detail-alarm-icon" src={alarm} alt="알람" />
      </div>
      <div className="schedule-detail-middle-box">
        <div className="schedule-detail-middle-info">
          <img
            className="schedule-detail-small-img"
            src={meetingimg}
            alt="모임 사진"
          />
          <div className="schedule-detail-first-section">
            <div>
              <p className="schedule-detail-meeting-name">모임명</p>
              <p className="schedule-detail-schedule-name">일정명</p>
            </div>
            <img className="schedule-exit-img" src={exit} alt="일정 나가기" />
          </div>
        </div>
        <div className="schedule-detail-second-section">
          <p className="schedule-detail-schedule-name">일정 설명</p>
          <ScheduleButton type={"purple"} onClick={() => {}}>
            영수증 조회
          </ScheduleButton>
        </div>
      </div>
      <div className="schedule-detail-date-box">
        <div className="schedule-detail-weekdays">
           
          <div className="schedule-detail-like">찜</div>
            {datedata.map((item, index) => 
                     <ScheduleWeekdays key={index}>{item.weekday}</ScheduleWeekdays>
                 )}

        </div>
        <div className="schedule-detail-weekdays">
            <img
                className="schedule-detail-like-icon"
                src={isHeartClicked ? heartpurple : heart}
                alt="찜 아이콘"
                onClick={handleHeartClick}
            />
           {datedata.map((item, index) => 
                <ScheduleDates
                    key={index}
                    onClick={() => handleDateClick(item.date)}
                    isSelected={item.date === selectedDate}
                >
                    {parseInt(item.date.split('-')[2])}
                </ScheduleDates>
    )}
        </div>
      </div>


      <div className="schedule-detail-place-list-box">

        <p className="schedule-detail-choose-date-text">
          장소를 클릭해 방문일을 변경해보세요 !
        </p>

        {isHeartClicked ? (
          <div>
            {locations_mokup.map((item, index) => 
                <ScheduleDetailFavoritePlaces key={item.id} img_url={item.image} name={item.name} address={item.address}></ScheduleDetailFavoritePlaces>
            )}
          </div>
        ) : (
          <div>
            {locations_mokup.map((item, index) => 
                <ScheduleDetailPlaces key={item.id} img_url={item.image} name={item.name} address={item.address}></ScheduleDetailPlaces>
            )}
          </div>
        )}

      </div>





        <div className="schedule-detail-button">
          {isCallStarted ? (
            <ScheduleButton type={"purple"} onClick={handleCallStart}>통화 시작</ScheduleButton>
          ) : (
            <div className="schedule-detail-call-started">
              <ScheduleButton type={"border"} onClick={handleCallStart}>통화 종료</ScheduleButton>

              {isHeadPhone ? (
                <div className="headphone-mic-container-activate" onClick={handleHeadPhone}><img className="headphone-mic-size" src={headphone} alt="해드폰" /></div>
              ) : (
                <div className="headphone-mic-container" onClick={handleHeadPhone}><img className="headphone-mic-size" src={headphone} alt="해드폰" /></div>
              )}

              {isMic ? (
                <div className="headphone-mic-container-activate" onClick={handleMic}><img className="headphone-mic-size" src={mic} alt="마이크" /></div>
                
              ) : (
                <div className="headphone-mic-container" onClick={handleMic}><img className="headphone-mic-size" src={mic} alt="마이크" /></div>
              )}


            </div>
          )}
        </div>

    </div>
  );
}

export default ScheduleDetail;
