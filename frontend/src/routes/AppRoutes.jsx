import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Game from '../pages/Game';
import Wallet from '../pages/Wallet';
import MyPage from '../pages/MyPage';
import Landing from '../pages/Landing'

//유저
import User from '../pages/User';
import SignUpForm from '../components/user/SignUpForm';

//홈
import Home from "../pages/Home";
import HomeMainContainer from "../components/home/HomeMainContainer";
import HomeMain from "../components/home/HomeMain";
import RegistForm from "../components/home/RegistForm";
import JoinForm from "../components/home/JoinForm";

//미팅
import MeetingContainer from "../components/meeting/MeetingContainer";
import Meetings from "../components/meeting/Meetings";
import MeetingDetail from "../components/meeting/MeetingDetail";

//영수증
import Receipt from '../pages/Receipt';
import ReceiptListContainer from '../components/receipt/receiptList/ReceiptListContainer';
import ReceiptFormContainer from '../components/receipt/receiptForm/ReceiptFormContainer';
import ReceiptDetail from '../components/receipt/receiptDetail/ReceiptDetail';

function AppRoutes() {
  return (
    <Routes>
      <Route path="landing" element={<Landing />} />

      <Route path="/" element={<Home />}>
        <Route path="" element={<HomeMainContainer />}>
            <Route index element={<HomeMain />}></Route>
            <Route path="regist_form" element={<RegistForm />}></Route>
            <Route path="join_form" element={<JoinForm />}></Route>
        </Route>
        <Route path="meeting" element={<MeetingContainer />}>
            <Route index element={<Meetings />}></Route>
            <Route path=":id" element={<MeetingDetail />}></Route>
        </Route>
      </Route>

      <Route path='/wallet' element={<Wallet />} />
      <Route path='/mypage' element={<MyPage />} />
      <Route path='/login' element={<User />} />
      <Route path='/signup' element={<SignUpForm/>} />

      <Route path='/receipt' element={<Receipt />}>
        <Route index element={<ReceiptListContainer />} />
        <Route path=':id' element={<ReceiptDetail />} />
        <Route path='regist-form' element={<ReceiptFormContainer />} />
      </Route>

      <Route path='/game' element={<Game />} />
    </Routes>
    );
}

export default AppRoutes;