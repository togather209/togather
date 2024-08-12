import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import axiosInstance from "../../utils/axiosInstance";

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

              try {
                const memberResponse = await axiosInstance.get("/members/me");
                // 이미 일반 로그인으로 가입이 되어있다면
                console.log("데이터는: ", memberResponse.data.data.type);
                if (memberResponse.data.data.type === 0) {
                  // 토큰 삭제 및 모달 상태 업데이트
                  try {
                    //로그아웃 요청 및 토큰 삭제
                    await axiosInstance.post("/members/logout");
                    await dispatch(clearToken());
                  } catch (error) {
                    console.log("에러..에러..로그아웃 에러...");
                  }
                  return;
                } else {
                  // 일반적인 로그인 후 리다이렉트 처리
                  navigate("/home");
                }
              } catch (error) {
                console.log("못받아옴", error);
              }
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
