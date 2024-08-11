import { useEffect, useState } from "react";
import "./PaymentRenderButton.css";
import AppealModal from "./AppealModal";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../common/Modal";
import axios from "axios";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";

const API_LINK = import.meta.env.VITE_API_URL;

function PaymentRenderButton({ paymentData, teamId, planId }) {
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [accountError, setAccountError] = useState(false);
  const [completePayment, setCompletePayment] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    // 정산 수락하기
    const patchPayment = async () => {
      const response = await axiosInstance.patch(
        `/teams/${teamId}/plans/${planId}/payments/approvals`
      );

      console.log(response.data);

      if (response.data.data.isAllApproved) {
        const response = await axiosInstance.post(
          `/teams/${teamId}/plans/${planId}/payments`
        );

        console.log(response.data);
      }

      // 동의 처리 후 페이지 새로고침
      window.location.reload();
    };

    patchPayment();
  };

  const handleSend = () => {
    // 정산 내역 송금하기 요청
    const sendPayments = async () => {
      try {
        const state = store.getState();
        const { accessToken } = state.auth;

        const response = await axios.post(
          `${API_LINK}/teams/${teamId}/plans/${planId}/payments/me/transfer`,
          {},
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            },
            withCredentials: true, // 쿠키를 포함한 요청을 보내기 위해 필요
          }
        );

        console.log(response);
        // 송금 성공 처리
        if (response) {
          setCompletePayment(true);
          // 송금 후 페이지 새로고침
          window.location.reload();
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // 404 에러 처리
          setAccountError(true);
        } else {
          // 다른 에러 처리
          console.error("정산 내역 송금 중 예외 상황 발생:", error);
          // setError({ status: true, message: "" });
        }
      }
    };

    sendPayments();
  };

  const renderButton = () => {
    if (paymentData.status === 0) {
      // (개인) 정산 동의 전 상태
      // 이의 신청 / 정산 동의 버튼 활성화
      return (
        <div className="payment-render-button-container">
          <button
            className="payment-button-appeal-register"
            onClick={() => {
              setIsAppealModalOpen(true);
            }}
          >
            이의 신청
          </button>
          <button className="payment-button-agree" onClick={handleAgree}>
            동의
          </button>
        </div>
      );
    } else if (paymentData.status === 1) {
      // (개인) 정산 동의 후 & (전체) 정산 동의 천
      // 송금 대기 버튼 활성화
      return (
        <div className="payment-render-button-container">
          <button className="payment-button-wait-send">송금 대기</button>
        </div>
      );
    } else if (paymentData.status === 2) {
      // (전체) 정산 동의 후 & (개인) 송금 대기
      // 송금 버튼 활성화
      return (
        <div className="payment-render-button-container">
          <button className="payment-button-send" onClick={handleSend}>
            송금하기
          </button>
        </div>
      );
    } else {
      // (개인) 송금 완료
      // 버튼 비활성화
      return <div className="payment-render-button-container"></div>;
    }
  };

  return (
    <>
      {renderButton()}
      {isAppealModalOpen && (
        <AppealModal
          teamId={teamId}
          planId={planId}
          onClose={() => setIsAppealModalOpen(false)}
        />
      )}
      {accountError && (
        <Modal
          mainMessage="등록된 Pay 계좌가 없습니다."
          subMessage="지금 바로 만들어보세요 !"
          onClose={() => setAccountError(false)}
          onConfirm={() => {
            navigate("/wallet");
          }}
          buttonText="계좌 생성하기"
        />
      )}
      {completePayment && <Modal mainMessage="송금 완료 !" />}
    </>
  );
}

export default PaymentRenderButton;
