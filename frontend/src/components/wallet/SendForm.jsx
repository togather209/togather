import "./SendForm.css";
import BackButton from "../common/BackButton";
import { useState } from "react";

function SendForm() {
  const [amount, setAmount] = useState(0);
  const [password, setPassword] = useState([]);
  const [passwordModal, setPasswordModal] = useState(false);

  const handleKeypadInput = (value) => {
    if (amount * 10 + value <= 59000) {
      setAmount((prevAmount) => parseInt(`${prevAmount}${value}`));
    }
    else{
      alert("잔액초과임");
      window.location.reload();
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
      setPassword((prevPassword) => [...prevPassword, value]);
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

  return (
    <div className="sendform-container">
      <div className="sendform-header">
        <BackButton />
        <p>송금하기</p>
      </div>
      <div className="send-form">
        <p className="send-to-who">김해수님에게</p>
        <p className={`send-to-howmuch${amount !== 0 ? "-enter" : ""}`}>
          {amount === 0 ? "보낼 금액" : amount.toLocaleString()}
          <span>{amount === 0 ? "" : "원"}</span>
        </p>
        <p className="money">잔액 59,000원</p>
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
