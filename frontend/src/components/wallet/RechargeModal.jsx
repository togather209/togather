import React, { useState } from "react";
import "./RechargeModal.css";
import bank from "../../assets/icons/common/kb.png";

function RechargeModal({ closeModal }) {
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (value) => {
    setAmount((prevAmount) => prevAmount + value);
  };

  const handleKeypadInput = (value) => {
    if (amount <= 9999999999999) {
      setAmount((prevAmount) => parseInt(`${prevAmount}${value}`));
    } else {
      alert("금액으로 장난질하지마라");
      window.location.reload();
    }
  };

  const handleBackspace = () => {
    setAmount((prevAmount) => Math.floor(prevAmount / 10));
  };

  const handleClear = () => {
    setAmount(0);
  };

  return (
    <div className="rechargemodal-overlay">
      <div className="rechargemodal-content">
        <button className="close-button" onClick={closeModal}>
          ×
        </button>
        <h2 className="rechargemodal-title">충전하기</h2>
        <div className="account-info">
          <img src={bank} alt="Bank Logo" className="bank-logo" />
          <div className="account-text">
            <span>국민은행 1223-02-5666</span>
            <span>
              <span>범규꼰</span> 계좌에서 충전해요.
            </span>
          </div>
        </div>
        <div className="amount-display">
          <p>{amount.toLocaleString()}</p> <span className="currency">원</span>
        </div>
        <div className="amount-buttons">
          <button onClick={() => handleAmountChange(10000)}>+ 1만원</button>
          <button onClick={() => handleAmountChange(30000)}>+ 3만원</button>
          <button onClick={() => handleAmountChange(50000)}>+ 5만원</button>
        </div>
        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button key={number} onClick={() => handleKeypadInput(number)}>
              {number}
            </button>
          ))}
          <button onClick={handleClear} className="remove-button">
            전체 삭제
          </button>
          <button onClick={() => handleKeypadInput(0)}>0</button>
          <button onClick={handleBackspace}>←</button>
        </div>
        <button className="confirm-button">충전</button>
      </div>
    </div>
  );
}

export default RechargeModal;
