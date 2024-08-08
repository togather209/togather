import React, { useState } from "react";
import "./GameModal.css";
import Close from "../../assets/icons/common/close.png";

function GameModal({
  isOpen,
  onClose,
  teams,
  onTeamSelect,
  selectedParticipants,
  setSelectedParticipants,
  onConfirm,
}) {
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  if (!isOpen) return null;

  const handleCheckboxChange = (participant) => {
    if (selectedParticipants.includes(participant)) {
      setSelectedParticipants(
        selectedParticipants.filter((item) => item !== participant)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const toggleTeam = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
      onTeamSelect(teams.find((team) => team.teamId === teamId));
    }
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-content">
        <img
          src={Close}
          className="game-modal-close"
          onClick={onClose}
          alt="Close"
        />
        <div className="game-modal-title">팀을 선택해주세요</div>
        <div className="team-list">
          {teams.map((team) => (
            <div key={team.teamId} className="team-item">
              <div onClick={() => toggleTeam(team.teamId)}>{team.title}</div>
              {expandedTeamId === team.teamId && (
                <div className="game-participant-list">
                  {selectedParticipants.map((participant) => (
                    <div key={participant.id} className="game-participant-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant)}
                          onChange={() => handleCheckboxChange(participant)}
                        />
                        {participant.nickname}
                      </label>
                    </div>
                  ))}
                </div>
              )}
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
