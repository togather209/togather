import React, {useState, useEffect, useLayoutEffect} from "react"
import "./ScheduleDetail.css"
import headphone from "../../assets/schedule/headphone.png";
import mic from "../../assets/schedule/mic.png";
import ScheduleButton from "./ScheduleButton";
import ScheduleDetail from "./ScheduleDetail";
import axiosInstance from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import axios from "axios";

function ScheduleDetailPart () {
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isHeadPhone, setIsHeadPhone] = useState(false);
    const [isMic, setIsMic] = useState(false);
    const { id, schedule_id } = useParams();
    const [sessionId , setSessionId] = useState("");
    const handleHeadPhone = () => setIsHeadPhone(!isHeadPhone);
    const handleMic = () => setIsMic(!isMic);

    useLayoutEffect(() => {
      fetchSessionId();
    }, [sessionId]);

    const fetchSessionId = async () => {
      const response = await axiosInstance.get(`/teams/${id}/plans/${schedule_id}`);
      await setSessionId(response.data.data.sessionId);
      console.log("세션아이디 내놔 : ", response.data.data.sessionId)
    }



    const handleCallStart = async () => {
      await setIsCallStarted(!isCallStarted);
      const test = await axiosInstance.post(`/sessions/${sessionId}/connections`);
      console.log("발급된 토큰 내놔 : ", test);
      
    };

    const handleCallEnd = () => {
      setIsCallStarted(!isCallStarted);

    }


    // 찜하기 목록 날짜 목록 클릭했을 때 리렌더링 확인용 코드
    // 이거 콘솔에 찍히면 비상 비상
    useEffect (() => {
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("하정수는 한밭대 졸업생입니다!!!!!")
    },[])

    return (

        <div>
        <ScheduleDetail></ScheduleDetail>
        
        <div className="schedule-detail-button">
        {!isCallStarted ? (
          <ScheduleButton type={"purple"} onClick={handleCallStart}>
            통화 시작
          </ScheduleButton>
        ) : (
          <div className="schedule-detail-call-started">
            <ScheduleButton type={"border"} onClick={handleCallEnd}>
              통화 종료
            </ScheduleButton>
            <div
              className={isHeadPhone ? "headphone-mic-container-activate" : "headphone-mic-container"}
              onClick={handleHeadPhone}
            >
              <img className="headphone-mic-size" src={headphone} alt="헤드폰" />
            </div>
            <div
              className={isMic ? "headphone-mic-container-activate" : "headphone-mic-container"}
              onClick={handleMic}
            >
              <img className="headphone-mic-size" src={mic} alt="마이크" />
            </div>
          </div>
        )}
      </div>
        </div>
    )
}

export default ScheduleDetailPart