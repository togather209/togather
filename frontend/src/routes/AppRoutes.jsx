import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";

import MyPageMain from "../components/mypage/MyPageMain";
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

import ScheduleDetailContainer from "../components/schedule/ScheduleDetailContainer";
import ScheduleUpdate from "../components/schedule/ScheduleUpdate";

import ScheduleDetailPart from "../components/schedule/ScheduleDetailPart";

import MeetingUpdate from "../components/meeting/MeetingUpdate"


// 게임 페이지
import Game from "../pages/Game";
import GameContainer from "../components/game/GameContainer";

// 영수증 페이지
import Receipt from "../pages/Receipt";
import ReceiptListContainer from "../components/receipt/receiptList/ReceiptListContainer";
import ReceiptFormContainer from "../components/receipt/receiptForm/ReceiptFormContainer";
import ReceiptDetail from "../components/receipt/receiptDetail/ReceiptDetail";
import ReceiptUpdateContainer from "../components/receipt/receiptUpdate/ReceiptUpdateContainer";
import CameraCapture from "../components/receipt/receiptForm/recognizeDetail/CameraCapture";

import ProfileUpdate from "../components/mypage/ProfileUpdate";
import Terms from "../components/mypage/Terms";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/login" element={<User />} />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPageMain />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      >
        <Route path="" element={<HomeMainContainer />}>
          <Route index element={<HomeMain />} />
          <Route path="regist_form" element={<RegistForm />} />
          <Route path="join_form" element={<JoinForm />} />
        </Route>
        <Route path="meeting" element={<MeetingContainer />}>
          <Route index element={<Meetings />} />
          <Route path=":id" element={<MeetingDetailContainer />}>
            <Route index element={<MeetingDetail />} />
            <Route path="schedule-regist" element={<ScheduleRegist />} />
            <Route path="meeting-update" element={<MeetingUpdate />} />
            <Route
              path="schedule/:schedule_id"
              element={<ScheduleDetailContainer />}
            >
              <Route index element={<ScheduleDetailPart />} />
              <Route path="update" element={<ScheduleUpdate />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route
        path="/wallet"
        element={
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet/create_payment"
        element={
          <PrivateRoute>
            <CreatePayment />
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet/transaction_list"
        element={
          <PrivateRoute>
            <TransactionList />
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet/send"
        element={
          <PrivateRoute>
            <Send />
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet/sendform"
        element={
          <PrivateRoute>
            <SendForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/mypage/profile_update"
        element={
          <PrivateRoute>
            <ProfileUpdate />
          </PrivateRoute>
        }
      />
      <Route
        path="/mypage/terms"
        element={
          <PrivateRoute>
            <Terms />
          </PrivateRoute>
        }
      />
      <Route
        path="/receipt"
        element={
          <PrivateRoute>
            <Receipt />
          </PrivateRoute>
        }
      >
        <Route index element={<ReceiptListContainer />} />
        <Route path=":receiptId" element={<ReceiptDetail />} />
        <Route path="regist-form" element={<ReceiptFormContainer />} />
        <Route path="camera-capture" element={<CameraCapture />} />
        <Route path="update-form" element={<ReceiptUpdateContainer />} />
      </Route>

      <Route
        path="/game"
        element={
          <PrivateRoute>
            <Game />
          </PrivateRoute>
        }
      >
        <Route index element={<GameContainer />}></Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
