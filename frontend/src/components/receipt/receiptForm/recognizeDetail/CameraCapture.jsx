import React, { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";
import CloseIcon from "../../../../assets/receipt/closeCamera.png"; // 닫기 아이콘 이미지 경로
import CaptureIcon from "../../../../assets/receipt/capture.png"; // 촬영 버튼 이미지 경로
import CornerIcon from "../../../../assets/receipt/cameraFocus.png"; // 네모 모서리 아이콘 이미지 경로

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
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

    const timer = setTimeout(() => setShowInstruction(false), 2000);

    return () => {
      // 컴포넌트가 언마운트될 때 스트림을 정리합니다.
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      clearTimeout(timer);
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
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }

    onCapture(image);
  };

  const handleClose = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="camera-capture-container">
      <button onClick={handleClose} className="close-button">
        <img src={CloseIcon} alt="닫기" />
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
          <img src={CaptureIcon} alt="촬영" />
        </button>
        <div className="camera-overlay">
          <img src={CornerIcon} alt="corner" className="focus-corners" />
        </div>
      </div>
      {showInstruction && (
        <p className="instruction">영수증을 촬영해 쉽게 인식해보세요.</p>
      )}
    </div>
  );
}

export default CameraCapture;
