import React from 'react'
import './MeetingDetail.css'

import { useParams, useNavigate } from 'react-router-dom';

function MeetingDetail() {
    const params = useParams()
    const navigation = useNavigate()
    return (
        <div className='meeting-detail'>
            <div>{ params.id }MeetingDetail</div>
            <div className='meeting-detail-header'>
                <button>뒤로가기</button>
                <button>모임관리</button>
            </div>
            <div className='meeting-detail-body'>
                <div className='meeting-detail-describe'>
                    <img src="" alt="모임 사진" />
                    <div>모임명</div>
                    <div>모임 설명</div>
                </div>
                <div className='schedule-list'>
                    <div className='schedule-item'>

                        <div>우리의 여행</div>
                        <button>영수증 작성 버튼</button>

                    </div>
                    <div className='schedule-item'>

                        <div>우리의 여행2</div>
                        <button>영수증 작성 버튼</button>

                    </div>
                    <div className='schedule-item'>

                        <div>우리의 여행3</div>
                        <button>영수증 작성 버튼</button>

                    </div>
                    <div className='schedule-item'>

                        <div>우리의 여행4</div>
                        <button>영수증 작성 버튼</button>

                    </div>
                    <div className='create-schedule'>
                        <button onClick={() => navigation(`/${params.id}/createschedule`)}>+ 일정만들기</button>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default MeetingDetail;