import React, { useState } from "react";
import "./RechargeModal.css";
import bank from "../../assets/icons/common/kb.png";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { setAccount } from "../../redux/slices/accountSlice";
import { useNavigate } from "react-router-dom";

function RechargeModal({ closeModal }) {
  const [amount, setAmount] = useState(0);
  const account = useSelector((state) => state.account.account);
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
    if(amount === 0){
      return;
    }

    //충전 금액
    const rechargeData = {
      price: amount,
    };

    try {
      await axiosInstance.post("/pay-accounts/recharge", rechargeData).then((res) => {
        console.log(res.data);
        alert("충전이 완료 되었습니다.");
        navigate("/wallet");
      });
    } catch (error) {
      alert("잔액이 부족합니다. 연동 계좌 잔액을 확인해주세요.");
      closeModal();
    }
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
        <button className="confirm-button" onClick={handlerRechargePay}>
          충전
        </button>
      </div>
    </div>
  );
}

export default RechargeModal;
