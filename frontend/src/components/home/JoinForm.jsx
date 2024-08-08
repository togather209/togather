import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./JoinForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";

function JoinForm() {
  const navigation = useNavigate()


  const [code , setCode] = useState("")

  const handleCode = (e) => {
    setCode(e.target.value)
  }

  const joinMeeting = async (e) => {
    e.preventDefault()
    // 요청 파라미터 값 생성
    const codeData = {}
    // code 갱신
    codeData["code"] = code
    console.log(codeData)
    
    // axios요청
    try {
      const response = await axiosInstance.post("/teams/join-requests", codeData);
      // console.log(response)
      if (response) {
        navigation("/home")
      }
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };



  return (
    <div>
      <BackButton />
      <div className="joinform">
        <div className="joinform-header">
          <p className="joinform-desc">모임의 참여코드를 입력해주세요</p>
            <div className="join-code">
              <input
                className="join-input"
                type="text"
                placeholder="참여코드 6자"
                onChange={handleCode}
              />
            </div>
            <Button type={"purple"} onClick={joinMeeting}>참여</Button>
        </div>
      </div>
    </div>
  );
}

export default JoinForm;
