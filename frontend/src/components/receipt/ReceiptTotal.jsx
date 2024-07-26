import React from 'react';
import './Receipt.css';

function ReceiptTotal({ amount }) {
  return (
    <div className="receipt-total">
      <h3>실시간 정산 현황</h3>
      <p>{amount}</p>
    </div>
  );
}

export default ReceiptTotal;
