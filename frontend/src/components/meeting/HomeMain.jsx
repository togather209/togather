import React from 'react';
import './HomeMain.css'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigation = useNavigate()
  return (
    <div className='homemain'>

      <div className='header'>
        <div>로고</div>
        <button onClick={() => navigation('alarm')}>알람 아이콘</button>
      </div>

      <div className='meetingsection'>
        <div className='meetingheader'>
          <div>
            <h3>나의 모임</h3>
            <div>모임을 더 쉽고 간편하게 !</div>
          </div>
          <button onClick={() => navigation('allmeeting')}>전체보기 및 편집</button>
        </div>
        <div className='meetinglist'>
          <div onClick={() => navigation('/1')}>1</div>
          <div onClick={() => navigation('/2')}>2</div>
          <div onClick={() => navigation('/3')}>3</div>
          <div onClick={() => navigation('/4')}>4</div>
          <div onClick={() => navigation('/5')}>5</div>
          <div onClick={() => navigation('/6')}>6</div>
        </div>
      </div>

      <div className='newmeeting'>
        <div className='newmeetingheader'>
          <h3>새로운 모임</h3>
          <div>다른 모임을 만들어보는 건 어떠세요?</div>
        </div>
        <div className='newmeetingbutton'>
          <div>
          <button onClick={() => navigation('createmeeting')}>모임 만들기</button>
          </div>
          <div>
          <button onClick={()=>navigation('joinmeeting')}>모임 참여하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
