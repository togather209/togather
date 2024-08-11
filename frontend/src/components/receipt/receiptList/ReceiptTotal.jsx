import React from "react";
import "./ReceiptList.css";

function ReceiptTotal({ amount }) {
  return (
    <div className="receipt-total">
      <p>실시간 정산 현황</p>
      <h3>{amount.toLocaleString()}원</h3>
    </div>
  );
}

export default ReceiptTotal;
