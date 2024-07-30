import React from 'react';
import ReceiptListContainer from '../components/receipt/receiptList/ReceiptListContainer';
import { Outlet } from 'react-router-dom';

function Receipt() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Receipt;