import React, { useState } from "react";
import "./MyPayment.css";
import { useNavigate } from "react-router-dom";
import MyTransactionList from "./MyTransactionList";
import RechargeModal from "./RechargeModal";
import { useSelector } from "react-redux";
import wallet from "../../assets/wallet/wallet.png";
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

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance);
    return numericBalance.toLocaleString("ko-KR"); // 'ko-KR' 로케일을 사용하여 한국어 형식으로 변환
  };
  return (
    <div className="payment-container">
      <p className="payment-title">내 지갑</p>
      <div className="balance-container">
        <div className="balance-header">
          <div className="balance-title">
            {member.nickname}의 {account.payAccountName} 지갑
            <div className="balance-amount">
              <p className="balance-amount-money">
                {formatBalance(account.balance)}
              </p>
              <p className="balance-amount-won">원</p>
            </div>
          </div>
          <img src={wallet} className="payment-image" />
        </div>
        <div className="button-container">
          <button className="recharge-button" onClick={openRechargeModal}>
            충전
          </button>
          <button className="send-button" onClick={() => navigate("send")}>
            송금
          </button>
        </div>
      </div>
      <MyTransactionList />
      {isModalOpen && <RechargeModal closeModal={closeRechargeModal} />}
    </div>
  );
}

export default MyPayment;
