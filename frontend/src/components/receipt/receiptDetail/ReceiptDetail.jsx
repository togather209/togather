import React, { useEffect, useState } from "react";
import "./ReceiptDetail.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../common/BackButton";
import Update from "../../../assets/receipt/update.png";
import Delete from "../../../assets/receipt/delete.png";
import Button from "../../common/Button";
import axiosInstance from "../../../utils/axiosInstance";
import DeleteReceiptModal from "./DeleteReceiptModal";

function ReceiptDetail() {
  const { receiptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [receipt, setReceipts] = useState(null); // 초기 상태를 null로 설정
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { teamId, planId } = location.state || {};

  const colorMap = {
    0: "sky",
    1: "pink",
    2: "yellow",
  };

  useEffect(() => {
    if (!teamId || !planId) {
      console.error("teamId 또는 planId가 전달되지 않았습니다.");
      return;
    }

    // 영수증 상세 조회 API 요청
    const fetchReceiptDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `teams/${teamId}/plans/${planId}/receipts/${receiptId}`
        );
        setReceipts(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("영수증 상세 조회에 실패했습니다.", error);
      }
    };

    fetchReceiptDetail();
  }, []); // 의존성 배열을 빈 배열로 설정

  // 정산액 계산
  const calculateSettlements = (items) => {
    if (!items) return {};

    const settlements = {};

    items.forEach((item) => {
      const perMemberAmount = item.unitPrice / item.members.length;

      item.members.forEach((member) => {
        if (!settlements[member.nickname]) {
          settlements[member.nickname] = 0;
        }
        settlements[member.nickname] += perMemberAmount;
      });
    });

    return settlements;
  };

  const settlements = receipt ? calculateSettlements(receipt.items) : {};

  const handleUpdate = () => {
    navigate("/receipt/update-form", {
      state: { teamId: teamId, planId: planId, receiptId: receiptId },
    });
  };

  const handleDeleteModal = () => {
    console.log("영수증 삭제");
    setIsDeleteModalOpen(true); // 삭제 모달 띄우기
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `teams/${teamId}/plans/${planId}/receipts/${receiptId}`
      );
      console.log(`${receiptId}번 영수증 삭제`);
      setIsDeleteModalOpen(false);
      navigate("/receipt");
    } catch (error) {
      console.error("영수증 삭제에 실패했습니다.", error);
    }
  };

  const handleCheck = () => {
    navigate(-1, {
      state: { teamId: teamId, planId: planId, receiptId: receiptId },
    });
  };

  return (
    <>
      {receipt ? (
        <div className={`receipt-detail-container ${colorMap[receipt.color]}`}>
          <header className="receipt-header">
            <BackButton />
            <div>영수증 조회</div>
          </header>
          <div className="receipt-info">
            <hr className="detail-line" />
            <h3>{receipt.businessName}</h3>
            <hr className="detail-line" />
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>품명</th>
                  <th>수량</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.count}개</td>
                      <td>{item.unitPrice.toLocaleString()}원</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="tagged-people">
                        {item.members.map((member, idx) => (
                          <div key={idx} className="tagged-avatar"></div>
                        ))}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <hr className="detail-line" />
            <div className="receipt-detail-total">
              <span>총액</span>
              <span>{receipt.totalPrice.toLocaleString()}원</span>
            </div>
            <div className="receipt-meta">
              <p>결제자 : {receipt.managerName}</p>
              <p>결제일시 : {receipt.paymentDate}</p>
            </div>
            <div className="receipt-manage">
              <img src={Update} alt="update" onClick={handleUpdate} />
              <img src={Delete} alt="delete" onClick={handleDeleteModal} />
            </div>
          </div>
          <div className="payment-info">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>정산액</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(settlements).map((nickname, index) => (
                  <tr key={index}>
                    <td>{nickname}</td>
                    <td>{settlements[nickname].toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="receipt-detail-check">
            <Button
              className="detail-confirm-button"
              type="purple"
              onClick={handleCheck}
            >
              확인
            </Button>
          </div>
        </div>
      ) : (
        <div>로딩 중...</div>
      )}
      {isDeleteModalOpen && (
        <DeleteReceiptModal
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default ReceiptDetail;
