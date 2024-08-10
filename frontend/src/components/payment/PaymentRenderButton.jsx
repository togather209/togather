import { useEffect, useState } from "react";
import "./PaymentRenderButton.css";
import AppealModal from "./AppealModal";
import axiosInstance from "../../utils/axiosInstance";

function PaymentRenderButton({ paymentData, teamId, planId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAgree = () => {
    // 정산 수락하기
    const patchPayment = async () => {
      const response = await axiosInstance.patch(
        `/teams/${teamId}/plans/${planId}/payments/approvals`
      );

      console.log(response.data);

      if (response.data.data.isAllApproved) {
        const response = await axiosInstance.post(
          `/teams/${teamId}/plans/${planId}/payments/approvals`
        );

        console.log(response.data);
      }
    };

    patchPayment();
  };

  const handleSend = () => {
    // TODO : 정산하기 요청
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
              setIsModalOpen(true);
            }}
            teamId={teamId}
            planId={planId}
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
    } else if (paymentData.status === 3) {
      // (개인) 송금 완료
      // 버튼 비활성화
      return <div className="payment-render-button-container"></div>;
    }
  };

  return (
    <>
      {renderButton()}
      {isModalOpen && (
        <AppealModal
          teamId={teamId}
          planId={planId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default PaymentRenderButton;
