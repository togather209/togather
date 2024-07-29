import React from 'react';
import './ReceiptList.css';

const ReceiptAddButton = ({ onClick }) => {

  return (
    <div className="add-receipt" onClick={onClick} >
      <div className='add-receipt-icon'>+</div>
      <div className='add-receipt-text'>영수증 등록</div>
    </div>
  );
}

export default ReceiptAddButton;
