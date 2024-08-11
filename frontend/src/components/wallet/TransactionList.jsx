import React, { useState, useEffect } from "react";
import "./TransactionList.css";
import image from "../../assets/icons/common/chunsik.png";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";

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
    console.log(detailsTransaction.data.data);
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
                <img src={image} alt="Avatar" className="avatar" />
                <div className="transactions-details">
                  <div>
                    <p className="transactions-name">{transaction.name}</p>
                    <p className="transactions-type">
                      {transaction.type === "postive" ? "입금" : "송금"}
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
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-details">
              <p className="modal-details-title">거래 상세 내역</p>
              <p className="modal-name">
                {transactions.type === "postive" ? "받는 사람" : "보낸 사람"} :{" "}
                {selectedTransaction.name}
              </p>
              <div className="transactions-amount">
                <p>금액 : &nbsp;</p>
                <p
                  className={`transactions-amount ${selectedTransaction.type}`}
                >
                  {selectedTransaction.amount}
                </p>
              </div>
              <div className="transactions-information">
                <p>거래시각: {selectedTransaction.originalDate}</p>
                <p>
                  구분:{" "}
                  {selectedTransaction.type === "positive" ? "입금" : "송금"}
                </p>
                <p>
                  거래 후 잔액: {formatBalance(detailsTransactions.balance)}원
                </p>
              </div>
            </div>
            <button className="confirm-button" onClick={closeModal}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
