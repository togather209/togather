import React, { useState } from "react";
import "./CreatePayment.css";
import CommonInput from "../common/CommonInput";
import BackButton from "../../components/common/BackButton";
import CustomSelect from "../common/CustomSelect";
import kbbank from "../../assets/bank/국민은행.png";
import shinhan from "../../assets/bank/신한은행.png";
import hana from "../../assets/bank/하나은행.png";
import woori from "../../assets/bank/우리은행.png";
import nh from "../../assets/bank/농협은행.png";
import citi from "../../assets/bank/한국씨티은행.png";
import sc from "../../assets/bank/SC제일은행.png";
import ibk from "../../assets/bank/기업은행.png";
import kdb from "../../assets/bank/산업은행.png";

function CreatePayment() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [bank, setBank] = useState("");
  const [memberName, setMemberName] = useState("");
  const [birth, setBirth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState(""); // Temporary password state for the modal

  const bankOptions = [
    { value: "0", label: "국민은행", image: kbbank },
    { value: "1", label: "신한은행", image: shinhan },
    { value: "2", label: "하나은행", image: hana },
    { value: "3", label: "우리은행", image: woori },
    { value: "4", label: "농협은행", image: nh },
    { value: "5", label: "한국씨티은행", image: citi },
    { value: "6", label: "SC제일은행", image: sc },
    { value: "7", label: "기업은행", image: ibk },
    { value: "8", label: "산업은행", image: kdb },
  ];

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // 숫자만 허용
      setTempPassword(value);
    }
  };

  const handlePasswordConfirm = () => {
    setPassword(tempPassword);
    setIsModalOpen(false);
  };

  //인증 누를 시!
  const userVerification = () => {

    //사용자 연동 계좌 정보
    const userPayData = {
      accountNum: accountNum,
      bank: bank,
      memberName: memberName,
      birth: birth,
    }

    console.log(userPayData);

  }

  return (
    <div className="payment-container">
      <header className="header">
        <BackButton />
      </header>
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2</div>
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
            placeholder="Pay 비밀번호 설정 (6자리)"
            value={password}
            onClick={() => {
              setTempPassword(password);
              setIsModalOpen(true);
            }}
            onChange={() => {}} // Add a dummy onChange handler to prevent warning
            readOnly // Make input read-only to prevent manual typing
          />
          <button onClick={nextStep}>다음</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h2>Pay 계좌 인증</h2>
          <p>연동 계좌와 나의 정보를 입력해주세요.</p>
          <CommonInput
            id="accountNum"
            type="text"
            placeholder="나의 연동 계좌 정보"
            value={accountNum}
            onChange={(e) => setAccountNum(e.target.value)}
          />

          <CustomSelect
            id="bank"
            placeholder="은행 선택"
            value={bank}
            onChange={(value) => setBank(value)}
            options={bankOptions}
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
            type="date"
            placeholder="생년월일"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
          <div className="btn">
            <button onClick={prevStep}>이전</button>
            <button onClick={userVerification}>인증</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>비밀번호 설정</h2>
            <input
              type="password"
              value={tempPassword}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              maxLength={6}
            />
            <button onClick={handlePasswordConfirm}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePayment;
