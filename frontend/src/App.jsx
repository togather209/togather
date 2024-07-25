import React, {useEffect} from "react";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./features/counter/counterSlice";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Wallet from "./pages/Wallet";
import Meeting from "./pages/Meeting";
import MyPage from "./pages/MyPage";

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const onClickRes = function () {

    axios.get(`http://localhost/api/v1/users/jlkjklsdf`)
      .then(res => {
        console.log('성공');
        // console.log()
      })
      .catch(err => {
        console.log('실패')
      })

  }


  return (
    <>
      
      <button onClick={onClickRes}>실험용 버튼</button>

      <div className="mt-[60px]">
        <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
