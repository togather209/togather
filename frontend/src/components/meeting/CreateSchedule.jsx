import React from 'react'
import './CreateSchedule.css'
import { useParams } from 'react-router-dom';

function CreateSchedule() {
    const params = useParams()
    return (
        <div className='createschedule'>
            <div className='createschedule-header'>
                <div>{ params.id } 번째 모임 / 일정 생성 폼입니다.</div>
                <div>어떤 일정인가요?</div>
                <div>일정 정보를 입력해주세요</div>
            </div>
            <form action="" className='createschedule-form' >
                <span>일정 시작일 및 종료일</span>
                <input type="date" />
                <input type="text" placeholder='일정명'/>
                <input type="text" placeholder='설명'/>
                <button>생성</button>
            </form>
        </div>
    )
}

export default CreateSchedule;