import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refreshAccessTokenAsync } from "../redux/slices/authSlice";

// 새로고침 시 Token 재발급
const TokenRefresher = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenReload = async () => {
      await dispatch(refreshAccessTokenAsync()).unwrap();
      setLoading(false);
    };
    tokenReload();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 보여줄 UI... 나중에 바꿔야함 듀ㅠㅠㅠ률율율ㅇ퓨퓨
  }

  return children;
};

export default TokenRefresher;
