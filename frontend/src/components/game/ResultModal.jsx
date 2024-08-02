import React, { useState } from 'react';
import './ResultModal.css';
import Close from '../../assets/icons/common/close.png';

function ResultModal({ isOpen, onClose, selectedParticipant }) {
  const [isCardReversed, setIsCardReversed] = useState(false);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const handleModalCard = () => {
    // 카드가 뒤집히지 않았으면 뒤집어준다.
    if (!isCardReversed) {
      setIsCardReversed(true);
    }
  }

  const handleConfirm = () => {
    // 모달 뒤집힌 상태 초기화
    setIsCardReversed(false);

    // 모달 닫기
    onClose();
  }

  return (
    <div className="result-modal-overlay">
      <div className={`result-modal-wrapper ${isCardReversed ? 'rotate' : ''}`} onClick={handleModalCard}>
        <div className='result-modal-card'>
          <div className='result-modal-before'>
            <div className='description'>카드를 눌러 뒤집어보세요 !</div>
          </div>
          <div className="result-modal-after">
            {selectedParticipant && (
              <div className="selected-participant">
                <img src={selectedParticipant.imgSrc} alt={selectedParticipant.name} className='participant-image' />
                <div className='participant-name'><span>{selectedParticipant.name}</span>님 당첨 !</div>
              </div>
            )}
            <button onClick={handleConfirm} className="result-modal-confirm-button">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
