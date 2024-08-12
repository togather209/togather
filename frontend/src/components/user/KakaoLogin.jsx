import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function KakaoLogin() {
  const navigate = useNavigate();
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const code = new URL(window.location.href).searchParams.get("code");
  console.log("Extracted code:", code);

  useEffect(() => {
    console.log("useEffect is triggered"); // 이 로그가 출력되는지 확인
    const checkCode = async () => {
      if (code) {
        await axios
          .post(`${API_LINK}/auth/kakao`, { code }, {
            withCredentials: true
          })
          .then((res) => {
            console.log("Response from server:", res.data);
            if (res.data.data.isMember) {
              const { accessToken, refreshToken } = res.data.data.tokenInfo;

              dispatch(
                setToken({
                  accessToken,
                  refreshToken,
                })
              );
            } else {
              //회원가입으로 이동~(데이터 받아서)
              navigate("/signupWithKakao", {
                state: { userData: res.data.data.kakaoUserInfo },
              });
            }
          })
          .catch((error) => {
            console.error("Error during the request:", error);
          });
      } else {
        console.error("No code present in URL");
      }
    };

    checkCode();
  }, [code, navigate, API_LINK]);

  return <div>로그인 중...</div>;
}

export default KakaoLogin;
