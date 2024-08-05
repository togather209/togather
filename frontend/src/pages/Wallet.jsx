import React, { useEffect, useState } from "react";
import NoPayment from "../components/wallet/NoPayment";
import MyPayment from "../components/wallet/MyPayment";

function Wallet( { accessToken }) {
  const [isExistPayment, setIsExistsPayment] = useState(false);

  return (
    <>
      <MyPayment/>
    </>
  );
}

export default Wallet;
