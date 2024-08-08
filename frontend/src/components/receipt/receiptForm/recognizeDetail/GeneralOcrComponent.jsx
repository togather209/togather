import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../../common/Loading";
import Modal from "../../../common/Modal";

const GENERAL_API_URL = "/ocr/general";

function GeneralOcrComponent({ image, onOcrResult }) {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(false); // 에러 상태 관리

  useEffect(() => {
    const fetchOcrResult = async () => {
      // OCR 인식 시에 Loading 화면
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
        // Ocr 결과를 문자열로 파싱
        const parsedResult = parseOcrResult(response.data);
        // 파싱된 문자열 중 상호명, 결제일시, 결제 총액을 openai api를 통해 분석
        const analyzedResult = await analyzeTextWithOpenAI(parsedResult);
        // ocr 처리 결과 반환
        onOcrResult(analyzedResult);
      } catch (error) {
        setError(true);
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
      // openai에 보낼 요청 프롬프트
      const prompt =
        await `다음 텍스트에서 상호명, 결제일시, 결제 총액을 추출하세요.\n\n텍스트: ${text}\n\n결과를 다음 형식으로 출력하세요.\n상호명: \n결제일시: \n결제 총액: \n`;

      // ocr로 인식한 문자열 분석 요청 API
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

        // API 응답으로 받은 데이터를 상호명, 결제일시, 결제 총액으로 분리
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

        // 결제 일시 유효성 검사
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
        // 모바일 결제 내역이 인식되지 않은 경우 기본값
        return {
          businessName: "상호명",
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
      {error && (
        <Modal
          mainMessage="문제가 발생했습니다."
          subMessage="다시 시도해보세요."
          onClose={() => setError(false)}
        />
      )}
    </div>
  );
}

export default GeneralOcrComponent;
