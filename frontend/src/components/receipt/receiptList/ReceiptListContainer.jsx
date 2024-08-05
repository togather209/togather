import React, { useState } from "react";

import "./ReceiptList.css";

import ReceiptCard from "./ReceiptCard";
import ReceiptAddButton from "./ReceiptAddButton";
import ReceiptTotal from "./ReceiptTotal";
import BackButton from "../../common/BackButton";
import LineButton from "../../common/LineButton";
import { useNavigate } from "react-router-dom";

import FinishedScheduleButton from "./FinishedScheduleButton";
import ScheduleFinishModal from "./ScheduleFinishModal";

function ReceiptListContainer() {
  // state : 일정 진행 중(before), 일정 끝남(after), 정산 완료(completet)
  const [scheduleState, setScheduleState] = useState("before");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO : 전체 영수증 리스트 가져오기
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      color: "pink",
      title: "한화 이글스 파크",
      amount: 63000,
      date: "2024.07.02",
    },
    {
      id: 2,
      color: "sky",
      title: "시립 미술관",
      amount: 5000,
      date: "2024.07.01",
    },
    {
      id: 3,
      color: "yellow",
      title: "How Cafe",
      amount: 20000,
      date: "2024.07.01",
    },
  ]);

  // TODO : 일정장인지 확인해서 일정 끝내기 보여주기
  const IsScheduleReader = () => {};

  // TODO : meetingId, scheduleId 가져오기
  const meetingId = 1,
    scheduleId = 2;

  const navigate = useNavigate();

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
      state: { meetingId: meetingId, scheduleId: scheduleId },
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
            key={receipt.id}
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
