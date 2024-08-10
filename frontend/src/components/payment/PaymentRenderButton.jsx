function PaymentRenderButton(paymentData) {
  const renderButton = () => {
    if (paymentData.status === 0) {
      // (개인) 정산 동의 전 상태

      // 이의 신청 / 정산 동의 버튼 활성화
      return;
    } else if (paymentData.status === 1) {
      // (개인) 정산 동의 후 & (전체) 정산 동의 천
      // 송금 대기 버튼 활성화
    } else if (paymentData.status === 2) {
      // (전체) 정산 동의 후 & (개인) 송금 대기
      // 송금 버튼 활성화
    } else if (paymentData.status === 3) {
      // (개인) 송금 완료

      // 버튼 비활성화

      return <></>;
    }
  };
}

export default PaymentRenderButton;
