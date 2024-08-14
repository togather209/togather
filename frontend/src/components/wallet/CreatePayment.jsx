import React, { useState, useEffect } from "react";
import "./CreatePayment.css";
import "./SendForm.css";
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
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccount } from "../../redux/slices/accountSlice";
import Modal from "../common/Modal";

function CreatePayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [bank, setBank] = useState("");
  const [memberName, setMemberName] = useState("");
  const [birth, setBirth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [passwordModal, setPasswordModal] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  //인증 되었다.
  const [isVerification, setIsVerification] = useState(false);
  //비밀번호 모달열기
  const [isAuthenticationSuccess, setIsAuthenticationsSuccess] =
    useState(false);
  //페이생성 모달
  const [completeCreatePay, setCompleteCreatePay] = useState(false);

  useEffect(() => {
    //6자리가되는 순간!
    if (accountPassword.length >= 6) {
      //인증
      userVerification();
    }
  }, [accountPassword]);

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
    if (/^\d*$/.test(value)) {
      // 숫자만 허용
      setTempPassword(value);
    }
  };

  const handleBirthChange = (e) => {
    let value = e.target.value;
    //숫자 제거
    value = value.replace(/\D/g, "");

    if (value.length >= 8) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      //형식 지정해서 변경하기
      setBirth(`${year}-${month}-${day}`);
    } else {
      setBirth(value);
    }
  };

  const handlePasswordConfirm = () => {
    setPassword(tempPassword);
    setIsModalOpen(false);
  };

  const handlePasswordInput = (value) => {
    if (accountPassword.length < 6) {
      setAccountPassword((prevAccountPassword) => prevAccountPassword + value);
    }
  };

  const handlePasswordBackspace = () => {
    setAccountPassword((prevAccountPassword) =>
      prevAccountPassword.slice(0, -1)
    );
  };

  const handlePasswordClear = () => {
    setAccountPassword("");
  };

  const openPasswordModal = (e) => {
    e.preventDefault();
    setPasswordModal(true);
  };

  const closePasswordModal = (e) => {
    e.preventDefault();
    setPasswordModal(false);
  };

  //인증 누를 시!
  const userVerification = async () => {
    //사용자 연동 계좌 정보
    const userPayData = {
      accountNumber: accountNum,
      type: bank,
      memberName: memberName,
      birth: birth,
      password: accountPassword,
    };

    try {
      const userPayDataResponse = await axiosInstance.post(
        "/accounts/verify",
        userPayData
      );
      console.log(userPayDataResponse.data);

      //인증 성공했으면!
      setIsVerification(true);
      //모달 닫기
      setPasswordModal(false);
      setIsAuthenticationsSuccess(true);
    } catch (error) {
      console.log("입력에 이상이 있는 것 같은데", error);
    }
  };

  //인증이 끝난 상태에서 페이계좌 생성하는거임
  const createPay = async () => {
    //칸이 비어있다면 실명으로 설정
    if (accountName === null || accountName === "") {
      setAccountName(memberName);
      console.log(accountName);
    }

    const payData = {
      accountName: accountName,
      password: password,
      accountNum: accountNum,
      memberName: memberName,
    };

    try {
      const payDataResponse = await axiosInstance.post(
        "/pay-accounts",
        payData
      );

      setCompleteCreatePay(true);
      dispatch(setAccount({ account: payDataResponse.data.data }));
      //지갑 페이지로 이동하면... 다른페이지가 뜰거다.
    } catch (error) {
      console.log("데이터 이상");
    }
  };

  return (
    <div className="payment-container">
      <header className="header">
        <BackButton />
      </header>
      <div className="progress-bar">
        <span
          className={`progress-section-number ${step === 1 ? "active" : ""} ${
            step === 2 ? "done" : ""
          }`}
        >
          <span className="progress-section-number-inner">1</span>
        </span>
        <div className={`progress-section-number ${step >= 2 ? "active" : ""}`}>
          <span className="progress-section-number-inner">2</span>
        </div>
      </div>

      {step === 1 && (
        <div className="step-container">
          <h2>Pay 계좌 생성</h2>
          <p>계좌 정보를 입력해주세요.</p>
          <CommonInput
            id="accountName"
            type="text"
            placeholder="계좌 별칭(미입력시 실명)"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            maxLength={6}
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
            placeholder="나의 연동 계좌 번호"
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
            type="text"
            placeholder="생년월일 8자리"
            value={birth}
            onChange={handleBirthChange}
          />
          <div className="btn">
            <button onClick={prevStep}>이전</button>
            {!isVerification ? (
              <button onClick={openPasswordModal}>인증</button>
            ) : (
              <button onClick={createPay}>생성</button>
            )}
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
                  {typeof accountPassword[index] !== "undefined" ? "●" : "○"}
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

      {isAuthenticationSuccess && (
        <Modal
          mainMessage={"비밀번호 인증 성공!"}
          subMessage={"연동계좌 확인이 완료되었습니다."}
          onClose={() => setIsAuthenticationsSuccess(false)}
        />
      )}

      {completeCreatePay && (
        <Modal
          mainMessage={"계좌 생성에 성공하였습니다!"}
          subMessage={`${accountName} 지갑이 생성되었습니다.`}
          onClose={() => navigate("/wallet")}
        />
      )}
    </div>
  );
}

export default CreatePayment;
