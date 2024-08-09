import React, { useState } from "react";
import "./ResultModal.css";
import Close from "../../assets/icons/common/close.png";

function ResultModal({ onClose, selectedParticipant, selectedTeam }) {
  const [isCardReversed, setIsCardReversed] = useState(false);

  const handleModalCard = () => {
    if (!isCardReversed) {
      setIsCardReversed(true);
    }
  };

  const handleConfirm = () => {
    setIsCardReversed(false);
    onClose();
  };

  return (
    <div className="result-modal-overlay">
      <div
        className={`result-modal-wrapper ${isCardReversed ? "rotate" : ""}`}
        onClick={handleModalCard}
      >
        <div className="result-modal-card">
          <div className="result-modal-before">
            <div className="description">카드를 눌러 뒤집어보세요 !</div>
          </div>
          <div className="result-modal-after">
            {selectedParticipant && (
              <div className="selected-participant">
                <img
                  src={selectedParticipant.profileImg}
                  alt={selectedParticipant.nickname}
                  className="participant-image"
                />
                <div className="participant-team-name">
                  {selectedTeam.title}
                </div>
                <div className="participant-name">
                  <span>{selectedParticipant.nickname}</span>님 당첨 !
                </div>
              </div>
            )}
            <button
              onClick={handleConfirm}
              className="result-modal-confirm-button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
