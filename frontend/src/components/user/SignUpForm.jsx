import React, { useState, useEffect } from "react";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import SubmitButton from "./SubmitButton";
import CommonInput from "../common/CommonInput";
import BackButton from "../common/BackButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 아이콘 추가

function SignUpForm() {
  const API_LINK = import.meta.env.VITE_API_URL;

  const [profileImage, setProfileImage] = useState(null); //프로필 이미지
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [email, setEmail] = useState(""); //이메일
  const [emailMessage, setEmailMessage] = useState(""); //이메일 메시지
  const [password, setPassword] = useState(""); //비밀번호
  const [validPassword, setValidPassword] = useState(""); //비밀번호 확인
  const [nickname, setNickname] = useState(""); //닉네임
  const [passwordMessage, setPasswordMessage] = useState(""); //비밀번호 메세지
  const [certificationClick, setCertificationClick] = useState(false); //인증버튼 클릭
  const [inputCode, setInputCode] = useState(""); //인증 코드
  const [certificationComplete, setCertificaionComplete] = useState(false); //인증 정보 확인
  const [timer, setTimer] = useState(300); // 300초 = 5분
  const [timerActive, setTimerActive] = useState(false); //시간 재기 시작!
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 가시성 상태
  const [validPasswordVisible, setValidPasswordVisible] = useState(false); // 비밀번호 확인 가시성 상태
  const [nicknameMessage, setNicknameMessage] = useState(""); //닉네임 메시지
  const navigate = useNavigate();

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
      // 타이머가 끝나면 추가로 수행할 작업
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

  //회원가입 제출 폼
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
    memberData.append("image", profileImage);

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

      console.log("회원가입 성공!", response.data);
      navigate("/login");
    } catch (error) {
      console.log("회원 가입 오류", error);
    }
  };

  //이메일 인증 버튼 클릭시
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
      // 이메일 코드 전송...
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
      setTimer(300); // 타이머를 5분으로 설정
      setTimerActive(true); // 타이머 시작

      console.log("이메일 인증 메일 전송 성공", response);
    } catch (error) {
      console.log("이메일 인증 메일 전송 오류", error);
    }
  };

  //비밀번호 유효성 검사
  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSpecialChar;
  };

  //닉네임 유효성 검사
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    return nicknameRegex.test(nickname);
  };

  //이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = async () => {
    //이메일 없으면 메세지 없앤다.
    if (email.length === 0) {
      setEmailMessage("");
      return;
    }

    //유효성 검사 탈락이면?
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
          //true이면
          setEmailMessage("중복된 이메일 입니다.");
        } else {
          setEmailMessage("");
        }
      } catch (error) {
        console.log("error");
      }
    }
  };

  //값 변경하는 메서드
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  //focus해제 됐을 때, 유효성 검사 실시
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
        console.log("에러 발생");
      }
    }
  };

  //비밀번호 확인 입력할 때 ...
  const handleValidPasswordChange = (e) => {
    setValidPassword(e.target.value);
  };

  //비밀번호 확인 focus 떼면 수행
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

  //이미지 첨부하는 함수
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(profileImage));
    }
  };

  // 인증번호 비교하기
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
      // 인증 성공시...
      setCertificaionComplete(true);
      console.log("이메일 인증 성공!");

      // 타이머와 입력 창 닫기
      setTimerActive(false);
      setCertificationClick(false);
    } catch (error) {
      console.log("인증번호가 일치하지 않습니다.", error);
    }
  };

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
                  src={profileImagePreview}
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
              onBlur={handleEmailBlur}
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
              <div className="certification-timer">
                남은 시간: {formatTime(timer)}
              </div>
            </div>
          ) : (
            ""
          )}
          {certificationComplete ? <div>인증 완료되었습니다.</div> : ""}
          <div className="password-container">
            <CommonInput
              id="password"
              type={passwordVisible ? "text" : "password"} // 비밀번호 가시성에 따라 타입 변경
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur} // 포커스가 해제될 때 유효성 검사
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
              type={validPasswordVisible ? "text" : "password"} // 비밀번호 확인 가시성에 따라 타입 변경
              placeholder="비밀번호확인"
              value={validPassword}
              onChange={handleValidPasswordChange}
              onBlur={handleValidPasswordBlur} // 포커스가 해제될 때 유효성 검사
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

          <SubmitButton type="submit" className="submit-button">
            회원가입
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

export default SignUpForm;
