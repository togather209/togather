import React from 'react';
import './ScheduleFinishModal.css';
import Close from '../../../assets/icons/common/close.png';
import MiddleButton from '../../common/MiddleButton';

function ScheduleFinishModal({ onClose, onConfirm }) {
  return (
    <div className='schedule-finish-modal-overlay'>
      <div className='schedule-finish-modal-content'>
        <img src={Close} className='schedule-finish-modal-close' onClick={onClose}></img>
        <div>
          <div>정말 일정을 끝내시겠습니까 ?</div>
          <p>🚨 더 이상 영수증을 등록할 수 없어요 !</p>
        </div>
        <button className='schedule-finish-modal-confirm' onClick={onConfirm}>정산 시작하기</button>
      </div>
    </div>
  )
}

export default ScheduleFinishModal;