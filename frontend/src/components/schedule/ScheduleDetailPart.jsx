import React, { useState, useEffect, useRef } from "react";
import { OpenVidu } from 'openvidu-browser'; // 올바른 임포트 경로
import "./ScheduleDetail.css";
import headphone from "../../assets/schedule/headphone.png";
import mic from "../../assets/schedule/mic.png";
import ScheduleButton from "./ScheduleButton";
import ScheduleDetail from "./ScheduleDetail";

const OPENVIDU_SERVER_URL = "https://YOUR_OPENVIDU_SERVER_URL";
const OPENVIDU_SERVER_SECRET = "YOUR_SECRET";

function ScheduleDetailPart() {
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isHeadPhone, setIsHeadPhone] = useState(false);
    const [isMic, setIsMic] = useState(false);
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);

    const mySession = useRef(null);

    const handleCallStart = async () => {
        if (isCallStarted) {
            await endCall();
        } else {
            await startCall();
        }
    };

    const handleHeadPhone = () => setIsHeadPhone(!isHeadPhone);

    const handleMic = () => {
        if (publisher) {
            publisher.publishAudio(!isMic);
        }
        setIsMic(!isMic);
    };

    const startCall = async () => {
        try {
            const OV = new OpenVidu(); // OpenVidu 클래스 생성
            const session = OV.initSession();
            setSession(session);
            mySession.current = session;

            session.on('streamCreated', (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
            });

            session.on('streamDestroyed', (event) => {
                const { stream } = event;
                setSubscribers((prevSubscribers) =>
                    prevSubscribers.filter((subscriber) => subscriber.stream.streamId !== stream.streamId)
                );
            });

            const response = await fetch(`${OPENVIDU_SERVER_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET)}`,
                    'Content-Type': 'application/json',
                },
            });
            const { token } = await response.json();

            await session.connect(token);
            const publisher = OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: false,
                resolution: '640x480',
                frameRate: 30,
            });
            setPublisher(publisher);
            await session.publish(publisher);
            setIsCallStarted(true);
        } catch (error) {
            console.error('Failed to start call:', error);
        }
    };

    const endCall = async () => {
        try {
            if (session) {
                session.unpublish(publisher);
                session.disconnect();
                setIsCallStarted(false);
                setPublisher(null);
                setSubscribers([]);
            }
        } catch (error) {
            console.error('Failed to end call:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (session) {
                session.disconnect();
            }
        };
    }, [session]);

    return (
        <div>
            <ScheduleDetail />
            <div className="schedule-detail-button">
                {isCallStarted ? (
                    <ScheduleButton type={"border"} onClick={handleCallStart}>
                        통화 종료
                    </ScheduleButton>
                ) : (
                    <ScheduleButton type={"purple"} onClick={handleCallStart}>
                        통화 시작
                    </ScheduleButton>
                )}
                {isCallStarted && (
                    <div className="schedule-detail-call-started">
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
