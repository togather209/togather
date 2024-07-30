import React, { useState } from "react";
import "./CreatePayment.css";
import BackButton from "../../components/common/BackButton";

const CreatePayment = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="payment-container">
      <header className="back">
        <BackButton />
      </header>
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>{step === 1 ? 1 : ''}</div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>{step === 2 ? 2 : ''}</div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>{step === 3 ? 3 : ''}</div>
      </div>

      {step === 1 && (
        <div className="step-container">
          <h2>Pay 계좌 생성</h2>
          <p>계좌 정보를 입력해주세요.</p>
          <input type="text" placeholder="계좌 발칭" />
          <input type="password" placeholder="pay 비밀번호 설정" />
          <button onClick={nextStep}>다음</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h2>Pay 계좌 인증</h2>
          <p>연동 계좌와 나의 정보를 입력해주세요.</p>
          <input type="text" placeholder="나의 연동 계좌 번호" />
          <input type="text" placeholder="은행" />
          <input type="text" placeholder="실명" />
          <input type="date" placeholder="생년월일" />
          <input type="password" placeholder="연동 계좌 비밀번호" />
          <button onClick={prevStep}>이전</button>
          <button onClick={nextStep}>인증</button>
        </div>
      )}

      {step === 3 && (
        <div className="step-container">
          <h2>휴대폰 인증</h2>
          <p>휴대폰 번호를 입력해 인증해주세요.</p>
          <input type="text" placeholder="휴대전화" />
          <button onClick={prevStep}>이전</button>
          <button onClick={() => alert("완료되었습니다.")}>완료</button>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;
