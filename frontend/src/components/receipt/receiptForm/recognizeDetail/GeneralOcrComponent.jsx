import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../../common/Loading";

const GENERAL_API_URL = "/ocr/general";

function GeneralOcrComponent({ image, onOcrResult }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOcrResult = async () => {
      // 로딩 화면 시작
      setIsLoading(true);
      try {
        const response = await axios.post(
          GENERAL_API_URL,
          {
            version: "V2",
            requestId: uuidv4(),
            timestamp: Date.now(),
            lang: "ko",
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
              "X-OCR-SECRET": import.meta.env.VITE_GENERAL_OCR_API_SECRET_KEY, // 환경변수에서 가져온 Secret 키
            },
          }
        );

        console.log(response.data);
        const parsedResult = parseOcrResult(response.data);
        const analyzedResult = await analyzeTextWithOpenAI(parsedResult);

        onOcrResult(analyzedResult);
      } catch (error) {
        console.error("OCR 처리 중 문제가 발생하였습니다.", error);
      } finally {
        // 요청 종료 시 로딩화면 종료
        setIsLoading(false);
      }
    };

    // OCR 결과를 파싱하는 함수
    const parseOcrResult = (data) => {
      const fields = data.images[0].fields;
      return fields.map((field) => field.inferText).join(" ");
    };

    const analyzeTextWithOpenAI = async (text) => {
      const prompt =
        await `다음 텍스트에서 상호명, 결제일시, 결제 총액을 추출하세요.\n\n텍스트: ${text}\n\n결과를 다음 형식으로 출력하세요.\n상호명: \n결제일시: \n결제 총액: \n`;
      console.log(prompt);
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
          }
        );

        const result = response.data.choices[0].message.content
          .trim()
          .split("\n");
        const businessName = result[0].split(": ")[1];
        const paymentDateText = result[1].split(": ")[1];
        const totalPrice = parseInt(
          result[2].split(": ")[1].replace(/[^0-9]/g, ""),
          10
        );

        let paymentDate;
        if (isValidDate(paymentDateText)) {
          paymentDate = formatDate(paymentDateText);
        } else {
          paymentDate = new Date().toISOString().split("T")[0];
        }

        return {
          businessName,
          paymentDate,
          items: [{ name: "품목 없음", count: 1, unitPrice: totalPrice }],
        };
      } catch (error) {
        console.error("OpenAI 처리 중 문제가 발생하였습니다.", error);
        return {
          businessName: "상호명을 인식할 수 없습니다.",
          paymentDate: new Date().toISOString().split("T")[0],
          items: [{ name: "품목 없음", count: 1, unitPrice: 0 }],
        };
      }
    };

    // 날짜 형식 검증 함수
    const isValidDate = (dateString) => {
      const dateParts = dateString.split(/[^\d]/).map(Number);
      const [year, month, day] = dateParts;
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    };

    // 날짜 형식 변환 함수
    const formatDate = (dateString) => {
      const dateParts = dateString.split(/[^\d]/).map(Number);
      const [year, month, day] = dateParts;
      return `${year}/${month}/${day}`;
    };

    if (image) {
      fetchOcrResult();
    }
  }, [image, onOcrResult]);

  return (
    <div>
      {isLoading && (
        <Loading>
          <span style={{ color: "#712FFF" }}>결제 내용</span>을<br /> 분석
          중이에요
        </Loading>
      )}
    </div>
  );
}

export default GeneralOcrComponent;
