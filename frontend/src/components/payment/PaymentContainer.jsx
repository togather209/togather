import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import "./PaymentContainer.css";
import BackButton from "../common/BackButton";
import Receive from "../../assets/payment/receive.png";
import Send from "../../assets/payment/send.png";
import Spend from "../../assets/payment/spend.png";
import RenderButton from "./PaymentRenderButton";
import Modal from "../common/Modal";

function PaymentContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  let { teamId, planId } = location.state || {};
  const [paymentData, setPaymentData] = useState(null);
  const [loginUserName, setLoginUserName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(teamId, planId);

    // 정산 예정 내역 API 조회
    const fetchPayment = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/${teamId}/plans/${planId}/payments`
        );
        setPaymentData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("페이먼트 데이터 조회 오류", error);
        setError(true);
      }
    };

    // 로그인 유저 닉네임 API 조회
    const fetchNickname = async () => {
      try {
        const response = await axiosInstance.get(`members/me`);
        setLoginUserName(response.data.data.nickname);
        console.log(loginUserName);
      } catch (error) {
        console.error("유저 정보 조회 중 오류 발생", error);
        setError(true);
      }
    };

    fetchPayment();
    fetchNickname();
  }, [teamId, planId, loginUserName]);

  if (error) {
    return (
      <Modal
        mainMessage="문제가 발생했습니다."
        subMessage="다시 시도해보세요."
        onClose={() => {
          setError(false);
          navigate(-1);
        }}
      />
    );
  }

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
                  {filteredReceiverPayments.length > 0 ? (
                    filteredReceiverPayments.map((payment, index) => (
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
                    ))
                  ) : (
                    <p className="payment-no-amount">
                      정산 받을 금액이 없습니다.
                    </p>
                  )}
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
                  <p className="payment-no-amount">
                    정산 보낼 금액이 없습니다.
                  </p>
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
      {
        <RenderButton
          teamId={teamId}
          planId={planId}
          paymentData={paymentData}
        />
      }
    </div>
  );
}

// 총 금액 계산 함수
function calculateTotal(payments) {
  return payments.reduce((acc, payment) => acc + payment.money, 0);
}

export default PaymentContainer;
