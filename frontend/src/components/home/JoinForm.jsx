import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./JoinForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";
import JoinFormModal from "./JoinFormModal";

function JoinForm() {
  const navigation = useNavigate();

  const [code, setCode] = useState("");

  const handleCode = (e) => {
    setCode(e.target.value);
  };

  const joinMeeting = async (e) => {
    e.preventDefault();
    // 요청 파라미터 값 생성
    const codeData = {};
    // code 갱신
    codeData["code"] = code;
    console.log(codeData);

    // 참여 요청 axios
    try {
      const response = await axiosInstance.post(
        "/teams/join-requests",
        codeData
      );
      console.log(response);
      // console.log(response)
      if (response) {
        setRequestModalOpen(true);
      } else {
        setJoinModalOpen(true);
      }
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };

  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleModalClose = () => {
    setJoinModalOpen(false);
  };

  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const handleRequestModalClose = () => {
    setRequestModalOpen(false);
  };

  return (
    <div className="join-form-container">
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
        </div>
        <Button type={"purple"} onClick={joinMeeting}>
          참여
        </Button>
      </div>
      <JoinFormModal
        joinModalOpen={joinModalOpen}
        content={"존재하지 않는 참여코드 입니다"}
        onClose={handleModalClose}
      />
      <JoinFormModal
        joinModalOpen={requestModalOpen}
        content={"참여신청을 완료했습니다"}
        onClose={handleRequestModalClose}
      />
    </div>
  );
}

export default JoinForm;
