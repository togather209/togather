import React from 'react';
import './GameModal.css';
import Close from '../../assets/icons/common/close.png';

function GameModal({ isOpen, onClose, onConfirm, selectedParticipants, setSelectedParticipants, scheduleParticipants }) {
  if (!isOpen) return null;

  const handleCheckboxChange = (participant) => {
    if (selectedParticipants.includes(participant)) {
      setSelectedParticipants(selectedParticipants.filter(item => item !== participant));
    } else {
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