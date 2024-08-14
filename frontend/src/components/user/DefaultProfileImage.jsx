// DefaultProfileImage.js
import React, { useRef, useEffect, useState } from "react";

const DefaultProfileImage = ({ nickname, colorPairs, onGenerate }) => {
  const canvasRef = useRef(null);
  const [colorPair, setColorPair] = useState(
    () => colorPairs[Math.floor(Math.random() * colorPairs.length)]
  );

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

    const initials = nickname.substring(0, 2);

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
  }, [nickname, colorPairs]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default DefaultProfileImage;
