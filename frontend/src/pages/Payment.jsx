import React from "react";
import { Outlet } from "react-router-dom";
import PaymentContainer from "../components/payment/PaymentContainer";

function Payment() {
  return (
    <>
      <PaymentContainer />
    </>
  );
}

export default Payment;
