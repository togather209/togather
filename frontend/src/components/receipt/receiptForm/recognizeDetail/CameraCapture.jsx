import React, { useEffect, useRef } from "react";
import "./CameraCapture.css";

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("카메라 캡쳐 페이지 mount");
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("카메라 접근 오류:", err);
      }
    };

    startCamera();

    return () => {
      // 컴포넌트가 언마운트될 때 스트림을 정리합니다.
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const image = canvasRef.current.toDataURL("image/png");

    // 스트림 종료
    // if (videoRef.current && videoRef.current.srcObject) {
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    // }

    onCapture(image);
  };

  return (
    <div className="camera-capture-container">
      <button onClick={onClose} className="close-button">
        닫기
      </button>
      <div className="camera">
        <video ref={videoRef} autoPlay className="camera-video" />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="camera-canvas"
        />
        <button onClick={handleCapture} className="capture-button">
          사진 찍기
        </button>
      </div>
    </div>
  );
}

export default CameraCapture;
