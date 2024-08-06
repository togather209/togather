// components/reciept/RecieptCard.jsx
import React from "react";
import "./ReceiptList.css";

const ReceiptCard = ({ receipt, onClick }) => {
  const receiptColor = () => {
    if (receipt.color === 0) {
      return "sky";
    } else if (receipt.color === 1) {
      return "pink";
    } else if (receipt.color === 2) {
      return "yellow";
    }
  };

  return (
    <div className={`receipt-card ${receiptColor()}`} onClick={onClick}>
      <h3>{receipt.businessName}</h3>
      <p>총액</p>
      <p className="amount">{receipt.totalPrice.toLocaleString()}원</p>
      <p className="date">일시 : {receipt.paymentDate.slice(2, 10)}</p>
    </div>
  );
};

export default ReceiptCard;
