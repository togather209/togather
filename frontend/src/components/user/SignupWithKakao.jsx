import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SignupWithKakao.css";
import CommonInput from "../common/CommonInput";
import SubmitButton from "./SubmitButton";
import "./User.css";
import axios from "axios";
import Modal from "../../components/common/Modal";

function SignupWithKakao() {
  const [signupCheck, setSignupCheck] = useState(false);
  const location = useLocation();
  const userData = { ...location.state };
  const [nickname, setNickname] = useState(userData.userData.nickname);
  const [nicknameMessage, setNicknameMessage] = useState(""); //닉네임 메시지
  const navigate = useNavigate();
  const API_LINK = import.meta.env.VITE_API_URL;

  const handlerSubmitForm = async (e) => {
    e.preventDefault();
    const dataForm = {
        email: userData.userData.email, // 이메일을 제대로 전달해야 합니다.
        nickname: nickname
    };

    const response = await axios.post(`${API_LINK}/auth/kakao/register`, dataForm);
    setSignupCheck(true);
  };

  //닉네임 유효성 검사
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    return nicknameRegex.test(nickname);
  };

  //닉네임 유효성 검사하기
  const handleNicknameBlur = async () => {
    if (nickname.length === 0) {
      setNicknameMessage("");
      return;
    }

    if (!validateNickname(nickname)) {
      setNicknameMessage(
        "닉네임은 2~15자의 영문 대/소문자, 한글(초성 제외), 숫자만 가능합니다."
      );
    } else {
      const nicknameData = {
        nickname: nickname,
      };

      try {
        const response = await axios.post(
          `${API_LINK}/auth/nickname/duplicate-check`,
          nicknameData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data) {
          setNicknameMessage("사용할 수 없는 닉네임 입니다.");
        } else {
          setNicknameMessage("사용 가능한 닉네임입니다.");
        }
      } catch (error) {
        console.error("에러 발생");
      }
    }
  };

  //처음 닉네임 중복검사
  useEffect(() => {
    handleNicknameBlur();
  }, []); 

  return (
    <div className="signup-with-kakao-container">
      <div className="signup-with-kakao-header">카카오로 가입하기</div>
      <div className="signup-with-kakao-form-container">
        <div className="signup-with-kakao-form-title">
          <p className="signup-with-kakao-form-title-content">가입 정보</p>
        </div>
        <div className="signup-with-kakao-form-input">
          <CommonInput
            id="email"
            type="email"
            placeholder="이메일"
            value={userData?.userData.email}
            onChange={() => {}}
            readonly
          />
          <CommonInput
            id="nickname"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={handleNicknameBlur}
          />
          <div className="signup-with-kakao-nickname-check">
            {nicknameMessage && (
              <p
                className={
                  nicknameMessage ===
                  "닉네임은 2~15자의 영문 대/소문자, 한글(초성 제외), 숫자만 가능합니다."
                    ? "invalid-nickname"
                    : nicknameMessage === "사용 가능한 닉네임입니다."
                    ? "valid-nickname"
                    : "duplicated-nickname"
                }
              >
                {nicknameMessage}
              </p>
            )}
          </div>
        </div>
        <SubmitButton className="submit-button" onClick={handlerSubmitForm}>
          {" "}
          가입하기{" "}
        </SubmitButton>
      </div>
      {signupCheck && (
        <Modal mainMessage={"카카오 회원가입이 완료되었습니다!"} subMessage={"Togather를 즐기러 가볼까요?"} onClose={() => navigate("/login")}/>
      )}
    </div>
  );
}

export default SignupWithKakao;
