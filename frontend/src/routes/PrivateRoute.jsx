import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAccessToken from '../utils/useAccessToken';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { localAccessToken, loading } = useAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !localAccessToken) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    }
  }, [loading, localAccessToken, navigate]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (!localAccessToken) {
    return null; // localAccessToken이 없으면 컴포넌트를 렌더링하지 않음
  }

  return <Component {...rest} accessToken={localAccessToken} />;
};

export default PrivateRoute;
