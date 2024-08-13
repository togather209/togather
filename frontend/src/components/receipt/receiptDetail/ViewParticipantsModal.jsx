import React from "react";
import "./ViewParticipantsModal.css";

function ViewParticipantsModal({ participants, onClose, itemName }) {
  return (
    <div className="view-participants-modal-overlay">
      <div className="view-participants-modal-content">
        <div className="view-participants-title">{itemName}</div>
        <div className="view-participants-modal-detail">
          {participants.map((participant, idx) => (
            <div key={participant.memberId} className="view-participant-item">
              <img
                className="view-participant-info-img"
                src={participant.profileImg}
                alt={participant.nickname}
              />
              {participant.nickname}
            </div>
          ))}
        </div>
        <button className="view-confirm-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

export default ViewParticipantsModal;
