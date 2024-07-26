// components/reciept/RecieptCard.jsx
import React from 'react';
import './Receipt.css';

const RecieptCard = ({ receipt, onClick }) => {
  return (
    <div className="receipt-card" onClick={onClick}>
      <h3>{receipt.title}</h3>
      <p>총액: {receipt.amount.toLocaleString()}원</p>
      <p>모임명: {receipt.description}</p>
      <p>결제자: {receipt.payer}</p>
      <p>주문일시: {receipt.date}</p>
    </div>
  );
}

export default RecieptCard;
