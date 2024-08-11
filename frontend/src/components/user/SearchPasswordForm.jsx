import BackButton from "../common/BackButton";
import "./SearchPasswordForm.css";
import CommonInput from "../common/CommonInput";
import { useState } from "react";
import logo from "../../assets/icons/common/logo.png";
import SubmitButton from "./SubmitButton";
import "./User.css";
import axios from "axios";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";

function SearchPasswordForm() {
  const API_LINK = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [isEmailSendSuccess, setIsEmailSendSuccess] = useState(false);
  const navigate = useNavigate();

  //이메일 제출..
  const handlerSubmitEmail = async (e) => {
    e.preventDefault();

    const formData = {
      email: email
    }

    try {
      //임시 비밀번호 이메일로 슝~
      const response = await axios.post(`${API_LINK}/auth/password-reset`, formData);
      if(response.status === 200){
        setIsEmailSendSuccess(true);
      }
      
    } catch (error) {
      console.log("이메일 전송 실패...", error);
    }
  }

  return (
    <>
      <div className="search-password-form-top">
        <BackButton />
        <div className="search-password-form-header">
          <p>비밀번호 찾기</p>
        </div>
      </div>
      <div className="search-password-form-container">
        <div className="search-password-form-title">
          <img src={logo} alt="로고" className="search-password-form-title-img"/>
          <p className="search-password-form-title-content">이메일을 입력해 주세요.</p>
        </div>
        <CommonInput 
        id="email"
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <SubmitButton className="submit-button" onClick={handlerSubmitEmail}> 비밀번호 찾기 </SubmitButton>
      </div>

      {isEmailSendSuccess && (
        <Modal mainMessage={"이메일 전송에 성공하였습니다!"} subMessage={"재 발급된 임시 비밀번호로 로그인해주세요."} onClose={() => navigate("/login")}/>
      )}
    </>
  );
}

export default SearchPasswordForm;
