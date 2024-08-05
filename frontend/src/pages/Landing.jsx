import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Landing Page</h1>
      <button onClick={() => navigate('/login')}>서비스 이용하러 가기</button>
    </div>
  );
}

export default Landing;