import React, { useEffect, useState } from "react";
import NoPayment from "../components/wallet/NoPayment";
import MyPayment from "../components/wallet/MyPayment";
import { useSelector } from "react-redux";

function Wallet() {
  const [isExistPayment, setIsExistsPayment] = useState(false);
  const account = useSelector((state) => state.account.account);

  useEffect(() => {
    //계좌가 있으면...
    if (account !== null) {
      setIsExistsPayment(true);
    } else {
      setIsExistsPayment(false);
    }
  }, [account]);

  return <>{isExistPayment ? <MyPayment /> : <NoPayment />}</>;
}

export default Wallet;
