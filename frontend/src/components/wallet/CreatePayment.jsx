import React, { useState } from "react";
import "./CreatePayment.css";
import CommonInput from "../common/CommonInput";
import BackButton from "../../components/common/BackButton";

function CreatePayment() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [memberName, setMemberName] = useState("");
  const [birth, setBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="payment-container">
      <header className="header">
        <BackButton />
      </header>
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>3</div>
      </div>

      {step === 1 && (
        <div className="step-container">
          <h2>Pay 계좌 생성</h2>
          <p>계좌 정보를 입력해주세요.</p>
          <CommonInput
            id="accountName"
            type="text"
            placeholder="계좌 별칭"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <CommonInput
            id="password"
            type="password"
            placeholder="Pay 비밀번호 설정"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={nextStep}>다음</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h2>Pay 계좌 인증</h2>
          <p>연동 계좌와 나의 정보를 입력해주세요.</p>
          <CommonInput
            id=""
            type="text"
            placeholder="나의 연동 계좌 정보"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <CommonInput
            id="bank"
            type="text"
            placeholder="은행"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          />
          <CommonInput
            id="memberName"
            type="text"
            placeholder="실명"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
          <CommonInput
            id="birth"
            type="text"
            placeholder="생년월일"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
          <div className="btn">
            <button onClick={prevStep}>이전</button>
            <button onClick={nextStep}>인증</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-container">
          <h2>휴대폰 인증</h2>
          <p>휴대폰 번호를 입력해 인증해주세요.</p>
          <CommonInput
            id="phoneNumber"
            type="text"
            placeholder="휴대폰 전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={11}
          />
          <div className="btn">
            <button onClick={prevStep}>이전</button>
            <button onClick={() => alert("완료되었습니다.")}>완료</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePayment;
