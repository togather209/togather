import React, { useRef, useState } from "react";
import BackButton from "../../../common/BackButton";
import "./CameraCapture.css";

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(true);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("카메라 접근 오류:", err);
    }
  };

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
    history.push("/recognize", { capturedImage: image });
  };

  return (
    <div className="camera-capture-container">
      <BackButton />
      {isCameraOpen && (
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
      )}
    </div>
  );
}

export default CameraCapture;
