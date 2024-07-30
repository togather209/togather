import React, { useState } from "react";
import "./TransactionList.css";
import image from "../../assets/icons/common/chunsik.png";
import BackButton from "../common/BackButton";

const transactions = [
  { id: 1, date: "7.21", amount: "-3,600원", name: "이지혜", type: "negative" },
  { id: 2, date: "7.20", amount: "+15,000원", name: "나", type: "positive" },
  {
    id: 3,
    date: "7.20",
    amount: "+10,300원",
    name: "김해수",
    type: "positive",
  },
  { id: 4, date: "7.19", amount: "-5,200원", name: "김선하", type: "negative" },
  {
    id: 5,
    date: "7.18",
    amount: "+20,000원",
    name: "서두나",
    type: "positive",
  },
];

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

function TransactionList() {
  const groupedTransactions = groupTransactionsByDate(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="transaction-container">
      <div className="header">
        <BackButton />
        <h1 className="title">거래 내역</h1>
      </div>
      <div className="transactions-list">
        {Object.keys(groupedTransactions).map((date) => (
          <div key={date} className="transactions-date-group">
            <p className="transactions-date">{date}</p>
            {groupedTransactions[date].map((transaction) => (
              <div
                className="transactions-item"
                key={transaction.id}
                onClick={() => openModal(transaction)}
              >
                <img src={image} alt="Avatar" className="avatar" />
                <div className="transactions-details">
                  <p className={`transactions-amount ${transaction.type}`}>
                    {transaction.amount}
                  </p>
                  <p className="transactions-name">{transaction.name}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedTransaction && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-details">
              <img src={image} alt="Avatar" />
              <p className="modal-name">{selectedTransaction.name}</p>
              <p className={`transactions-amount ${selectedTransaction.type}`}>
                {selectedTransaction.amount}
              </p>
              <div className="transactions-information">
                <p>거래시각: 2024/07/13 10:53</p>
                <p>
                  구분:{" "}
                  {selectedTransaction.type === "positive" ? "입금" : "송금"}
                </p>
                <p>거래 후 잔액: 41,000원</p>
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
