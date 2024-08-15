import React from "react";
import "./ReceiptCard.css";

import Sky from "../../../assets/receipt/skyBackground.png";
import Pink from "../../../assets/receipt/pinkBackground.png";
import Yellow from "../../../assets/receipt/yellowBackground.png";

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
    <>
      {receipt.color === 0 && (
        <div className="receipt-card-container" onClick={onClick}>
          <img src={Sky} alt="background" className="receipt-background" />
          <div className="receipt-card-content sky">
            <h3>{receipt.businessName}</h3>
            <hr />
            <p>총액</p>
            <p className="receipt-amount">
              {receipt.totalPrice.toLocaleString()}원
            </p>
            <hr />
            <p className="receipt-date">
              일시 : {receipt.paymentDate.slice(2, 10)}
            </p>
          </div>
        </div>
      )}

      {receipt.color === 1 && (
        <div className="receipt-card-container" onClick={onClick}>
          <img src={Pink} alt="background" className="receipt-background" />
          <div className="receipt-card-content pink">
            <h3>{receipt.businessName}</h3>
            <hr className="pink-line" />
            <p>총액</p>
            <p className="receipt-amount">
              {receipt.totalPrice.toLocaleString()}원
            </p>
            <p className="receipt-date">
              일시 : {receipt.paymentDate.slice(2, 10)}
            </p>
          </div>
        </div>
      )}

      {receipt.color === 2 && (
        <div className="receipt-card-container" onClick={onClick}>
          <img src={Yellow} alt="background" className="receipt-background" />
          <div className="receipt-card-content yellow">
            <h3>{receipt.businessName}</h3>
            <hr />
            <p>총액</p>
            <p className="receipt-amount">
              {receipt.totalPrice.toLocaleString()}원
            </p>
            <hr />
            <p className="receipt-date">
              일시 : {receipt.paymentDate.slice(2, 10)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptCard;
