import React from 'react';
import './Receipt.css';

const ReceiptAddButton = ({ onAddReceipt }) => {

  return (
    <div className="add-receipt" onClick={onAddReceipt} >
      <div className='add-receipt-icon'>+</div>
      <div className='add-receipt-text'>영수증 등록</div>
    </div>
  );
}

export default ReceiptAddButton;
