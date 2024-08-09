import React, {useState, useEffect} from "react"
import "./ScheduleDetail.css"
import headphone from "../../assets/schedule/headphone.png";
import mic from "../../assets/schedule/mic.png";
import ScheduleButton from "./ScheduleButton";
import ScheduleDetail from "./ScheduleDetail";

function ScheduleDetailPart () {
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isHeadPhone, setIsHeadPhone] = useState(false);
    const [isMic, setIsMic] = useState(false);
    const handleCallStart = () => setIsCallStarted(!isCallStarted);
    const handleHeadPhone = () => setIsHeadPhone(!isHeadPhone);
    const handleMic = () => setIsMic(!isMic);


    // 찜하기 목록 날짜 목록 클릭했을 때 리렌더링 확인용 코드
    // 이거 콘솔에 찍히면 비상 비상
    useEffect (() => {
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
        console.log("김해수는 숭실대 졸업생입니다. ㅎㅎㅎㅎㅎ")
    },[])

    return (

        <div>
        <ScheduleDetail></ScheduleDetail>
        
        <div className="schedule-detail-button">
        {isCallStarted ? (
          <ScheduleButton type={"purple"} onClick={handleCallStart}>
            통화 시작
          </ScheduleButton>
        ) : (
          <div className="schedule-detail-call-started">
            <ScheduleButton type={"border"} onClick={handleCallStart}>
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