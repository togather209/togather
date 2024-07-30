import React, { useState } from "react";
import Receipt from "./ReceiptSelect";
import Button from "../../common/Button";

// import receipt img
import Pink from '../../../assets/receipt/pinkReceipt.png';
import Sky from '../../../assets/receipt/skyReceipt.png';
import Yellow from '../../../assets/receipt/yellowReceipt.png';

function DesignComponent({setActiveTab}) {
  const [receiptColor, setReceiptColor] = useState('sky');

  return (
    <>
      <Receipt setReceiptColor={setReceiptColor} />
      <div className="selectedReceipt">
        {receiptColor === 'pink' && <img src={Pink} alt="pink-receipt" className="color-receipt" />}
        {receiptColor === 'sky' &&<img src={Sky} alt="sky-receipt" className="color-receipt" />}
        {receiptColor === 'yellow' &&<img src={Yellow} alt="yellow-receipt" className="color-receipt" />}
      </div>
      <div className="component-button">
        <Button type='purple' onClick={() => {setActiveTab('recognize')}}>다음</Button>
      </div>
    </>
  )
}

export default DesignComponent;