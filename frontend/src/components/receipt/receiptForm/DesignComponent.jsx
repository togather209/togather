import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTab,
  setReceiptData,
} from "../../../redux/slices/receiptSlice";
import Receipt from "./ReceiptSelect";
import Button from "../../common/Button";
import Pink from "../../../assets/receipt/pinkReceipt.png";
import Sky from "../../../assets/receipt/skyReceipt.png";
import Yellow from "../../../assets/receipt/yellowReceipt.png";

function DesignComponent() {
  const dispatch = useDispatch();
  const receiptData = useSelector((state) => state.receipt);
  const [localReceiptColor, setLocalReceiptColor] = useState(receiptData.color);

  return (
    <>
      <Receipt setLocalReceiptColor={setLocalReceiptColor} />
      <div className="selectedReceipt">
        {localReceiptColor === 0 && (
          <img src={Sky} alt="sky-receipt" className="color-receipt" />
        )}
        {localReceiptColor === 1 && (
          <img src={Pink} alt="pink-receipt" className="color-receipt" />
        )}
        {localReceiptColor === 2 && (
          <img src={Yellow} alt="yellow-receipt" className="color-receipt" />
        )}
      </div>
      <div className="component-button">
        <Button
          type="purple"
          onClick={() => {
            dispatch(
              setReceiptData({ ...receiptData, color: localReceiptColor })
            );
            dispatch(setActiveTab("recognize"));
          }}
        >
          다음
        </Button>
      </div>
    </>
  );
}

export default DesignComponent;
