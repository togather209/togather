import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation } from "react-router-dom";
import Loading from "../common/Loading";
import "./PaymentContainer.css";
import BackButton from "../common/BackButton";
import Receive from "../../assets/payment/receive.png";
import Send from "../../assets/payment/send.png";
import Spend from "../../assets/payment/spend.png";
import RenderButton from "./PaymentRenderButton";

function PaymentContainer() {
  const location = useLocation();
  const { teamId, planId } = location.state || { teamId: 1, planId: 1 };
  const [paymentData, setPaymentData] = useState(null);
  const [loginUserName, setLoginUserName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // 정산 예정 내역 API 조회
    // const fetchPayment = async () => {
    //   try {
    //     const response = await axiosInstance.get(
    //       `/teams/${teamId}/plans/${planId}/payments`
    //     );
    //     setPaymentData(response.data.data);
    //     console.log(response.data.data);
    //   } catch (error) {
    //     console.error("페이먼트 데이터 조회 오류", error);
    //   }
    // };

    // 로그인 유저 닉네임 API 조회
    const fetchNickname = async () => {
      try {
        const response = await axiosInstance.get(`members/me`);
        setLoginUserName(response.data.data.nickname);
        console.log(loginUserName);
      } catch (error) {
        console.error("유저 정보 조회 중 오류 발생", error);
      }
    };

    // fetchPayment();
    fetchNickname();

    // 테스트를 위한 임시 데이터 설정
    const tempData = {
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      teamTitle: "비모",
      planTitle: "부산일정",
      status: 0,
      receiverPayments: [
        { name: "TOGETHER", money: 22000 },
        { name: "서두나", money: 33000 },
        { name: "김범규", money: 18700 },
        { name: "김해수", money: 20000 },
      ],
      senderPayments: [
        { name: "김선하", money: 15000 },
        { name: "서두나", money: 7500 },
        { name: "김범규", money: 18000 },
        { name: "김해수", money: 7000 },
      ],
      memberItems: [
        { name: "아이스 아메리카노", money: 4500 },
        { name: "닭볶음탕", money: 11000 },
        { name: "아쿠아리움", money: 12000 },
        { name: "택시비", money: 7600 },
        { name: "소주", money: 8000 },
        { name: "반건조 오징어", money: 4000 },
      ],
    };

    setPaymentData(tempData);
  }, [teamId, planId]);

  if (!paymentData) {
    return (
      <Loading>
        <span style={{ color: "#712FFF" }}>최종 정산 내역</span>을<br />{" "}
        가져오는 중이에요
      </Loading>
    );
  }

  const {
    startDate,
    endDate,
    teamTitle,
    planTitle,
    receiverPayments,
    senderPayments,
    memberItems,
  } = paymentData;
  const filteredReceiverPayments = receiverPayments.filter(
    (payment) => payment.money > 0
  );

  return (
    <div className="payment-container">
      <div className="payment-back-button">
        <BackButton />
      </div>
      <div className="payment-title">{loginUserName}님의 최종 정산 내역</div>
      <div className="payment-receipt-box">
        <div className="payment-receipt-header">
          <h2>Receipt</h2>
          <p>모임명: {teamTitle}</p>
          <p>일정명: {planTitle}</p>
          <p>
            일시: {startDate} ~ {endDate}
          </p>
        </div>

        <div className="payment-receipt-section">
          <h3>
            <span className="payment-receipt-section-number">
              <span className="receipt-section-number-inner">1</span>
            </span>{" "}
            정산 요약
          </h3>
          <div className="payment-receipt-summary">
            <div className="payment-receipt-summary-receive">
              <p>정산으로 받을 금액</p>
              <p className="payment-receipt-summary-amount">
                + {calculateTotal(filteredReceiverPayments)}원
              </p>
            </div>
            <div className="payment-receipt-summary-send">
              <p>정산으로 보낼 금액</p>
              <p className="payment-receipt-summary-amount">
                - {calculateTotal(senderPayments)}원
              </p>
            </div>
          </div>
          <hr />
          <div className="payment-final-amount-container">
            <div>최종 정산 예정 금액 </div>
            <span className="payment-final-amount">
              {calculateTotal(filteredReceiverPayments) -
                calculateTotal(senderPayments)}{" "}
              원
            </span>
          </div>
        </div>

        <div className="payment-receipt-section">
          <h3>
            <span className="payment-receipt-section-number">
              <span className="receipt-section-number-inner">2</span>
            </span>{" "}
            정산 상세 내역
          </h3>
          <div className="payment-details">
            <div className="payment-details-receive">
              <div>
                <h4>
                  <img
                    src={Receive}
                    alt=""
                    className="payment-details-receive-icon"
                  />
                  정산 받을 금액
                </h4>
                <div className="payment-item-list">
                  {filteredReceiverPayments.map((payment, index) => (
                    <div key={index} className="payment-item">
                      <p
                        className={`name ${
                          payment.name === "TOGETHER"
                            ? "payment-system-name"
                            : ""
                        }`}
                      >
                        {payment.name}
                      </p>
                      <p
                        className={`name ${
                          payment.name === "TOGETHER"
                            ? "payment-system-name"
                            : ""
                        }`}
                      >
                        {payment.money}원
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="payment-summary-total">
                <p>총액 </p>
                <p>{calculateTotal(receiverPayments)}원</p>
              </div>
            </div>

            <div className="payment-details-send">
              <div>
                <h4>
                  <img
                    src={Send}
                    alt=""
                    className="payment-details-send-icon"
                  />
                  정산 보낼 금액
                </h4>
                {senderPayments.length > 0 ? (
                  senderPayments.map((payment, index) => (
                    <div key={index} className="payment-item">
                      <p>{payment.name}</p>
                      <p>{payment.money}원</p>
                    </div>
                  ))
                ) : (
                  <p>정산 보낼 금액이 없습니다.</p>
                )}
              </div>
              <hr />
              <div className="payment-summary-total">
                <p>총액 </p>
                <p>{calculateTotal(senderPayments)}원</p>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-final-summary">
          <div>
            {calculateTotal(filteredReceiverPayments)}원 -{" "}
            {calculateTotal(senderPayments)}원 =
          </div>
          <span className="payment-final-amount">
            {calculateTotal(filteredReceiverPayments) -
              calculateTotal(senderPayments)}{" "}
            원
          </span>
        </div>

        <div className="payment-receipt-section disabled8">
          <h3>
            <span className="payment-receipt-section-number">
              <span className="receipt-section-number-inner">3</span>
            </span>{" "}
            지출 상세 내역
          </h3>
          <div className="payment-expense-details">
            <h4>
              <img
                src={Spend}
                alt=""
                className="payment-expense-details-icon"
              />
              일정에서 나의 총 지출액
            </h4>
            {memberItems.map((expense, index) => (
              <div key={index} className="payment-expense-item">
                <p>{expense.name}</p>
                <p>{expense.money}원</p>
              </div>
            ))}
            <hr />
            <div className="payment-expense-total">
              <p>총액 </p>
              <p>{calculateTotal(memberItems)}원</p>
            </div>
          </div>
        </div>
      </div>
      {RenderButton(paymentData)}
    </div>
  );
}

// 총 금액 계산 함수
function calculateTotal(payments) {
  return payments.reduce((acc, payment) => acc + payment.money, 0);
}

export default PaymentContainer;
