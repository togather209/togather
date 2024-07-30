import React, { useState } from "react";
import "./MyPayment.css";
import { useNavigate } from "react-router-dom";
import MyTransactionList from "./MyTransactionList";
import RechargeModal from "./RechargeModal";

function MyPayment() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openRechargeModal = () => {
    setIsModalOpen(true);
  };

  const closeRechargeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="payment-container">
      <div className="balance-container">
        <p className="balance-title">KBG의 만수르 지갑</p>
        <div className="balance-amount">
          <p className="balance-amount-money">27,900</p>
          <p className="balance-amount-won">원</p>
        </div>
        <div className="button-container">
          <button className="recharge-button" onClick={openRechargeModal}>충전</button>
          <button className="send-button" onClick={() => navigate('send')}>송금</button>
        </div>
      </div>
      <MyTransactionList />
      {isModalOpen && <RechargeModal closeModal={closeRechargeModal} />}
    </div>
  );
}

export default MyPayment;
