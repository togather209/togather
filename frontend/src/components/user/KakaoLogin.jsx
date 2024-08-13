import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";

function KakaoLogin() {
  const navigate = useNavigate();
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [isAlreadyRegist, setIsAlreadyRegist] = useState(false);
  const token = useSelector((state) => state.auth.accessToken);

  const code = new URL(window.location.href).searchParams.get("code");
  console.log("Extracted code:", code);

  useEffect(() => {
    console.log("useEffect is triggered"); // 이 로그가 출력되는지 확인
    const checkCode = async () => {
      if (code) {
        await axios
          .post(
            `${API_LINK}/auth/kakao`,
            { code },
            {
              withCredentials: true,
            }
          )
          .then(async (res) => {
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
              // 회원가입으로 이동
              navigate("/signupWithKakao", {
                state: { userData: res.data.data.kakaoUserInfo },
              });
            }
          })
          //이미 가입된 회원이라면
          .catch((error) => {
            if(error.response.data.error === "Login Method Mismatch"){
              setIsAlreadyRegist(true);
            }
          });
      } else {
        console.error("No code present in URL");
      }
    };

    checkCode();
  }, [code, navigate, API_LINK, dispatch]);

  // 모달이 닫힐 때 리다이렉션하도록 설정
  const handleCloseModal = () => {
    navigate("/login");
  };

  return (
    <div>
      {isAlreadyRegist && (
        <Modal
          mainMessage={"이미 가입 되어있습니다."}
          subMessage={"일반 로그인을 이용해주세요."}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default KakaoLogin;
