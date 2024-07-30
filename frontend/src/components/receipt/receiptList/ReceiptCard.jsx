// components/reciept/RecieptCard.jsx
import React from 'react';
import './ReceiptList.css';

const ReceiptCard = ({ receipt, onClick }) => {
  return (
    <div className={`receipt-card ${receipt.color}`} onClick={onClick}>
      <h3>{receipt.title}</h3>
      <p>총액</p>
      <p className='amount'>{receipt.amount.toLocaleString()}원</p>
      <p className='date'>일시 : {receipt.date.slice(2)}</p>
    </div>
  );
}

export default ReceiptCard;
