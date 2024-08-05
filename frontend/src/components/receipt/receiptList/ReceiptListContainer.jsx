import React, { useEffect, useState } from "react";

import "./ReceiptList.css";

import ReceiptCard from "./ReceiptCard";
import ReceiptAddButton from "./ReceiptAddButton";
import ReceiptTotal from "./ReceiptTotal";
import BackButton from "../../common/BackButton";
import LineButton from "../../common/LineButton";
import { useNavigate } from "react-router-dom";

import FinishedScheduleButton from "./FinishedScheduleButton";
import ScheduleFinishModal from "./ScheduleFinishModal";
import axiosInstance from "../../../utils/axiosInstance";

function ReceiptListContainer() {
  const navigate = useNavigate();

  // state : 일정 진행 중(before), 일정 끝남(after), 정산 완료(completet)
  const [scheduleState, setScheduleState] = useState("before");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receipts, setReceipts] = useState([]);

  // TODO : meetingId, scheduleId 가져오기
  const teamId = 1;
  const planId = 1;

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/receipts`
        );
        setReceipts(response.data.data); // 서버에서 받은 데이터를 상태로 설정
        console.log(response.data);
      } catch (error) {
        console.error("영수증 데이터를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchReceipt();
  }, []);

  // TODO : 일정장인지 확인해서 일정 끝내기 보여주기
  const IsScheduleReader = () => {};

  // 일정 끝내기 버튼
  const handlePurpleLineButton = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  // 일정 끝난 후 정산 확인 버튼
  const handleFinishedButtonClick = () => {
    // TODO : 정산 페이지로 이동
  };

  // 모달 닫기 버튼
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 모달 확인 버튼
  const handleComfirmModal = () => {
    setIsModalOpen(false);
    setScheduleState("after");
    // TODO : 정산 페이지로 이동
  };

  // 일정 상세보기 버튼
  const handleReceiptCard = (receipt) => {
    console.log(receipt);
    navigate(`/receipt/${receipt.id}`, {
      state: { teamId: teamId, planId: planId },
    });
  };

  const totalAmount = receipts.reduce(
    (total, receipt) => total + receipt.amount,
    0
  );

  return (
    <div className="receipt-container">
      <header className="list-header">
        <BackButton />
        {scheduleState === "before" && (
          <LineButton
            className="schedule-finish-button"
            onClick={handlePurpleLineButton}
          >
            일정 끝내기
          </LineButton>
        )}
      </header>
      {scheduleState !== "before" && (
        <FinishedScheduleButton
          scheduleState={scheduleState}
          onClick={handleFinishedButtonClick}
        />
      )}
      <div className="receipt-list">
        <ReceiptAddButton
          onClick={() => {
            navigate("regist-form");
          }}
        />
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.receiptId}
            receipt={receipt}
            onClick={() => handleReceiptCard(receipt)}
          />
        ))}
      </div>
      <ReceiptTotal amount="28,000원" />
      {isModalOpen && (
        <ScheduleFinishModal
          onClose={handleCloseModal}
          onConfirm={handleComfirmModal}
        />
      )}
    </div>
  );
}

export default ReceiptListContainer;
