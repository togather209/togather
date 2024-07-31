import React, { useState } from "react";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import SubmitButton from "./SubmitButton";
import CommonInput from "../common/CommonInput";
import BackButton from "../common/BackButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const API_LINK = "http://localhost:8080/";

  const [profileImage, setProfileImage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [certificationClick, setCertificationClick] = useState(false);
  const [certification, setCertification] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      alert("비밀번호와 비밀번호확인이 같아야합니다.");
      window.location.reload();
      return;
    }

    const memberData = {
      email,
      password,
      nickname,
    };

    if(email === '' || password === '' || nickname === ''){
      return;
    }
    else {
      console.log(memberData);
    }

    try {
      const response = await axios.post(`${API_LINK}api/auth/`, memberData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("회원가입 성공!", response.data);
      navigate('/login');
    } catch (error) {
      console.log("회원 가입 오류", error);
    }
  };

  const emailCertification = (e) => {
    e.preventDefault();
    console.log("인증하실래용?");
    setCertificationClick(!certificationClick);
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSpecialChar;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (!newPassword) {
      setPasswordMessage("");
    } else if (!validatePassword(newPassword)) {
      setPasswordMessage("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
    } else if (newPassword !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleValidPasswordChange = (e) => {
    const newValidPassword = e.target.value;
    setValidPassword(newValidPassword);

    if (!newValidPassword) {
      setPasswordMessage("");
    } else if (!validatePassword(newValidPassword)) {
      setPasswordMessage("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
    } else if (newValidPassword !== password) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const nicknameCertification = (e) => {
    e.preventDefault();
    console.log("기다려봐.");
  }

  return (
    <>
      <div className="signup-back-button">
        <BackButton />
      </div>
      <div className="signup-container">
        <div className="logo-container">
          <img src={logo} alt="로고" className="signup-logo" />
          <p>일정관리부터 정산까지</p>
        </div>
        <form onSubmit={handleSignup}>
          <div className="profile-image-upload">
            <label htmlFor="profileImageUpload" className="image-upload-label">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />
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
          <div className="emailForm">
            <CommonInput
              id="email"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="email-certification"
              onClick={emailCertification}
            >
              인증
            </button>
          </div>
          {certificationClick ? (
            <div>
              <div className="certification">
                <input
                  id="certification"
                  type="text"
                  placeholder="인증코드를 입력하세요."
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="certification-input"
                />
                <button className="certification-button">확인</button>
              </div>
            </div>
          ) : (
            ""
          )}
          <CommonInput
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          <CommonInput
            id="validPassword"
            type="password"
            placeholder="비밀번호확인"
            value={validPassword}
            onChange={handleValidPasswordChange}
          />
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
              id="nickName"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              className="nickname-certification-button"
              onClick={nicknameCertification}
            >
              확인
            </button>
          </div>
          <SubmitButton type="submit" className="submit-button">
            회원가입
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

export default SignUpForm;
