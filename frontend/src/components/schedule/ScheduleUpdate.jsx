import React, {useState, useEffect} from "react";
import { useParams, useNavigate, useLocation  } from "react-router-dom";

import "./ScheduleRegist.css"
import BackButton from "../common/BackButton"
import Button from "../common/Button"
import DatePicker from "./DatePicker"
import axiosInstance from "../../utils/axiosInstance";

function ScheduleUpdate() {
  const navigation = useNavigate()
  // 모임 id, 일정 id 파라미터 값
    const {id, schedule_id} = useParams()
// 일정 명 + 일정 설명
    const location = useLocation();
    const state = location.state || {};

    // 모임 id 일정  id는 프롭스로 주자

  // 일정 이름
  const [scheduleName, setScheduleName] = useState(state.title)
  // 일정 설명
  const [scheduleDescription, setScheduleDescription] = useState(state.description)
  // 일정 시작일, 종료일
  const [startDate, setStartDate] = useState(null);
  // console.log(typeof "new Date(startDate)")
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {console.log(new Date(startDate), new Date(endDate))}, [startDate, endDate])
  
  // 일정 이름 변경 함수
  const handleScheduleName = (e) => {
    setScheduleName(e.target.value)
  }
  // 일정 설명 변경 함수
  const handleScheduleDescription = (e) => {
    setScheduleDescription(e.target.value)
  }

  // 생성 클릭했을 때 일정 생성하는 요청
  const updateSchedule = async (e) => {

    e.preventDefault()

    // 요청 파라미터 값 생성
    const ScheduleFormData = {}

    // 제목값 갱신
    ScheduleFormData["title"] = scheduleName
    // 설명값 갱신
    ScheduleFormData["description"] = scheduleDescription

    if (!startDate && !endDate) {
      console.error("Start date 또는 End date가 비어 있습니다.");
      return; // startDate 와 endDate가 null이면 함수 종료
    }

    // 선하가 말한 형식으로 바꿔줍니다.
    const formatDate = (date) => {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    };

    // 시작일 갱신
    ScheduleFormData["startDate"] = formatDate(startDate);
    // 종료일 갱신 (endate null이면 하루짜리 일정입니다.)
    if (endDate) {
      ScheduleFormData["endDate"] = formatDate(endDate)
    } else {
      ScheduleFormData["endDate"] = formatDate(startDate)
    }

    // 수정 요청을 보내봅시다. (axios 요청)
    try {
      const response = await axiosInstance.patch(`/teams/${id}/plans/${schedule_id}`, ScheduleFormData);
      console.log(response)
      navigation(`/home/meeting/${id}/schedule/${schedule_id}`)
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };

  return (
    <div className="schedule-regist">
      <div className="schedule-regist-container-box">
      <div>
        <BackButton />
      </div>

      <div className="schedule-regist-header">
        <p className="schedule-regist-header-text">어떤 일정인가요 ?</p>
        <p className="schedule-regist-header-desc-text">일정 정보를 입력해주세요</p>
      </div>

      <form className="schedule-regist-form" action="">
        <div className="schedule-regist-form-date-input">
        <p className="schedule-regist-form-date-input-text">일정 시작일 및 종료일</p>
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates
              setStartDate(start)
              setEndDate(end)
            }}
          />
        </div>

      
        <div className="schedule-regist-input-box">
          <label htmlFor=""></label>
          <input onChange={handleScheduleName} className="schedule-regist-input-tag" type="text" placeholder="일정명" value={scheduleName} />
        </div>

        <div className="schedule-regist-input-box">
          <label htmlFor=""></label>
          <input onChange={handleScheduleDescription} className="schedule-regist-input-tag" type="text" placeholder="일정 설명" value={scheduleDescription} />
        </div>

        <Button type={"purple"} onClick={updateSchedule}>생성</Button>
      </form>
      </div>
    
    </div>
  )
}

export default ScheduleUpdate;
