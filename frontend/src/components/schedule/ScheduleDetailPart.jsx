import React, { useState, useEffect } from "react";
import "./ScheduleDetail.css";
import headphone from "../../assets/schedule/headphone.png";
import mic from "../../assets/schedule/mic.png";
import ScheduleButton from "./ScheduleButton";
import ScheduleDetail from "./ScheduleDetail";
import axiosInstance from "../../utils/axiosInstance";
import { OpenVidu } from "openvidu-browser";
import { useParams } from "react-router-dom";

function ScheduleDetailPart() {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isHeadPhone, setIsHeadPhone] = useState(false); // 오디오 음소거 상태
  const [isMic, setIsMic] = useState(true); // 마이크 상태
  const { id, schedule_id } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);

  // 화면 렌더링되면 세션 id 받아오기
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axiosInstance.get(`/teams/${id}/plans/${schedule_id}`);
        const newSessionId = response.data.data.sessionId;
        setSessionId(newSessionId);
        localStorage.setItem("sessionId", newSessionId);
      } catch (err) {
        setError("Failed to fetch session ID");
      }
    };

    if (!sessionId) {
      fetchSessionId();
    }
  }, [id, schedule_id, sessionId]);

  // 통화 시작 버튼 클릭하면 실행되는 함수
  const handleCallStart = async () => {
    if (isCallStarted) return;

    try {
      if (sessionId) {
        const response = await axiosInstance.post(`/sessions/${sessionId}/connections`);
        const token = response.data.data.token;

        const OV = new OpenVidu();
        const newSession = OV.initSession();

        newSession.on("streamCreated", (event) => {
          const subscriberContainer = document.createElement("div");
          subscriberContainer.id = event.stream.streamId;
          document.body.appendChild(subscriberContainer);
          newSession.subscribe(event.stream, subscriberContainer.id);

          // 구독자 목록 업데이트
          setSubscribers(prevSubscribers => [...prevSubscribers, event.stream]);

          // 구독자에게 음소거 상태 적용
          event.stream.streamManager.subscribeToAudio(!isHeadPhone);
        });

        newSession.on("streamDestroyed", (event) => {
          const subscriberContainer = document.getElementById(event.stream.streamId);
          if (subscriberContainer) {
            subscriberContainer.remove();
          }

          // 구독자 목록 업데이트
          setSubscribers(prevSubscribers => prevSubscribers.filter(subscriber => subscriber.streamId !== event.stream.streamId));
        });

        // 세션에 연결하기
        await newSession.connect(token);

        const newPublisher = OV.initPublisher(undefined, {
          audioSource: true,
          videoSource: false,
          publishAudio: isMic,
          publishVideo: false,
          resolution: "640x480",
          frameRate: 30,
        });

        const publisherContainer = document.createElement("div");
        publisherContainer.id = "publisher";
        document.body.appendChild(publisherContainer);

        setSession(newSession);
        setPublisher(newPublisher);
        newSession.publish(newPublisher);
        setIsCallStarted(true);
      }
    } catch (err) {
      setError("Failed to start call");
    }
  };

  // 통화 종료 버튼 클릭하면 실행되는 함수
  const handleCallEnd = async () => {
    if (session) {
      console.log("Ending call...");
  
      try {
        // 세션 종료 요청
        await session.disconnect();
        setIsCallStarted(false);
        const publisherContainer = document.getElementById("publisher");
        if (publisherContainer) {
          publisherContainer.remove();
        }
  
        const subscriberContainers = document.querySelectorAll("div[id^='stream']");
        subscriberContainers.forEach(container => container.remove());
  
        console.log("Call ended successfully.");
      } catch (error) {
        console.error("Failed to end call:", error);
        setError("Failed to end call. Please try again.");
      }
    }
  };
  

  // 헤드폰 클릭 시 음소거 상태를 토글
  const handleHeadPhone = () => {
    const newHeadPhoneState = !isHeadPhone;
    setIsHeadPhone(newHeadPhoneState);

    console.log(`Headphone clicked. New mute state: ${newHeadPhoneState}`);

    if (session) {
      subscribers.forEach(subscriber => {
        subscriber.streamManager.subscribeToAudio(!newHeadPhoneState);
        console.log(`Audio mute toggled for subscriber: ${subscriber.streamId}. Muted: ${!newHeadPhoneState}`);
      });
    }
  };

  // 마이크 버튼 클릭 시 오디오 전송 상태를 토글
  const handleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMic);
      setIsMic(!isMic);
      console.log(`Mic toggled. Mic Enabled: ${!isMic}`);
    }
  };

  // 컴포넌트가 언마운트될 때 실행되는 정리 함수
  useEffect(() => {
    return () => {
      if (isCallStarted) {
        console.log("Component unmounted. Ending call...");
        handleCallEnd();
      }
    };
  }, [isCallStarted]);

  return (
    <div>
      <ScheduleDetail />

      {error && <div className="error">{error}</div>}

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
              className={ !isHeadPhone ? "headphone-mic-container-activate" : "headphone-mic-container"}
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
  );
}

export default ScheduleDetailPart;
