import "./SendForm.css";
import BackButton from "../common/BackButton";
import { useState } from "react";
import "./RechargeModal.css";

function SendForm() {
  const [amount, setAmount] = useState(0);

  const handleKeypadInput = (value) => {
    if (amount*10 + value <= 59000) {
      setAmount((prevAmount) => parseInt(`${prevAmount}${value}`));
    } else {
      alert("응~ 잔액초과야 ㅋ");
      window.location.reload();
    }
  };

  const handleBackspace = () => {
    setAmount((prevAmount) => Math.floor(prevAmount / 10));
  };

  const handleClear = () => {
    setAmount(0);
  };

  const sendMoney = (e) => {
    e.preventDefault();
    console.log("오 ㅋㅋ 이체눌렀농");
  };

  return (
    <div className="sendform-container">
      <div className="sendform-header">
        <BackButton />
        <p>송금하기</p>
      </div>
      <div className="send-form">
        <p className="send-to-who">김해수님에게</p>
        <p className={`send-to-howmuch ${amount !== 0 ? "-enter" : ""}`}>
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
      <button className="send-button" onClick={sendMoney}>
        이체
      </button>
    </div>
  );
}

export default SendForm;
