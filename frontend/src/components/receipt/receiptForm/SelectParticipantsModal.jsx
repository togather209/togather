import React, { useState, useEffect } from "react";
import "./SelectParticipantsModal.css";
import Close from "../../../assets/icons/common/close.png";
import { useDispatch } from "react-redux";

function SelectParticipantsModal({
  participants,
  selectedParticipants,
  onSelect,
  onClose,
  isSingleSelect,
}) {
  const [selected, setSelected] = useState(selectedParticipants || []);

  useEffect(() => {
    setSelected(selectedParticipants || []);
  }, [selectedParticipants]);

  const handleToggle = (participant) => {
    if (isSingleSelect) {
      setSelected([participant]);
    } else {
      if (selected.some((p) => p.memberId === participant.memberId)) {
        setSelected(
          selected.filter((p) => p.memberId !== participant.memberId)
        );
      } else {
        setSelected([...selected, participant]);
      }
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div className="select-participants-modal-overlay">
      <div className="select-participants-modal-content">
        <div className="select-participants-select">
          정산할 인원을 선택해주세요
        </div>
        <img
          src={Close}
          className="select-participants-modal-close"
          onClick={onClose}
          alt="Close"
        />
        <div className="select-participants-modal-detail">
          {participants.map((participant, idx) => (
            <div key={participant.memberId} className="participant-item">
              <input
                type={isSingleSelect ? "radio" : "checkbox"}
                id={`participant-${participant.memberId}`}
                checked={selected.some(
                  (p) => p.memberId === participant.memberId
                )}
                onChange={() => handleToggle(participant)}
              />
              <label htmlFor={`participant-${participant.memberId}`}>
                {participant.nickname}
              </label>
            </div>
          ))}
        </div>
        <button
          className={`select-confirm-button ${
            selected.length > 0 ? "active" : "inactive"
          }`}
          onClick={handleConfirm}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}

export default SelectParticipantsModal;
