import { useEffect } from "react";
import Close from "../../assets/icons/common/close.png";
import "./AppealModal.css";
import axiosInstance from "../../utils/axiosInstance";

function AppealModal({ onClose, teamId, planId }) {
  const onConfirm = () => {
    // 이의 신청 요청 보내기
    // TODO : request 담기
    const deleteAppeal = async () => {
      const response = await axiosInstance.delete(
        `/teams/${teamId}/plans/${planId}/payments/approvals`
      );

      console.log(response.data);
    };

    deleteAppeal();
  };

  return (
    <div className="appeal-modal-overlay">
      <div className="appeal-modal-content">
        <div>어떤 문제가 있나요 ?</div>
        <img src={Close} className="appeal-modal-close" onClick={onClose}></img>
        <input type="text" />
        <button className="appeal-modal-confirm" onClick={onConfirm}>
          이의 신청하기
        </button>
      </div>
    </div>
  );
}

export default AppealModal;
