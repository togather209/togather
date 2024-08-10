import React, { useState } from "react";
import "./RechargeModal.css";
import kbbank from "../../assets/bank/국민은행.png";
import shinhan from "../../assets/bank/신한은행.png";
import hana from "../../assets/bank/하나은행.png";
import woori from "../../assets/bank/우리은행.png";
import nh from "../../assets/bank/농협은행.png";
import citi from "../../assets/bank/한국씨티은행.png";
import sc from "../../assets/bank/SC제일은행.png";
import ibk from "../../assets/bank/기업은행.png";
import kdb from "../../assets/bank/산업은행.png";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";

function RechargeModal({ closeModal }) {
  const [isCompleteRecharge, setIsCompleteRecharge] = useState(false);
  const [amount, setAmount] = useState(0);
  const linkedAccountInfo = useSelector(
    (state) => state.linkedAccount.linkedAccountInfo
  );
  const navigate = useNavigate();

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

  //충전하는 함수
  const handlerRechargePay = async () => {
    //0원은 충전할 수 없다.
    if (amount === 0) {
      return;
    }

    //충전 금액
    const rechargeData = {
      price: amount,
    };

    try {
      await axiosInstance
        .post("/pay-accounts/recharge", rechargeData)
        .then((res) => {
          console.log(res.data);
          setIsCompleteRecharge(true);
        });
    } catch (error) {
      alert("잔액이 부족합니다. 연동 계좌 잔액을 확인해주세요.");
      closeModal();
    }
  };

  let bank = "";
  let bankName = "";

  switch (linkedAccountInfo.type) {
    case 0:
      bank = kbbank;
      bankName = "국민은행";
      break;
    case 1:
      bank = shinhan;
      bankName = "신한은행";
      break;
    case 2:
      bank = hana;
      bankName = "하나은행";
      break;
    case 3:
      bank = woori;
      bankName = "우리은행";
      break;
    case 4:
      bank = nh;
      bankName = "농협은행";
      break;
    case 5:
      bank = citi;
      bankName = "한국씨티은행";
      break;
    case 6:
      bank = sc;
      bankName = "SC제일은행";
      break;
    case 7:
      bank = ibk;
      bankName = "기업은행";
      break;
    case 8:
      bank = kdb;
      bankName = "산업은행";
      break;
    default:
      break;
  }

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
            <span>
              {bankName} {linkedAccountInfo.accountNumber}
            </span>
            <span>
              <span>{linkedAccountInfo.accountName}</span> 계좌에서 충전해요.
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
        <button className="confirm-button" onClick={handlerRechargePay}>
          충전
        </button>
      </div>
      {isCompleteRecharge && <Modal mainMessage={`${amount}원 충전`} subMessage={"충전이 완료되었습니다."} onClose={() => navigate(0)}/>}
    </div>
  );
}

export default RechargeModal;
