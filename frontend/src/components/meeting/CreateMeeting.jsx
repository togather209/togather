import React from 'react'
import './CreateMeeting.css'

function CreateMeeting() {
    return (
        <div className='createmeeting'>
            <div className='createmeetingheader'>

                <div>어떤 모임인가요?</div>
                <div>모임에 대한 정보를 입력해주세요</div>

            </div>

                <form action="" className='createmeetinginput'>
                    <div>
                        <span>모임 대표 사진</span>
                        <input type="file" accept='image/*'/>
                    </div>
                    <input type="text" placeholder='모임명'/>
                    <input type="text" placeholder='설명'/>
                    <button>생성</button>
                </form>
        </div>
    )
}

export default CreateMeeting;