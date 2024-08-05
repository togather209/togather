import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refreshAccessTokenAsync } from "../redux/slices/authSlice";
import { useLocation } from "react-router-dom";

// 새로고침 시 Token 재발급
const TokenRefresher = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //제외 경로 등록
    const excludedPaths = ["/login", "/signup", "/landing"];
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

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 보여줄 UI
  }

  return children;
};

export default TokenRefresher;
