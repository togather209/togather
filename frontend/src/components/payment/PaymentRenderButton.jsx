import { useEffect, useState } from "react";
import "./PaymentRenderButton.css";
import AppealModal from "./AppealModal";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../common/Modal";
import axios from "axios";
import store from "../../redux/store";
import WarningIcon from "../../assets/icons/common/warning.png";
import Complete from "../../assets/icons/common/complete.png";
import { useNavigate } from "react-router-dom";

const API_LINK = import.meta.env.VITE_API_URL;

function PaymentRenderButton({ paymentData, teamId, planId }) {
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [accountError, setAccountError] = useState(false);
  const [completePayment, setCompletePayment] = useState(false);
  const [insufficientError, setInsufficientError] = useState(false);
  const [noHistory, setNoHistory] = useState(false);
  const [waitSendError, setWaitSendError] = useState(false);

  // 정산 수락하기 요청
  const handleAgree = () => {
    const patchPayment = async () => {
      const response = await axiosInstance.patch(
        `/teams/${teamId}/plans/${planId}/payments/approvals`
      );


      if (response.data.data.isAllApproved) {
        const response = await axiosInstance.post(
          `/teams/${teamId}/plans/${planId}/payments`
        );

      }

      // 동의 처리 후 페이지 새로고침
      window.location.reload();
    };

    patchPayment();
  };

  // 정산 내역 송금하기 요청
  const handleSend = () => {
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

        // 송금 성공 처리
        if (response) {
          if (response.status === 204) {
            // 송금 요청 시에 상쇄로 인해 보낼 내역이 없는 경우
            setNoHistory(true);
          } else {
            setCompletePayment(true);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // pay계좌가 없는 경우 404 에러 처리
          setAccountError(true);
        } else if (error.response && error.response.status === 400) {
          // 잔액이 부족한 경우 400 에러 처리
          setInsufficientError(true);
        } else {
          // 다른 에러 처리
          console.error("정산 내역 송금 중 예외 상황 발생:", error);
          // setError({ status: true, message: "" });
        }
      }
    };

    sendPayments();
  };

  // 모달 닫고 리로드
  const handleCloseAndReload = () => {
    // 모든 모달 닫기
    setNoHistory(false);
    setCompletePayment(false);
    window.location.reload(); // 이후 새로고침
  };

  // 현재 페이먼트 상태로 렌더링할 버튼 지정
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
        <>
          {waitSendError && (
            <div className="payment-warning-message">
              <img src={WarningIcon} alt="" className="warning-payment-icon" />
              아직 정산 동의 전인 모임원이 있습니다.
            </div>
          )}
          <div className="payment-render-button-container">
            <button
              className={`payment-button-wait-send ${
                waitSendError ? "active" : ""
              }`}
              onClick={() => {
                setWaitSendError(true);
              }}
            >
              송금 대기
            </button>
          </div>
        </>
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
      return (
        <div className="payment-render-button-container">
          <div className="payment-info-message">
            <img src={Complete} alt="" className="complete-payment-icon" />
            송금할 금액이 없거나 완료된 일정입니다.
          </div>
        </div>
      );
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
          mainMessage="계좌가 없는 모임원이 있어요."
          subMessage="지금 바로 Pay 계좌를 만들어보세요 !"
          onClose={() => setAccountError(false)}
        />
      )}
      {insufficientError && (
        <Modal
          mainMessage="계좌에 잔액이 부족합니다."
          subMessage="지금 바로 충전해보세요 !"
          onClose={() => setInsufficientError(false)}
        />
      )}
      {noHistory && (
        <Modal
          mainMessage="이체할 내역이 없습니다."
          subMessage="다른 사람의 송금을 기다려보세요 !"
          onClose={() => {
            setNoHistory(false);
            handleCloseAndReload();
          }}
        />
      )}
      {completePayment && (
        <Modal
          mainMessage="송금 완료 !"
          onClose={() => {
            setCompletePayment(false);
            handleCloseAndReload();
          }}
        />
      )}
    </>
  );
}

export default PaymentRenderButton;
