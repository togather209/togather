import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { refreshAccessTokenAsync } from "../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";

const TokenRefresher = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {

    const excludedPaths = ["/login", "/signup", "/", "/search_password", "/oauth/kakao/callback", "/signupWithKakao"];
    if (!excludedPaths.includes(location.pathname)) {
      const tokenReload = async () => {
        await dispatch(refreshAccessTokenAsync()).unwrap();
        setLoading(false);
      };
      tokenReload();
    } else {
      setLoading(false); // 제외된 경로에서는 로딩을 바로 끝냄
    }
  }, [dispatch, location.pathname]);

  // useEffect(() => {
  //   // 뒤로 가기 버튼 막기
  //   const handlePopState = (event) => {
  //     event.preventDefault();
  //     navigate(location.pathname, { replace: true });
  //   };

  //   window.history.pushState(null, '', window.location.href);
  //   window.addEventListener('popstate', handlePopState);

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [navigate, location.pathname]);

  useEffect(() => {
    const restrictedPaths = ["/login", "/signup", "/", "/search_password", "/oauth/kakao/callback", "/signupWithKakao"];
    if (accessToken && restrictedPaths.includes(location.pathname)) {
      navigate("/home", { replace: true });
    }
  }, [accessToken, location.pathname, navigate]);

  if (loading) {
    return <Loading/>; // 로딩 중일 때 보여줄 UI
  }

  return children;
};

export default TokenRefresher;
