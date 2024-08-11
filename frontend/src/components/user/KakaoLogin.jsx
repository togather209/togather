import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KakaoLogin() {
  const navigate = useNavigate();
  const API_LINK = import.meta.env.VITE_API_URL;
  //타입

  const code = new URL(window.location.href).searchParams.get("code");
  console.log(code);
  const codeData = {
    code: code,
  };

  useEffect(() => {
    axios
      .post(`${API_LINK}/auth/kakao`, codeData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log("에러요//", error);
      });
  }, []);

  return <div>로그인 중</div>;
}

export default KakaoLogin;
