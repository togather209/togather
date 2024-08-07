import React, { useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL =
  "/api/custom/v1/33255/abfa332191b2a5beddd3e52a02738361b81c71214c0ff13d894c8042d6229297/document/receipt";

function OcrComponent({ image, onOcrResult }) {
  useEffect(() => {
    const fetchOcrResult = async () => {
      try {
        const response = await axios.post(
          API_URL,
          {
            version: "V2",
            requestId: uuidv4(),
            timestamp: Date.now(),
            images: [
              {
                format: "jpg",
                data: image.split(",")[1],
                name: "receipt", // 임시 name
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-OCR-SECRET": import.meta.env.VITE_OCR_API_SECRET_KEY, // 환경변수에서 가져온 Secret 키
            },
          }
        );

        console.log(response);
        onOcrResult(response.data);
      } catch (error) {
        console.error("ocr 처리 중 문제가 발생하였습니다.", error);
      }
    };

    if (image) {
      fetchOcrResult();
    }
  }, [image, onOcrResult]);

  return (
    <div>
      <p>OCR 요청 중 ...</p>
    </div>
  );
}

export default OcrComponent;
