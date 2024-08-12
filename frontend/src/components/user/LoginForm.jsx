import React, { useState } from "react";
import CommonInput from "../common/CommonInput";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";
import { Link } from "react-router-dom";
import kakao from "../../assets/icons/common/kakao.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearToken, setToken } from "../../redux/slices/authSlice";
import { useFirebase } from "../../firebaseContext";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../common/Modal";

function LoginForm() {
  const API_LINK = import.meta.env.VITE_API_URL;
  //리다이렉트 URI
  const CLIENT_ID = import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fcmToken } = useFirebase();
  const [isAlreadyRegistKakao, setIsAlreadyRegistKakao] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 시도");
    // 여기서 폼 데이터를 사용할 수 있습니다.
    console.log({ email, password, rememberEmail });
    console.log(API_LINK);

    const memberData = {
      email: email,
      password: password,
      fcmtoken: fcmToken,
    };

    try {
      const response = await axios.post(`${API_LINK}/auth/login`, memberData, {
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true,
      });

      console.log("로그인 성공!", response.data);
      console.log(memberData);

      //토큰 가져오기
      const { accessToken, refreshToken } = response.data.data;

      dispatch(
        setToken({
          accessToken,
          refreshToken,
        })
      );

      try {
        const memberResponse = await axiosInstance.get("/members/me");

        //만약 카카오로 가입된 회원이라면...
        if (memberResponse.data.data.type === 1) {
          //로그아웃
          await axiosInstance.post("/members/logout");
          //토큰 초기화
          dispatch(clearToken());
          setIsAlreadyRegistKakao(true);
        }
        else {//아니면 홈으로~
          navigate("/");
        }
      } catch (error) {
        console.log("에러다에러");
      }

    } catch (error) {
      console.log("로그인 에러", error);
      alert("존재하지 않는 아이디입니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&`;
    window.location.href = kakaoAuthUrl;
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
          to="/search_password"
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
        // onClick={() => navigate("/loginWithKakao")}
        onClick={handleKakaoLogin}
      >
        <img
          src={kakao}
          alt="카카오"
          style={{ width: "20px", marginRight: "5px" }}
        />
        카카오 로그인
      </button>
      {isAlreadyRegistKakao && <Modal mainMessage={"이미 카카오로 가입된 계정입니다."} subMessage={"카카오 로그인을 이용해 주세요!"} onClose={() => navigate("/login")}/>}
    </div>
  );
}
export default LoginForm;
