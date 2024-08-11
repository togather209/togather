import React, { useEffect, useState } from "react";

import "./ReceiptList.css";

import ReceiptCard from "./ReceiptCard";
import ReceiptAddButton from "./ReceiptAddButton";
import ReceiptTotal from "./ReceiptTotal";
import BackButton from "../../common/BackButton";
import LineButton from "../../common/LineButton";
import { useLocation, useNavigate } from "react-router-dom";

import FinishedScheduleButton from "./FinishedScheduleButton";
import ScheduleFinishModal from "./ScheduleFinishModal";
import axiosInstance from "../../../utils/axiosInstance";
import { setTeamPlan } from "../../../redux/slices/receiptSlice";
import { useDispatch } from "react-redux";
import Modal from "../../common/Modal";

function ReceiptListContainer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let { teamId, planId } = location.state || {};

  // status : 일정 진행 중(0), 일정 끝남(1), 정산 완료(3)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(0);
  const [auth, setAuth] = useState(false);
  const [liveStatus, setLiveStatus] = useState(0);

  useEffect(() => {
    if (!teamId || !planId) {
      teamId = Number(localStorage.getItem("teamId"));
      planId = Number(localStorage.getItem("planId"));
    }

    // teamId와 planId를 redux와 localStorage에 저장
    dispatch(setTeamPlan({ teamId, planId }));
    localStorage.setItem("teamId", teamId);
    localStorage.setItem("planId", planId);

    // 영수증 전체 조회 API 요청
    const fetchReceipt = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/receipts`
        );
        setReceipts(response.data.data.receiptFindByPlanIds); // 서버에서 받은 영수증 데이터를 설정
        setStatus(response.data.data.status); // 일정 상태 설정
        console.log(response.data);
      } catch (error) {
        console.error("영수증 데이터를 가져오는 데 실패했습니다.", error);
        setError(true);
      }
    };

    // 일정 권한 조회 API 요청
    const fetchAuth = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/auths`
        );
        setAuth(response.data.data.isManager);
        console.log(response.data);
      } catch (error) {
        console.error("일정 권한 조회 요청 중 문제 발생", error);
      }
    };

    // 실시간 정산 현황 API 요청
    const fetchLiveStatus = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/payments/me`
        );

        console.log(response.data);
        setLiveStatus(response.data.data.money);
      } catch (error) {
        console.error("실시간 정산 현황 요청 중 문제 발생", error);
      }
    };

    // 일정장 확인 후 일정 끝내기 버튼 활성화
    fetchReceipt();
    fetchAuth();
    fetchLiveStatus();
  }, [teamId, planId, dispatch]);

  // 일정 끝내기 버튼
  const handlePurpleLineButton = () => {
    // 모달 창 활성화
    setIsModalOpen(true);
  };

  // 일정 끝난 후 정산 확인 버튼
  const handleFinishedButtonClick = () => {
    // teamId나 planId가 없는 경우 처리
    if (!teamId || !planId) {
      teamId = Number(localStorage.getItem("teamId"));
      planId = Number(localStorage.getItem("planId"));
    }
    // 정산 페이지로 이동
    navigate("/payment", { state: { teamId: teamId, planId: planId } });
  };

  // 모달 닫기 버튼
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 정산 API 요청 (일정 끝내기)
  const finishSchedule = async () => {
    try {
      const response = await axiosInstance.post(
        `/teams/${teamId}/plans/${planId}/payments/approvals`
      );

      console.log(response.data);
    } catch (error) {
      console.error("");
    }
  };

  // 모달 확인 버튼
  const handleComfirmModal = () => {
    // 일정 종료 처리
    setIsModalOpen(false);
    setStatus(1);
    finishSchedule();
  };

  // 일정 상세보기 버튼
  const handleReceiptCard = (receipt) => {
    // console.log(receipt);
    navigate(`/receipt/${receipt.receiptId}`, {
      state: { teamId: teamId, planId: planId },
    });
  };

  return (
    <div className="receipt-container">
      <header className="list-header">
        <BackButton />
        {status === 0 && auth && (
          <LineButton
            className="schedule-finish-button"
            onClick={handlePurpleLineButton}
          >
            일정 끝내기
          </LineButton>
        )}
      </header>
      {status !== 0 && (
        <FinishedScheduleButton
          status={status}
          onClick={handleFinishedButtonClick}
        />
      )}
      <div className="receipt-list">
        {status === 0 && (
          <ReceiptAddButton
            onClick={() => {
              navigate("regist-form");
            }}
          />
        )}
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.receiptId}
            receipt={receipt}
            onClick={() => handleReceiptCard(receipt)}
          />
        ))}
      </div>
      <ReceiptTotal amount={liveStatus} />
      {isModalOpen && (
        <ScheduleFinishModal
          onClose={handleCloseModal}
          onConfirm={handleComfirmModal}
        />
      )}
      {error &&
        (!planId ? (
          <Modal
            mainMessage="접근할 수 없는 페이지입니다."
            subMessage="다시 시도해보세요."
            onClose={() => {
              setError(false);
              navigate(-1);
            }}
          />
        ) : (
          <Modal
            mainMessage="영수증 데이터를 가져올 수 없습니다.."
            subMessage="다시 시도해보세요."
            onClose={() => setError(false)}
          />
        ))}
    </div>
  );
}

export default ReceiptListContainer;
