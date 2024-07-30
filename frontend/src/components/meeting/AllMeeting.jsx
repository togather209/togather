import React from 'react'
import './AllMeeting.css'
import { useNavigate } from 'react-router-dom'

function AllMeeting() {
    const navigation = useNavigate()
    return (
        <div>
            <div className='allmeetingheader'>
                <div>
                    <h3>나의 모임</h3>
                    <div>모임을 더 쉽고 간편하게</div>
                </div>
                <button onClick={() => navigation('/alarm')}>알림 아이콘</button>
            </div>

            <div className='meetinglist'>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div>
                    <img src="" alt="모임 사진" />
                    <div>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </div>
               
            </div>
        </div>
    )
}

export default AllMeeting;