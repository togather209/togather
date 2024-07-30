import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Wallet from "../pages/Wallet";
import MyPage from "../pages/MyPage";
import Receipt from "../pages/Receipt";
import User from "../pages/User";

import CreateMeeting from "../components/meeting/CreateMeeting";
import JoinMeeting from "../components/meeting/JoinMeeting";
import HomeMain from "../components/meeting/HomeMain";
import Alarm from "../components/meeting/Alarm";
import AllMeeting from "../components/meeting/AllMeeting";
import MeetingDetail from "../components/meeting/MeetingDetail";
import CreateSchedule from "../components/meeting/CreateSchedule";
import SignUpForm from "../components/user/SignUpForm";
import TransactionList from "../components/wallet/TransactionList";
import Send from "../components/wallet/Send";
import CreatePayment from "../components/wallet/CreatePayment";

import ReceiptListContainer from '../components/receipt/receiptList/ReceiptListContainer';
import ReceiptFormContainer from '../components/receipt/receiptForm/ReceiptFormContainer';
import ReceiptDetail from '../components/receipt/receiptDetail/ReceiptDetail';

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />}>
        <Route path="/" element={<HomeMain />} />
        <Route path=":id" element={<MeetingDetail />} />
        <Route path=":id/createschedule" element={<CreateSchedule />} />
        <Route path="createmeeting" element={<CreateMeeting />} />
        <Route path="joinmeeting" element={<JoinMeeting />} />
        <Route path="alarm" element={<Alarm />} />
        <Route path="allmeeting" element={<AllMeeting />} />
      </Route>
      <Route path="/game" element={<Game />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/wallet/create_payment" element={<CreatePayment/>} />
      <Route path="/wallet/transaction_list" element={<TransactionList />} />
      <Route path="/wallet/send" element={<Send />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/login" element={<User />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path='/receipt' element={<Receipt />}>
              <Route index element={<ReceiptListContainer />} />
              <Route path=':id' element={<ReceiptDetail />} />
              <Route path='regist-form' element={<ReceiptFormContainer />} />
            </Route>
    </Routes>
  );
}

export default AppRoutes;
