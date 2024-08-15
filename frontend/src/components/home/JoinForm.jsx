import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./JoinForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";
import JoinFormModal from "./JoinFormModal";
import JoinFormModalS from "./JoinFormModalS";

function JoinForm() {
  const navigate = useNavigate(); // 수정: navigation -> navigate

  const [code, setCode] = useState("");

  const handleCode = (e) => {
    setCode(e.target.value);
  };

  const joinMeeting = async (e) => {
    e.preventDefault();
    const codeData = { code };

    try {
      const response = await axiosInstance.post(
        "/teams/join-requests",
        codeData
      );
      if (response.status === 200) {
        // 요청이 성공적으로 완료된 경우
        setJoinModalOpen(true);
      } else {
        setRequestModalOpen(true);
      }
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
      setRequestModalOpen(true); // 오류가 발생한 경우 모달 열기
    }
  };

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const handleModalClose = () => {
    setJoinModalOpen(false);
  };

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
              value={code}
            />
          </div>
        </div>
        <Button type={"purple"} onClick={joinMeeting}>
          참여
        </Button>
      </div>
      <JoinFormModalS
        modalOpen={requestModalOpen}
        content={"존재하지 않는 참여코드 입니다"}
        onClose={handleRequestModalClose}
      />
      <JoinFormModal
        modalOpen={joinModalOpen}
        content={"참여신청을 완료했습니다"}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default JoinForm;
