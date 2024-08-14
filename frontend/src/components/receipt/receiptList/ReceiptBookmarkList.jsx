import React, { useEffect, useState } from "react";
import "./ReceiptBookmarkList.css";
import BackButton from "../../common/BackButton";
import ReceiptCard from "./ReceiptCard";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

function ReceiptBookmarkList() {
  const navigate = useNavigate();
  const location = useLocation();

  let { teamId, planId, bookmarkId } = location.state || {};
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookmarkId) {
      bookmarkId = Number(localStorage.getItem("bookmarkId"));
    }

    // bookmarkId를 redux와 localStorage에 저장
    localStorage.setItem("bookmarkId", bookmarkId);

    // 영수증 리스트 조회 API 요청
    const fetchReceipts = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/bookmarks/${bookmarkId}/receipts`
        );
        setReceipts(response.data.data);
      } catch (error) {
        console.error("영수증 데이터를 가져오는 데 실패했습니다.", error);
        setError(true);
      }
    };

    fetchReceipts();
  }, [bookmarkId]);

  const handleReceiptCard = (receipt) => {
    // 영수증 상세 페이지로 이동
    navigate(`/receipt/${receipt.receiptId}`, {
      state: { bookmarkId: bookmarkId },
    });
  };

  return (
    <div className="receipt-bookmark-container">
      <header className="bookmark-list-header">
        <BackButton />
      </header>
      <div className="receipt-bookmark-list">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.receiptId}
            receipt={receipt}
            onClick={() => handleReceiptCard(receipt)}
          />
        ))}
      </div>
    </div>
  );
}

export default ReceiptBookmarkList;
