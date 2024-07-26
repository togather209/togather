import React, { useState } from 'react';
import CommonInput from '../common/CommonInput';
import SubmitButton from './SubmitButton';
import './User.css';
import '../common/CommonInput.css';
import logo from '../../assets/icons/common/logo.png';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);

  const handleLogin = () => {
    console.log('로그인 시도');
    // 여기서 폼 데이터를 사용할 수 있습니다.
    console.log({ email, password, rememberEmail });
  };

  return (
    <div className="login-container">
      <img src={logo} alt="로고" className="logo" />
      <CommonInput
        id="email"
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CommonInput
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="remember-email">
        <input
          type="checkbox"
          id="rememberEmail"
          checked={rememberEmail}
          onChange={(e) => setRememberEmail(e.target.checked)}
        />
        <label htmlFor="rememberEmail">이메일 저장</label>
      </div>
      <SubmitButton
        type="button"
        onClick={handleLogin}
        className="submit-button"
      >
        로그인
      </SubmitButton>

      <div className='signupAndSearchpassword'>
        ㅁㅁㅁ
      </div>
    </div>
  );
};

export default LoginForm;
