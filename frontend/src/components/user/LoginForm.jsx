import React, { useState } from "react";
import CommonInput from "../common/CommonInput";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import { Link } from "react-router-dom";
import kakao from "../../assets/icons/common/kakao.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { setToken } from "../../redux/slices/authSlice";

function LoginForm() {
  const API_LINK = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 시도");
    // 여기서 폼 데이터를 사용할 수 있습니다.
    console.log({ email, password, rememberEmail });

    const memberData = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${API_LINK}/auth/login`, memberData, {
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true,
      });

      console.log("로그인 성공!", response.data);

      //토큰 가져오기
      const { accessToken, refreshToken } = response.data.data;

      dispatch(
        setToken({
          accessToken,
          refreshToken,
        })
      );

      navigate("/");
    } catch (error) {
      console.log("로그인 에러", error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="로고" className="login-logo" />
        <p>일정관리부터 정산까지</p>
      </div>
      <form onSubmit={handleLogin}>
        <CommonInput
          id="email"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CommonInput
          id="password"
          type="password"
          placeholder="비밀번호"
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
        <SubmitButton type="submit" className="submit-button">
          로그인
        </SubmitButton>
      </form>

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
        <p className="easy-login">{"━━━━━━   간편로그인   ━━━━━━"}</p>
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
