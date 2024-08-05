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
import { setTeamPlan } from "../../../redux/slices/receiptSlice";
import { useDispatch } from "react-redux";

function ReceiptListContainer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // TODO : meetingId, scheduleId 가져오기
  const teamId = 1;
  const planId = 1;

  // state : 일정 진행 중(before), 일정 끝남(after), 정산 완료(completet)
  const [scheduleState, setScheduleState] = useState("before");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    if (!teamId || !planId) {
      console.error("meetingId 또는 scheduleId가 전달되지 않았습니다.");
      return;
    }

    // teamId와 planId를 redux에 저장
    dispatch(setTeamPlan({ teamId, planId }));

    // 영수증 전체 조회 API 요청
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
    // TODO : 일정장 확인 후 일정 끝내기 버튼 활성화

    fetchReceipt();
  }, [teamId, planId, dispatch]);

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
    // console.log(receipt);
    navigate(`/receipt/${receipt.receiptId}`, {
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
