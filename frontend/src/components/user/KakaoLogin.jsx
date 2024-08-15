import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { useFirebase } from "../../firebaseContext";

function KakaoLogin() {
  const navigate = useNavigate();
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [isAlreadyRegist, setIsAlreadyRegist] = useState(false);
  const token = useSelector((state) => state.auth.accessToken);
  const { fcmToken } = useFirebase();
  const [fcmTokenReady, setFcmTokenReady] = useState(false);

  const code = new URL(window.location.href).searchParams.get("code");
  console.log("Extracted code:", code);

  // FCM 토큰이 초기화되었는지 여부를 감지
  useEffect(() => {
    if (fcmToken) {
      console.log("FCM 토큰 준비 완료:", fcmToken);
      setFcmTokenReady(true);
    }
  }, [fcmToken]);

  useEffect(() => {
    const checkCode = async () => {
      if (code && fcmTokenReady) {
        console.log("axios 내부!!! : " + fcmToken);
        try {
          const res = await axios.post(
            `${API_LINK}/auth/kakao`,
            { code, fcmToken },
            {
              withCredentials: true,
            }
          );

          console.log("Response from server:", res.data);

          if (res.data.data.isMember) {
            const { accessToken, refreshToken } = res.data.data.tokenInfo;

            dispatch(
              setToken({
                accessToken,
                refreshToken,
              })
            );

            navigate("/home");
          } else {
            // 회원가입으로 이동
            navigate("/signupWithKakao", {
              state: { userData: res.data.data.kakaoUserInfo },
            });
          }
        } catch (error) {
          if (error.response?.data?.error === "Login Method Mismatch") {
            setIsAlreadyRegist(true);
          } else {
            console.error("로그인 중 오류 발생:", error);
          }
        }
      } else if (!fcmTokenReady) {
        console.log("FCM 토큰이 아직 초기화되지 않았습니다.");
      }
    };

    if (fcmTokenReady) {
      checkCode();
    }
  }, [code, fcmTokenReady, fcmToken, navigate, API_LINK, dispatch]);

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
