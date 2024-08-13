import React, { useEffect, useState } from "react";
import "./ReceiptDetail.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../common/BackButton";
import Update from "../../../assets/receipt/update.png";
import Delete from "../../../assets/receipt/delete.png";
import Button from "../../common/Button";
import axiosInstance from "../../../utils/axiosInstance";
import DeleteReceiptModal from "./DeleteReceiptModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTeamPlan } from "../../../redux/slices/receiptSlice";
import ViewParticipantsModal from "./ViewParticipantsModal"; // ViewParticipantsModal 모달 컴포넌트 추가

function ReceiptDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [receipt, setReceipt] = useState(null); // 영수증 정보를 저장하는 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 열기 상태
  const [isManager, setIsManager] = useState(false); // 사용자가 관리자인지 확인하는 상태
  const [isViewParticipantsModalOpen, setIsViewParticipantsModalOpen] =
    useState(false); // 참여자 보기 모달 열기 상태
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 품목 정보를 저장하는 상태

  const { receiptId } = useParams(); // URL에서 영수증 ID를 가져옴
  let { teamId, planId } = useSelector((state) => state.receipt); // Redux 상태에서 teamId와 planId를 가져옴
  const status = location.state.status; // 이전 페이지에서 전달된 상태

  // 색상 매핑 (0: sky, 1: pink, 2: yellow)
  const colorMap = {
    0: "sky",
    1: "pink",
    2: "yellow",
  };

  // 컴포넌트가 처음 마운트되거나 teamId, planId, receiptId가 변경될 때 실행
  useEffect(() => {
    if (!teamId || !planId) {
      // teamId와 planId가 없다면 로컬 스토리지에서 가져옴
      teamId = Number(localStorage.getItem("teamId"));
      planId = Number(localStorage.getItem("planId"));

      if (teamId && planId) {
        dispatch(setTeamPlan({ teamId, planId })); // Redux에 teamId와 planId 설정
      } else {
        console.error("teamId 또는 planId가 전달되지 않았습니다.");
        return;
      }
    }

    // 영수증 상세 조회 API 호출 함수
    const fetchReceiptDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `teams/${teamId}/plans/${planId}/receipts/${receiptId}`
        );
        setReceipt(response.data.data); // API 응답 데이터를 receipt 상태에 저장
        setIsManager(response.data.data.isManager); // 사용자가 관리자인지 설정
      } catch (error) {
        console.error("영수증 상세 조회에 실패했습니다.", error);
      }
    };

    fetchReceiptDetail(); // 영수증 상세 조회 함수 호출
  }, [teamId, planId, receiptId]); // 의존성 배열에 teamId, planId, receiptId 추가

  // 정산액 계산 함수
  const calculateSettlements = (items) => {
    if (!items) return {};

    const settlements = {};

    items.forEach((item) => {
      const perMemberAmount = item.unitPrice / item.members.length; // 품목 당 개인 금액 계산

      item.members.forEach((member) => {
        if (!settlements[member.nickname]) {
          settlements[member.nickname] = 0;
        }
        settlements[member.nickname] += perMemberAmount; // 각 멤버별 정산 금액 추가
      });
    });

    return settlements; // 정산 금액 반환
  };

  // 영수증 데이터가 있으면 정산액 계산
  const settlements = receipt ? calculateSettlements(receipt.items) : {};

  // 영수증 수정 버튼 핸들러
  const handleUpdate = () => {
    navigate("/receipt/update-form", {
      state: { receiptId: receiptId, receiptData: receipt },
    });
  };

  // 삭제 모달 열기 핸들러
  const handleDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  // 영수증 삭제 핸들러
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `teams/${teamId}/plans/${planId}/receipts/${receiptId}`
      );
      setIsDeleteModalOpen(false);
      navigate("/receipt"); // 삭제 후 영수증 리스트 페이지로 이동
    } catch (error) {
      console.error("영수증 삭제에 실패했습니다.", error);
    }
  };

  // 확인 버튼 핸들러 (이전 페이지로 돌아감)
  const handleCheck = () => {
    navigate(-1);
  };

  // 참여자 보기 모달 열기 핸들러
  const handleViewParticipants = (item) => {
    setSelectedItem(item); // 선택된 품목 정보를 상태에 저장
    setIsViewParticipantsModalOpen(true); // 참여자 보기 모달 열기
  };

  // 참여자 보기 모달 닫기 핸들러
  const handleCloseParticipantsModal = () => {
    setIsViewParticipantsModalOpen(false); // 모달 닫기
    setSelectedItem(null); // 선택된 품목 초기화
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
                    <tr onClick={() => handleViewParticipants(item)}>
                      <td>{item.name}</td>
                      <td>{item.count}개</td>
                      <td>{item.unitPrice.toLocaleString()}원</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="tagged-people">
                        {item.members.map((member, idx) => (
                          <img
                            key={idx}
                            src={member.profileImg}
                            alt={member.nickname}
                            className="tagged-avatar"
                            onClick={() => handleViewParticipants(item)} // 이미지 클릭 시에도 모달 열림
                          />
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
            <div className="receipt-footer">
              <div className="receipt-meta">
                <p>결제자 : {receipt.managerName}</p>
                <p>결제일시 : {receipt.paymentDate}</p>
              </div>
              {isManager && status === 0 && (
                <div className="receipt-manage">
                  <img src={Update} alt="update" onClick={handleUpdate} />
                  <img src={Delete} alt="delete" onClick={handleDeleteModal} />
                </div>
              )}
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
                    <td>
                      {Math.floor(settlements[nickname]).toLocaleString()}원
                    </td>
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
        <></>
      )}
      {isDeleteModalOpen && (
        <DeleteReceiptModal
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
      {isViewParticipantsModalOpen && selectedItem && (
        <ViewParticipantsModal
          participants={selectedItem.members}
          onClose={handleCloseParticipantsModal}
          itemName={selectedItem.name}
        />
      )}
    </>
  );
}

export default ReceiptDetail;
