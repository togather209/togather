import React, { useState } from "react";

import './Receipt.css';

import ReceiptCard from './ReceiptCard';
import ReceiptAddButton from './ReceiptAddButton';
import ReceiptTotal from './ReceiptTotal';
import BackButton from "../common/BackButton";
import LineButton from "../common/LineButton";

function ReceiptListContainer() {
  
  // TODO : 전체 영수증 리스트 가져오기
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      title: '한화 이글스 파크',
      amount: 63000,
      payer: '김범규',
      date: '2024.07.02',
      description: '비오면 떠나는 모임',
    },
    {
      id: 2,
      title: '시립 미술관',
      amount: 5000,
      payer: '김범규',
      date: '2024.07.01',
      description: '비오면 떠나는 모임',
    },
    {
      id: 3,
      title: 'How Cafe',
      amount: 20000,
      payer: '이지혜',
      date: '2024.07.01',
      description: '비오면 떠나는 모임',
    },
  ]);

  const handlePurpleLineButton = () => {
    console.log('일정 끝내기 버튼');
  }

  const handleReceiptCard = (receipt) => {
    console.log(receipt);
  }

  const handleAddReceipt = async() => {
    try {
      // TODO : 통신으로 새로운 영수증 가져오기
      const newReceipt = {
        id: Date.now(),
        title: '새로운 영수증',
        amount: 10000,
        payer: '홍길동',
        date: '2024.07.25',
        description: '새로운 모임',
      };
      setReceipts([...receipts, newReceipt]);
    } catch (error) {
      console.error('Error fetching new receipt : ', error);
    }
  }

  const totalAmount = receipts.reduce((total, receipt) => total + receipt.amount, 0);

  return (
    <div className="receipt-container">
      <header>
        <BackButton />
        <LineButton className="schedule-finish-button" onClick={handlePurpleLineButton}>
          일정 끝내기
        </LineButton>
      </header>
      <div className="receipt-list">
        <ReceiptAddButton onAddReceipt={handleAddReceipt} />
        {receipts.map(receipt => (
          <ReceiptCard key={receipt.id} receipt={receipt} onClick={() => handleReceiptCard(receipt)} />
        ))}
      </div>
      <ReceiptTotal amount={`${totalAmount.toLocaleString()}원`} />
    </div>
  )
}

export default ReceiptListContainer;