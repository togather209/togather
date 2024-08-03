import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import MyPage from "../pages/MyPage";
import Game from "../pages/Game";
import User from "../pages/User";
import SignUpForm from "../components/user/SignUpForm";
import Wallet from "../pages/Wallet";
import TransactionList from "../components/wallet/TransactionList";
import Send from "../components/wallet/Send";
import CreatePayment from "../components/wallet/CreatePayment";
import SendForm from "../components/wallet/SendForm";
import Home from "../pages/Home";
import HomeMainContainer from "../components/home/HomeMainContainer";
import HomeMain from "../components/home/HomeMain";
import RegistForm from "../components/home/RegistForm";
import JoinForm from "../components/home/JoinForm";
import MeetingContainer from "../components/meeting/MeetingContainer";
import Meetings from "../components/meeting/Meetings";
import MeetingDetail from "../components/meeting/MeetingDetail";
import MeetingDetailContainer from "../components/meeting/MeetingDetailContainer";
import ScheduleRegist from "../components/schedule/ScheduleRegist";
import ScheduleDetail from "../components/schedule/ScheduleDetail";
import Receipt from "../pages/Receipt";
import ReceiptListContainer from "../components/receipt/receiptList/ReceiptListContainer";
import ReceiptFormContainer from "../components/receipt/receiptForm/ReceiptFormContainer";
import ReceiptDetail from "../components/receipt/receiptDetail/ReceiptDetail";
import ProfileUpdate from "../components/mypage/ProfileUpdate";
import Terms from "../components/mypage/Terms";
import PrivateRoute from "./PrivateRoute";
import MyPageMain from "../components/mypage/MyPageMain";

function AppRoutes({ accessToken }) {
  return (
    <Routes>
      <Route path="landing" element={<Landing />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/login" element={<User />} />
      <Route path="/mypage" element={<PrivateRoute element={MyPageMain} accessToken={accessToken} />} />
      <Route path="/" element={<PrivateRoute element={Home} accessToken={accessToken} />}>
        <Route path="" element={<HomeMainContainer accessToken={accessToken} />}>
          <Route index element={<HomeMain accessToken={accessToken} />} />
          <Route path="regist_form" element={<RegistForm accessToken={accessToken} />} />
          <Route path="join_form" element={<JoinForm accessToken={accessToken} />} />
        </Route>
        <Route path="meeting" element={<MeetingContainer accessToken={accessToken} />}>
          <Route index element={<Meetings accessToken={accessToken} />} />
          <Route path=":id" element={<MeetingDetailContainer accessToken={accessToken} />}>
            <Route index element={<MeetingDetail accessToken={accessToken} />}></Route>
            <Route path="schedule-regist" element={<ScheduleRegist accessToken={accessToken} />}></Route>
            <Route path="schedule/:id" element={<ScheduleDetail accessToken={accessToken} />}/>
          </Route>
        </Route>
      </Route>
      <Route path="/wallet" element={<PrivateRoute element={Wallet} accessToken={accessToken} />} />
      <Route path="/wallet/create_payment" element={<PrivateRoute element={CreatePayment} accessToken={accessToken} />} />
      <Route path="/wallet/transaction_list" element={<PrivateRoute element={TransactionList} accessToken={accessToken} />} />
      <Route path="/wallet/send" element={<PrivateRoute element={Send} accessToken={accessToken} />} />
      <Route path="/wallet/sendform" element={<PrivateRoute element={SendForm} accessToken={accessToken} />} />
      <Route path="/mypage/profile_update" element={<PrivateRoute element={ProfileUpdate} accessToken={accessToken} />} />
      <Route path="/mypage/terms" element={<PrivateRoute element={Terms} accessToken={accessToken} />} />
      <Route path="/receipt" element={<PrivateRoute element={Receipt} accessToken={accessToken} />}>
        <Route index element={<ReceiptListContainer accessToken={accessToken} />} />
        <Route path=":id" element={<ReceiptDetail accessToken={accessToken} />} />
        <Route path="regist-form" element={<ReceiptFormContainer accessToken={accessToken} />} />
      </Route>
      <Route path="/game" element={<PrivateRoute element={Game} accessToken={accessToken} />} />
    </Routes>
  );
}

export default AppRoutes;
