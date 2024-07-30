import React from 'react'

import './JoinMeeting.css'

function JoinMeeting() {
    return (
        <div>
            <div>모임의 참여코드를 입력해주세요</div>

            <form action="" className='joinmeetinginput'>
                <input type="text" placeholder='참여코드 6자'/>
                <button>참여</button>
            </form>


        </div>
    )
}

export default JoinMeeting;