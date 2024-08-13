// DefaultProfileImage.js
import React, { useRef, useEffect } from "react";

const DefaultProfileImage = ({ nickname, colorPairs, onGenerate }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas not found.");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("2D context not found.");
      return;
    }

    const colorPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    const initials = nickname.substring(0, 2).toUpperCase();

    const canvasSize = 100;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    context.fillStyle = colorPair.background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = colorPair.text;
    context.font = "bold 40px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initials, canvas.width / 2, canvas.height / 2);

    const imageDataUrl = canvas.toDataURL("image/png");

    if (onGenerate) {
      onGenerate(imageDataUrl);
    }
  }, [nickname, colorPairs, onGenerate]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default DefaultProfileImage;
