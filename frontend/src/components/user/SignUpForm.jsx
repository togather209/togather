import React, { useState, useEffect, useRef } from "react";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import Close from "../../assets/user/close.png";
import SubmitButton from "./SubmitButton";
import CommonInput from "../common/CommonInput";
import BackButton from "../common/BackButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "../common/Modal";
import DefaultProfileImage from "./DefaultProfileImage";

function SignUpForm() {
  const API_LINK = import.meta.env.VITE_API_URL;
  const [isImageBig, setIsImageBig] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [certificationClick, setCertificationClick] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [certificationComplete, setCertificaionComplete] = useState(false);
  const [timer, setTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validPasswordVisible, setValidPasswordVisible] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [signupOk, setSignupOk] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [defaultProfileImageUrl, setDefaultProfileImageUrl] = useState(null); // Default 이미지 URL 저장

  const navigate = useNavigate();

  const colorPairs = [
    { background: "#FFD700", text: "#B8860B" },
    { background: "#FF8C00", text: "#D2691E" },
    { background: "#FF6347", text: "#CD5C5C" },
    { background: "#4682B4", text: "#1C1C72" },
    { background: "#32CD32", text: "#228B22" },
    { background: "#BA55D3", text: "#8A2BE2" },
    { background: "#FF69B4", text: "#FF1493" },
    { background: "#8A2BE2", text: "#4B0082" },
    { background: "#00CED1", text: "#008B8B" },
    { background: "#FF4500", text: "#B22222" },
    { background: "#2E8B57", text: "#006400" },
    { background: "#DAA520", text: "#B8860B" },
  ];

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(interval);
      setTimerActive(false);
      alert("인증 시간이 만료되었습니다. 다시 인증해주세요.");
      setCertificationClick(false);
    }

    return () => clearInterval(interval);
  }, [timer, timerActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!certificationComplete) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      alert("비밀번호는 8자~20자 사이로 입력해주세요.");
      return;
    }

    if (password !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      alert("비밀번호와 비밀번호 확인이 같아야 합니다.");
      return;
    }

    if (!validatePassword(password)) {
      alert("비밀번호는 영문, 특수문자, 숫자를 포함해야 합니다.");
      return;
    }

    const memberData = new FormData();
    memberData.append(
      "member",
      new Blob([JSON.stringify({ email, password, nickname })], {
        type: "application/json",
      })
    );

    if (profileImage) {
      const fileBlob = new Blob([profileImage], { type: "image/png" });
      const fileData = new File([fileBlob], "image.png");
      memberData.append("image", fileData);
    } else if (defaultProfileImageUrl) {
      const fileBlob = await (await fetch(defaultProfileImageUrl)).blob();
      const fileData = new File([fileBlob], "default_profile.png", {
        type: "image/png",
      });
      memberData.append("image", fileData);
    }

    if (email === "" || password === "" || nickname === "") {
      return;
    } else {
      console.log(memberData);
    }

    try {
      const response = await axios.post(
        `${API_LINK}/auth/register`,
        memberData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSignupOk(true);
    } catch (error) {
      console.log("회원 가입 오류", error);
    }
  };

  const emailCertification = async (e) => {
    e.preventDefault();

    if (certificationComplete) {
      console.log("이미 이메일 인증을 완료했습니다.");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    const emailData = {
      email: email,
    };

    try {
      const response = await axios.post(
        `${API_LINK}/auth/verification-codes`,
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCertificationClick(true);
      setTimer(300);
      setTimerActive(true);
      console.log("이메일 인증 메일 전송 성공", response);
    } catch (error) {
      console.log("이메일 인증 메일 전송 오류", error);
    }
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSpecialChar;
  };

  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    return nicknameRegex.test(nickname);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = async () => {
    if (email.length === 0) {
      setEmailMessage("");
      return;
    }

    if (!validateEmail(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
    } else {
      const emailData = {
        email: email,
      };

      try {
        const response = await axios.post(
          `${API_LINK}/auth/email/duplicate-check`,
          emailData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data) {
          setEmailMessage("중복된 이메일 입니다.");
        } else {
          setEmailMessage("");
        }
      } catch (error) {
        console.log("error");
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    if (password.length === 0) {
      setPasswordMessage("");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
      );
    } else if (password !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

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
        console.log("에러 발생");
      }
    }
  };

  const handleValidPasswordChange = (e) => {
    setValidPassword(e.target.value);
  };

  const handleValidPasswordBlur = () => {
    if (!validatePassword(validPassword)) {
      setPasswordMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
      );
    } else if (validPassword !== password) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleImageChange = (e) => {
    if (
      e.target.files &&
      e.target.files[0] &&
      e.target.files[0].size <= 1048576
    ) {
      const file = e.target.files[0];

      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setIsImageBig(true);
    }
  };

  const certificationCode = async (e) => {
    e.preventDefault();

    const emailCodeForm = {
      email: email,
      inputCode: inputCode,
    };

    try {
      await axios.post(
        `${API_LINK}/auth/verification-codes/check`,
        emailCodeForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCertificaionComplete(true);
      console.log("이메일 인증 성공!");

      setTimerActive(false);
      setCertificationClick(false);
    } catch (error) {
      console.log("인증번호가 일치하지 않습니다.", error);
    }
  };

  const deleteImage = (e) => {
    e.preventDefault();
    setProfileImage(null);
    setProfileImagePreview("");
  };

  return (
    <div className="signup-box">
      <div className="signup-back-button">
        <BackButton />
      </div>
      <div className="signup-container">
        <div className="logo-container">
          <img src={logo} alt="로고" className="signup-logo" />
          <p>일정관리부터 정산까지</p>
        </div>
        <form>
          <div className="profile-image-upload">
            <label htmlFor="profileImageUpload" className="image-upload-label">
              {profileImagePreview ? (
                <>
                  <img
                    src={Close}
                    alt=""
                    className="image-close-button"
                    onClick={deleteImage}
                  />
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="profile-image"
                  />
                </>
              ) : (
                <div className="placeholder-image">+</div>
              )}
            </label>
            <input
              type="file"
              id="profileImageUpload"
              className="image-upload-input"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          {!profileImage && (
            <DefaultProfileImage
              nickname={nickname}
              colorPairs={colorPairs}
              onGenerate={setDefaultProfileImageUrl}
            />
          )}
          <div className="emailForm">
            <label
              htmlFor="email"
              className={`input-label ${isFocused ? "focused" : ""}`}
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              className="email-input"
            />
            <button
              className="email-certification"
              onClick={emailCertification}
            >
              인증
            </button>
          </div>

          {/* 이메일 유효성 검사 */}
          {emailMessage && (
            <p
              className={
                emailMessage === "올바른 이메일 형식이 아닙니다."
                  ? "invalid-email"
                  : "duplicated-email"
              }
            >
              {emailMessage}
            </p>
          )}
          {certificationClick && !certificationComplete ? (
            <div>
              <div className="certification">
                <input
                  id="certification"
                  type="text"
                  placeholder="인증코드를 입력하세요."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="certification-input"
                />
                <button
                  type="submit"
                  className="certification-button"
                  onClick={certificationCode}
                >
                  확인
                </button>
              </div>
              <div
                className={`certification-timer ${
                  timer < 60 ? "timer-warning" : ""
                }`}
              >
                남은 시간: {formatTime(timer)}
              </div>
            </div>
          ) : (
            ""
          )}
          {certificationComplete ? (
            <div className="complete-certification">인증 완료되었습니다.</div>
          ) : (
            ""
          )}
          <div className="password-container">
            <CommonInput
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className="password-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="password-container">
            <CommonInput
              id="validPassword"
              type={validPasswordVisible ? "text" : "password"}
              placeholder="비밀번호확인"
              value={validPassword}
              onChange={handleValidPasswordChange}
              onBlur={handleValidPasswordBlur}
            />
          </div>
          {passwordMessage && (
            <p
              className={
                passwordMessage === "비밀번호가 일치합니다."
                  ? "valid-password"
                  : "invalid-password"
              }
            >
              {passwordMessage}
            </p>
          )}
          <div className="nickname-form">
            <CommonInput
              id="nickname"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleNicknameBlur}
            />
          </div>
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

          <SubmitButton
            type="button"
            onClick={handleSignup}
            className="submit-button"
          >
            회원가입
          </SubmitButton>
        </form>
      </div>
      {isImageBig && (
        <Modal
          mainMessage={"사진 용량 초과!"}
          subMessage={"1MB이하의 크기만 첨부 가능합니다."}
          onClose={() => setIsImageBig(false)}
        />
      )}
      {signupOk && (
        <Modal
          mainMessage={"회원가입을 환영합니다!"}
          subMessage={"Togather를 이용하러 가볼까요?"}
          onClose={() => navigate("/login")}
        />
      )}
    </div>
  );
}

export default SignUpForm;
