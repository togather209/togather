import React, { useState } from "react";
import Receipt from "./ReceiptSelect";
import Button from "../../common/Button";

// import receipt img
import Pink from '../../../assets/receipt/pinkReceipt.png';
import Sky from '../../../assets/receipt/skyReceipt.png';
import Yellow from '../../../assets/receipt/yellowReceipt.png';

function DesignComponent({ setActiveTab, setReceiptColor }) {
  const [localReceiptColor, setLocalReceiptColor] = useState('sky');

  return (
    <>
      <Receipt setLocalReceiptColor={setLocalReceiptColor} />
      <div className="selectedReceipt">
        {localReceiptColor === 'pink' && <img src={Pink} alt="pink-receipt" className="color-receipt" />}
        {localReceiptColor === 'sky' &&<img src={Sky} alt="sky-receipt" className="color-receipt" />}
        {localReceiptColor === 'yellow' &&<img src={Yellow} alt="yellow-receipt" className="color-receipt" />}
      </div>
      <div className="component-button">
        <Button type='purple' onClick={() => {
          setActiveTab('recognize');
          setReceiptColor(localReceiptColor)}}>다음</Button>
      </div>
    </>
  )
}

export default DesignComponent;