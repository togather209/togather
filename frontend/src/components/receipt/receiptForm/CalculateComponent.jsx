import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./CalculateComponent.css";
import SelectParticipantsModal from "./SelectParticipantsModal";
import AddButton from "../../../assets/icons/common/add.png";
import DefaultProfile from "../../../assets/icons/common/defaultProfile.png";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setTeamPlan } from "../../../redux/slices/receiptSlice";

function CalculateComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태에서 영수증 데이터를 가져옴
  const receiptData = useSelector((state) => state.receipt);
  const {
    color,
    businessName,
    paymentDate,
    items,
    totalPrice,
    bookmarkId,
    receiptId,
  } = receiptData;
  let { teamId, planId } = useSelector((state) => state.receipt);

  const [activeType, setActiveType] = useState("divide"); // 현재 계산 유형을 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 참가자 선택 모달의 열림 상태를 저장
  const [itemParticipants, setItemParticipants] = useState({}); // 각 품목에 대한 참가자 정보를 저장
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // 현재 선택된 품목의 인덱스를 저장
  const [participants, setParticipants] = useState(null);
  const [generalParticipants, setGeneralParticipants] = useState([]); // 일반적인 참가자 정보를 저장
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // teamId, planId 없을 때 localStorage에서 가져오기
    if (!teamId || !planId) {
      teamId = Number(localStorage.getItem("teamId"));
      planId = Number(localStorage.getItem("planId"));

      if (teamId && planId) {
        dispatch(setTeamPlan({ teamId, planId }));
      } else {
        console.error("teamId 또는 planId가 전달되지 않았습니다.");
        return;
      }
    }

    // 일정 참여자 리스트 조회하기 API 요청
    const fetchParticipants = async () => {
      try {
        const response = await axiosInstance.get(`teams/${teamId}/members`);
        setParticipants(response.data.data);
      } catch (error) {
        console.error("일정 참여자 리스트 조회 중 문제가 발생했습니다.", error);
      }
    };

    fetchParticipants();
  }, [generalParticipants]);

  const formattedPaymentDate = new Date(paymentDate).toISOString();

  // 영수증 등록 요청
  const handleRegister = async () => {
    // 이미 등록 버튼을 눌렀다면 재등록 방지
    if (isSubmitting) return;

    // 등록 버튼 클릭시 등록 중 상태
    setIsSubmitting(true);

    // paymentDate를 ISO 8601 형식으로 변환
    const receiptTempInfo = {
      businessName,
      paymentDate: formattedPaymentDate,
      totalPrice,
      color,
      items: items.map((item, index) => ({
        name: item.name,
        unitPrice: item.unitPrice,
        count: item.count,
        members:
          activeType === "personal"
            ? (itemParticipants[index] || []).map((participant) => ({
                memberId: participant.memberId,
              }))
            : generalParticipants.map((participant) => ({
                memberId: participant.memberId,
              })),
      })),
    };

    if (bookmarkId !== null) {
      receiptTempInfo.bookmarkId = bookmarkId;
    }

    try {
      const response = await axiosInstance.post(
        `teams/${teamId}/plans/${planId}/receipts`,
        receiptTempInfo
      );

      // 상태 초기화
      setActiveType("divide");
      setItemParticipants({});
      setGeneralParticipants([]);
      setCurrentItemIndex(null);

      navigate("/receipt"); // 등록 성공 후 /receipt 페이지로 이동
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };

  // 영수증 수정 요청
  const handleUpdate = async () => {
    const receiptUpdatepInfo = {
      businessName,
      paymentDate: formattedPaymentDate,
      totalPrice,
      color,
      items: items.map((item, index) => ({
        name: item.name,
        unitPrice: item.unitPrice,
        count: item.count,
        members:
          activeType === "personal"
            ? (itemParticipants[index] || []).map((participant) => ({
                memberId: participant.memberId,
              }))
            : generalParticipants.map((participant) => ({
                memberId: participant.memberId,
              })),
      })),
    };

    if (bookmarkId !== null) {
      receiptUpdatepInfo.bookmarkId = bookmarkId;
    }

    try {
      const response = await axiosInstance.put(
        `teams/${teamId}/plans/${planId}/receipts/${receiptId}`,
        receiptUpdatepInfo
      );

      // 수정 후 영수증 전체 조회 페이지로 이동
      navigate("/receipt");
    } catch (error) {
      console.error("영수증 수정 중 문제가 발생했습니다.", error);
    }
  };

  // 계산 유형을 변경하는 함수
  const handleCalculateType = (type) => {
    setItemParticipants({});
    setGeneralParticipants([]);
    setCurrentItemIndex(null);
    setActiveType(type);
  };

  // 모달을 여는 함수
  const handleOpenModal = (itemIndex) => {
    setCurrentItemIndex(itemIndex);
    setIsModalOpen(true);
  };

  // 참가자를 선택하는 함수
  const handleSelectParticipants = (selected) => {
    if (currentItemIndex !== null) {
      setItemParticipants((prev) => ({
        ...prev,
        [currentItemIndex]: selected.map((participant) => ({
          memberId: participant.memberId,
          nickname: participant.nickname,
          profileImg: participant.profileImg,
        })),
      }));
    } else {
      setGeneralParticipants(
        selected.map((participant) => ({
          memberId: participant.memberId,
          nickname: participant.nickname,
          profileImg: participant.profileImg,
        }))
      );
    }
    setIsModalOpen(false);
  };

  // 정산 결과를 계산하는 함수
  const calculateSettlements = () => {
    const settlements = {};
    if (activeType === "personal") {
      Object.keys(itemParticipants).forEach((itemIndex) => {
        const item = items[itemIndex];
        const participants = itemParticipants[itemIndex] || [];
        const share = Math.floor(item.unitPrice / participants.length);
        participants.forEach((participant) => {
          if (!settlements[participant.nickname]) {
            settlements[participant.nickname] = 0;
          }
          settlements[participant.nickname] += share;
        });
      });
    } else if (activeType === "divide") {
      const totalAmount = items.reduce((sum, item) => sum + item.unitPrice, 0);
      const share = Math.floor(totalAmount / generalParticipants.length);
      generalParticipants.forEach((participant) => {
        settlements[participant.nickname] = share;
      });
    } else if (activeType === "all") {
      const totalAmount = items.reduce((sum, item) => sum + item.unitPrice, 0);
      const participant = generalParticipants[0];
      if (participant) {
        settlements[participant.nickname] = totalAmount;
      }
    }
    return settlements;
  };

  const settlements = calculateSettlements();

  // 모든 품목에 참가자가 태그되었는지 확인
  const allItemsTagged =
    activeType === "personal"
      ? items.every(
          (_, index) =>
            itemParticipants[index] && itemParticipants[index].length > 0
        )
      : generalParticipants.length > 0;

  const haveParticipants = Object.keys(settlements).length > 0;

  return (
    <>
      <div className="calculate-component-container">
        <div className="calculate-type-tab">
          <button
            className={`calculate-type-button ${
              activeType === "divide" ? "active" : ""
            }`}
            onClick={() => handleCalculateType("divide")}
          >
            1/n
          </button>
          <button
            className={`calculate-type-button ${
              activeType === "personal" ? "active" : ""
            }`}
            onClick={() => handleCalculateType("personal")}
          >
            개별
          </button>
          <button
            className={`calculate-type-button ${
              activeType === "all" ? "active" : ""
            }`}
            onClick={() => handleCalculateType("all")}
          >
            몰아주기
          </button>
        </div>
        <div className="select-participant-detail">
          {activeType === "personal" ? (
            <>
              <div className="select-participant-title">품목 별 인원 선택</div>
              <table className="select-participant-table">
                <thead>
                  <tr>
                    <th>품목</th>
                    <th>수량</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>
                          {item.name.length > 10
                            ? item.name.match(/.{1,10}/g).map((part, idx) => (
                                <span key={idx}>
                                  {part}
                                  <br />
                                </span>
                              ))
                            : item.name}
                        </td>
                        <td>{item.count}개</td>
                        <td>{item.unitPrice.toLocaleString()}원</td>
                      </tr>
                      <tr className="calculate-tag-list">
                        <td colSpan="3" className="calculate-tagged-people">
                          <img
                            src={AddButton}
                            onClick={() => handleOpenModal(index)}
                            className="add-participant-button"
                            alt="Add"
                          />
                          {itemParticipants[index]?.map((participant, idx) => (
                            <img
                              key={idx}
                              className="participant-badge"
                              src={
                                participant?.profileImg
                                  ? participant.profileImg
                                  : DefaultProfile
                              }
                              alt="profile"
                            />
                          ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className="select-participant-title">인원 선택</div>
              <div className="calculate-tagged-people">
                <img
                  src={AddButton}
                  onClick={() => handleOpenModal(null)}
                  className="add-participant-button"
                  alt="Add"
                />
                {generalParticipants.map((participant, idx) => (
                  <img
                    key={idx}
                    className="participant-badge"
                    src={
                      participant?.profileImg
                        ? participant.profileImg
                        : DefaultProfile
                    }
                    alt={participant.nickname}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {haveParticipants && (
          <div
            className={`calculated-result ${
              color === 0 ? "sky" : color === 1 ? "pink" : "yellow"
            }`}
          >
            <div className="calculated-result-title">정산 결과</div>
            <div className="calculated-result-content">
              <table className="calculated-result-table">
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
          </div>
        )}
        {receiptId ? (
          <Button
            type={allItemsTagged ? "purple" : "gray"}
            className="receipt-regist-button"
            onClick={handleUpdate}
            disabled={!allItemsTagged}
          >
            수정완료
          </Button>
        ) : (
          <Button
            type={allItemsTagged ? "purple" : "gray"}
            className="receipt-regist-button"
            onClick={handleRegister}
            disabled={!allItemsTagged}
          >
            등록
          </Button>
        )}
      </div>
      {isModalOpen && (
        <SelectParticipantsModal
          participants={participants}
          selectedParticipants={
            currentItemIndex === null
              ? generalParticipants
              : itemParticipants[currentItemIndex]
          }
          onSelect={handleSelectParticipants}
          onClose={() => setIsModalOpen(false)}
          isSingleSelect={activeType === "all"}
        />
      )}
    </>
  );
}

export default CalculateComponent;
