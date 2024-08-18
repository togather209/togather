import React, { useState, useEffect } from "react";
import "./TransactionList.css";
import image from "../../assets/icons/common/chunsik.png";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";
import deposit from "../../assets/wallet/deposit.jpg";
import withdraw from "../../assets/wallet/withdraw.jpg";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsTransactions, setDetailsTransactions] = useState([]);

  useEffect(() => {
    callTransactionData();
  }, []);

  const callTransactionData = async () => {
    try {
      const response = await axiosInstance.get("/transactions/members/me");
      const transactionData = response.data.data;

      // 데이터를 최신순으로 정렬
      transactionData.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 데이터 가공: 날짜 형식 변환 및 금액과 이름 처리
      const formattedTransactions = transactionData.map((transaction) => {
        const date = new Date(transaction.date);
        const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`; // 월-일 포맷

        const isSender = transaction.status === 0;
        const name = isSender
          ? transaction.senderName
          : transaction.receiverName;
        const amount = isSender
          ? `+${transaction.price.toLocaleString()}원`
          : `-${transaction.price.toLocaleString()}원`;
        const type = isSender ? "positive" : "negative";

        return {
          id: transaction.transactionListId,
          date: formattedDate,
          name,
          amount,
          type,
          originalDate: transaction.date,
          transactionInfo: transaction, // 추가로 모든 정보를 저장해두기
        };
      });

      // 날짜별 그룹화
      const groupedTransactions = groupTransactionsByDate(
        formattedTransactions
      );
      setTransactions(groupedTransactions);
    } catch (error) {
      console.error("거래 내역을 불러오는 중 오류 발생:", error);
    }
  };

  // 거래 내역을 날짜별로 그룹화하는 함수
  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  const openModal = async (transaction) => {
    //아이디에 해당하는 정보 가져오기
    const detailsTransaction = await axiosInstance.get(
      `/transactions/${transaction.id}`
    );
    setDetailsTransactions(detailsTransaction.data.data);
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance);
    return numericBalance.toLocaleString("ko-KR");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 두 자리 연도
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="transaction-container">
      <div className="transactions-header">
        <BackButton />
        <h1 className="transactions-title">거래 내역</h1>
      </div>
      <div className="transactions-list">
        {Object.keys(transactions).map((date) => (
          <div key={date} className="transactions-date-group">
            <p className="transactions-date">{date}</p>
            {transactions[date].map((transaction) => (
              <div
                className="transactions-item"
                key={transaction.id}
                onClick={() => openModal(transaction)}
              >
                <img
                  src={transaction.type === "positive" ? deposit : withdraw}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="transactions-details">
                  <div>
                    <p className="transactions-name">{transaction.name}</p>
                    <p className="transactions-type">
                      {transaction.type === "positive" ? "입금" : "송금"}
                    </p>
                  </div>
                  <p className={`transactions-amount ${transaction.type}`}>
                    {transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedTransaction && detailsTransactions !== null && (
        <div className="selected-modal" style={{ display: "block" }}>
          <div className="selected-modal-content">
            <div className="selected-modal-header">
              <p>상세 내역</p>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <div className="selected-modal-details">
              <div className="selected-modal-details-title">
                <img
                  src={
                    selectedTransaction.type === "positive" ? deposit : withdraw
                  }
                  alt="Avatar"
                />
                <p>
                  {selectedTransaction.type === "positive" ? "입금" : "송금"}
                </p>
              </div>
              <p className="selected-modal-name">{selectedTransaction.name}</p>
              <div className="transactions-amount">
                <p
                  className={`transactions-amount ${selectedTransaction.type}`}
                >
                  {selectedTransaction.amount}
                </p>
              </div>
              <div className="transactions-information">
                <div className="transactions-information-time-header">
                  <p className="transactions-information-time-title">
                    거래시각 :{" "}
                  </p>
                  <p className="transactions-information-time">
                    {formatDate(selectedTransaction.originalDate)}
                  </p>
                </div>
                <div className="transactions-information-type-header">
                  <p className="transactions-information-type-title">구분: </p>
                  <p className="transactions-information-type">
                    {selectedTransaction.type === "positive" ? "입금" : "송금"}
                  </p>
                </div>
                <div className="transations-information-amount-header">
                  <p className="transations-information-amount-title">거래 후 잔액: </p>
                <p className="transations-information-amount">
                  {formatBalance(detailsTransactions.balance)}원
                </p>
                </div>
              </div>
            </div>
            <button className="selected-confirm-button" onClick={closeModal}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
