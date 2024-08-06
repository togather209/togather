import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./CalculateComponent.css";
import SelectParticipantsModal from "./SelectParticipantsModal";
import AddButton from "../../../assets/icons/common/add.png";
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
  const { color, businessName, paymentDate, items, totalPrice, bookmarkId } =
    receiptData;
  let { teamId, planId } = useSelector((state) => state.receipt);

  const [activeType, setActiveType] = useState("divide"); // 현재 계산 유형을 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 참가자 선택 모달의 열림 상태를 저장
  const [itemParticipants, setItemParticipants] = useState({}); // 각 품목에 대한 참가자 정보를 저장
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // 현재 선택된 품목의 인덱스를 저장
  const [generalParticipants, setGeneralParticipants] = useState([]); // 일반적인 참가자 정보를 저장

  useEffect(() => {
    console.log("general", generalParticipants);

    if (!teamId || !planId) {
      teamId = localStorage.getItem("teamId");
      planId = localStorage.getItem("planId");

      if (teamId && planId) {
        dispatch(setTeamPlan({ teamId, planId }));
      } else {
        console.error("teamId 또는 planId가 전달되지 않았습니다.");
        return;
      }
    }
  }, [generalParticipants]);

  // paymentDate를 ISO 8601 형식으로 변환
  const formattedPaymentDate = new Date(paymentDate).toISOString();

  // 영수증 등록 요청
  const handleRegister = async () => {
    const receiptTempInfo = {
      businessName,
      paymentDate: formattedPaymentDate,
      totalPrice,
      bookmarkId,
      color,
      items: items.map((item, index) => ({
        name: item.name,
        unitPrice: item.unitPrice,
        count: item.count,
        members:
          activeType === "personal"
            ? (itemParticipants[index] || []).map((participant) => ({
                memberId: participant.id,
              }))
            : generalParticipants.map((participant) => ({
                memberId: participant.id,
              })),
      })),
    };

    console.log(receiptTempInfo);

    try {
      const response = await axiosInstance.post(
        `teams/${teamId}/plans/${planId}/receipts`,
        receiptTempInfo
      );
      console.log("등록 성공:", response);

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
          id: participant.id,
          name: participant.name,
        })),
      }));
    } else {
      setGeneralParticipants(
        selected.map((participant) => ({
          id: participant.id,
          name: participant.name,
        }))
      );
    }
    console.log(itemParticipants);
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
          if (!settlements[participant.name]) {
            settlements[participant.name] = 0;
          }
          settlements[participant.name] += share;
        });
      });
    } else if (activeType === "divide") {
      const totalAmount = items.reduce((sum, item) => sum + item.unitPrice, 0);
      const share = Math.floor(totalAmount / generalParticipants.length);
      generalParticipants.forEach((participant) => {
        settlements[participant.name] = share;
      });
    } else if (activeType === "all") {
      const totalAmount = items.reduce((sum, item) => sum + item.unitPrice, 0);
      const participant = generalParticipants[0];
      if (participant) {
        settlements[participant.name] = totalAmount;
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

  const participants = [
    {
      id: 0,
      name: "김범규",
    },
    {
      id: 1,
      name: "김해수",
    },
    {
      id: 2,
      name: "이지혜",
    },
  ];

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
                        <td>{item.name}</td>
                        <td>{item.count}</td>
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
                            <span key={idx} className="participant-badge">
                              {participant.name}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <button
              className="select-participant-title"
              onClick={() => handleOpenModal(null)}
            >
              인원 선택
            </button>
          )}
        </div>
        {haveParticipants && (
          <div className="calculated-result">
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
                  {Object.keys(settlements).map((name, index) => (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>{settlements[name].toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Button
          type={allItemsTagged ? "purple" : "gray"}
          className="receipt-regist-button"
          onClick={handleRegister}
          disabled={!allItemsTagged}
        >
          등록
        </Button>
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
