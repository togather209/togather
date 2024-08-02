import React from 'react';
import './GameModal.css';
import Close from '../../assets/icons/common/close.png';

function GameModal({ isOpen, onClose, onConfirm, selectedParticipants, setSelectedParticipants, scheduleParticipants }) {
  // isOpen이 false일 경우, 모달을 렌더링하지 않습니다.
  if (!isOpen) return null;

  // 체크박스 변경 시 호출되는 함수입니다.
  const handleCheckboxChange = (participant) => {
    // 선택된 참가자 리스트에 해당 참가자가 이미 있는지 확인합니다.
    if (selectedParticipants.includes(participant)) {
      // 이미 있는 경우, 리스트에서 제거합니다.
      setSelectedParticipants(selectedParticipants.filter(item => item !== participant));
    } else {
      // 없는 경우, 리스트에 추가합니다.
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-content">
        <div className='game-modal-title'>참여 인원을 선택해주세요</div>
        <img src={Close} className='game-modal-close' onClick={onClose} alt="close" />
        <div className="game-participant-list">
          {scheduleParticipants.map(participant => (
            <div key={participant} className="game-participant-item">
              <label>
                <input 
                  type="checkbox"
                  checked={selectedParticipants.includes(participant)}
                  onChange={() => handleCheckboxChange(participant)}
                />
                {participant}
              </label>
            </div>
          ))}
        </div>
        <button onClick={onConfirm} className="game-modal-confirm-button">
          확인
        </button>
      </div>
    </div>
  );
}

export default GameModal;
