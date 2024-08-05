import React, { useState } from "react";
import Receipt from "./ReceiptSelect";
import Button from "../../common/Button";
import Pink from "../../../assets/receipt/pinkReceipt.png";
import Sky from "../../../assets/receipt/skyReceipt.png";
import Yellow from "../../../assets/receipt/yellowReceipt.png";

function DesignComponent({ setActiveTab, receiptData, setReceiptData }) {
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
            setReceiptData({ ...receiptData, color: localReceiptColor });
            setActiveTab("recognize");
          }}
        >
          다음
        </Button>
      </div>
    </>
  );
}

export default DesignComponent;
