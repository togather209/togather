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
  const [isHeadPhone, setIsHeadPhone] = useState(false);
  const [isMic, setIsMic] = useState(true);
  const { id, schedule_id } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${id}/plans/${schedule_id}`
        );
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

  const handleCallStart = async () => {
    if (isCallStarted) return;

    try {
      if (sessionId) {
        const response = await axiosInstance.post(
          `/sessions/${sessionId}/connections`
        );
        const token = response.data.data.token;

        const OV = new OpenVidu();
        const newSession = OV.initSession();

        newSession.on("streamCreated", (event) => {
          const subscriberContainer = document.createElement("div");
          subscriberContainer.id = event.stream.streamId;
          document.body.appendChild(subscriberContainer);
          newSession.subscribe(event.stream, subscriberContainer.id);
        });

        newSession.on("streamDestroyed", (event) => {
          const subscriberContainer = document.getElementById(event.stream.streamId);
          if (subscriberContainer) {
            subscriberContainer.remove();
          }
        });

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

  const handleCallEnd = () => {
    if (session) {
      session.disconnect();
  
      setIsCallStarted(false);

      const publisherContainer = document.getElementById("publisher");
      if (publisherContainer) {
        publisherContainer.remove();
      }


      const subscriberContainers = document.querySelectorAll("div[id^='stream']");
      subscriberContainers.forEach(container => container.remove());
    }
  };

  const handleHeadPhone = () => setIsHeadPhone(!isHeadPhone);

  const handleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMic);
    }
    setIsMic(!isMic);
  };

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
  );
}

export default ScheduleDetailPart;
