import React, { useState } from "react";
import CommonInput from "../common/CommonInput";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import { Link } from "react-router-dom";
import kakao from "../../assets/icons/common/kakao.png";

function LoginForm(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("로그인 시도");
    // 여기서 폼 데이터를 사용할 수 있습니다.
    console.log({ email, password, rememberEmail });
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="로고" className="logo" />
        <p>일정관리부터 정산까지</p>
      </div>

      <CommonInput
        id="email"
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CommonInput
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="remember-email">
        <input
          type="checkbox"
          id="rememberEmail"
          checked={rememberEmail}
          onChange={(e) => setRememberEmail(e.target.checked)}
        />
        <label htmlFor="rememberEmail">이메일 저장</label>
      </div>
      <SubmitButton
        type="button"
        onClick={handleLogin}
        className="submit-button"
      >
        로그인
      </SubmitButton>

      <div className="signupAndSearchpassword">
        <Link to="/signup" style={{ textDecoration: "none", color: "black" }}>
          회원가입
        </Link>
        <p className="textBoundary">{" | "}</p>
        <Link
          to="/searchpassword"
          style={{ textDecoration: "none", color: "black" }}
        >
          비밀번호 찾기
        </Link>
      </div>

      <div>
        <p className="easyLogin">{"━━━━━━   간편로그인   ━━━━━━"}</p>
      </div>
      <button
        className="loginWithKakao"
        onClick={() => navigate("/loginWithKakao")}
      >
        <img
          src={kakao}
          alt="카카오"
          style={{ width: "20px", marginRight: "5px" }}
        />
        카카오 로그인
      </button>
    </div>
  );
}
export default LoginForm;
