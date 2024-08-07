import React, { useState } from "react";
import "./MyPayment.css";
import { useNavigate } from "react-router-dom";
import MyTransactionList from "./MyTransactionList";
import RechargeModal from "./RechargeModal";
import { useSelector } from "react-redux";

function MyPayment() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const member = useSelector((state) => state.user.member);
  const account = useSelector((state) => state.account.account);

  const openRechargeModal = () => {
    setIsModalOpen(true);
  };

  const closeRechargeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="payment-container">
      <div className="balance-container">
        <p className="balance-title">{member.nickname}의 {account.payAccountName} 지갑</p>
        <div className="balance-amount">
          <p className="balance-amount-money">{account.balance}</p>
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
