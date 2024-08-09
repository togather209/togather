import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function PaymentContainer() {
  useEffect(() => {
    // 정산 예정 내역 API 조회
    const fetchPayment = async () => {
      const response = await axiosInstance.get(`/teams/`);
    };

    fetchPayment();
  }, []);

  return (
    <>
      <div>payment</div>
    </>
  );
}

export default PaymentContainer;
