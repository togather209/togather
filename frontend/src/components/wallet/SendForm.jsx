import "./SendForm.css";
import BackButton from "../common/BackButton";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";

function SendForm() {
  const [amount, setAmount] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordModal, setPasswordModal] = useState(false);
  const account = useSelector((state) => state.account.account);
  const [amountMessage, setAmountMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { name, memberId } = location.state; // 전달된 name과 memberId를 받아옴

  useEffect(() => {
    if (password.length >= 6) {
      sendMoney();
    }
  }, [password]);

  const handleKeypadInput = (value) => {
    if (amount * 10 + value <= account.balance) {
      setAmount((prevAmount) => parseInt(`${prevAmount}${value}`));
    } else {
      setAmountMessage("잔액 초과");
    }
  };

  const handleBackspace = () => {
    setAmount((prevAmount) => Math.floor(prevAmount / 10));
  };

  const handleClear = () => {
    setAmount(0);
  };

  const handlePasswordInput = (value) => {
    if (password.length < 6) {
      setPassword((prevAccountPassword) => prevAccountPassword + value);
    }
  };

  const handlePasswordBackspace = () => {
    setPassword((prevPassword) => prevPassword.slice(0, -1));
  };

  const handlePasswordClear = () => {
    setPassword([]);
  };

  const openPasswordModal = (e) => {
    e.preventDefault();
    setPasswordModal(true);
  };

  const closePasswordModal = (e) => {
    e.preventDefault();
    setPasswordModal(false);
  };

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance);
    return numericBalance.toLocaleString("ko-KR");
  };

    //송금하는 함수
    const sendMoney = async () => {

      if(amountMessage === "잔액 초과"){
        console.log("잔액 초과");
        return;
      }

      const formData = {
        targetMemberId: memberId,
        price: amount,
        payAccountPassword: password,
      };
  
      try {
        const sendResponse = await axiosInstance.post(
          "/pay-accounts/transfer",
          formData
        );
        console.log(sendResponse.data);
        alert("송금이 완료되었습니다.");
        navigate("/wallet");
      } catch (error) {
        console.log("송금 실패", error);
      }
    };

  return (
    <div className="sendform-container">
      <div className="sendform-header">
        <BackButton />
        <p>송금하기</p>
      </div>
      <div className="send-form">
        <p className="send-to-who">{name}님에게</p>
        <p className={`send-to-howmuch${amount !== 0 ? "-enter" : ""}`}>
          {amount === 0 ? "보낼 금액" : amount.toLocaleString()}
          <span>{amount === 0 ? "" : "원"}</span>
        </p>
        <p className="money">잔액 {formatBalance(account?.balance)}원</p>
        <p className="ammount-message">{amountMessage}</p>
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
      <button className="send-btn" onClick={openPasswordModal}>
        이체
      </button>
      {passwordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <button className="close" onClick={closePasswordModal}>
              ×
            </button>
            <p className="modal-title">비밀번호를 입력해주세요</p>
            <div className="password-display">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="dot">
                  {typeof password[index] !== "undefined" ? "●" : "○"}
                </span>
              ))}
            </div>
            <div className="keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  onClick={() => handlePasswordInput(number)}
                >
                  {number}
                </button>
              ))}
              <button onClick={handlePasswordClear} className="remove-button">
                전체 삭제
              </button>
              <button onClick={() => handlePasswordInput(0)}>0</button>
              <button onClick={handlePasswordBackspace}>←</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SendForm;
