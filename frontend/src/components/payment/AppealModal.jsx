import { useEffect, useState } from "react";
import Close from "../../assets/icons/common/close.png";
import "./AppealModal.css";
import axiosInstance from "../../utils/axiosInstance";

function AppealModal({ onClose, teamId, planId }) {
  const [inputValue, setInputValue] = useState("");

  const onConfirm = () => {
    if (inputValue.length > 0) {
      // 이의 신청 요청 보내기
      // TODO : request 담기
      const deleteAppeal = async () => {
        const response = await axiosInstance.delete(
          `/teams/${teamId}/plans/${planId}/payments/approvals`
        );

        console.log(response.data);
        navigate("/receipt");
      };
      deleteAppeal();
    }
  };

  const handleInputChange = (e) => {
    // 최대 30글자만 입력 가능하도록 제한
    if (e.target.value.length <= 30) {
      setInputValue(e.target.value);
    }
  };

  return (
    <div className="appeal-modal-overlay">
      <div className="appeal-modal-content">
        <div>어떤 문제가 있나요 ?</div>
        <img src={Close} className="appeal-modal-close" onClick={onClose}></img>
        <input
          type="text"
          placeholder="문제 작성 (최대 30자)"
          value={inputValue}
          onChange={handleInputChange}
          maxLength={30} // 추가적으로 maxLength 속성을 사용하여 안전하게 제어
        />
        <button className="appeal-modal-confirm" onClick={onConfirm}>
          이의 신청하기
        </button>
      </div>
    </div>
  );
}

export default AppealModal;
