import React, { useEffect, useState } from "react";
import GameModal from "./GameModal";
import ResultModal from "./ResultModal";
import "./Game.css";
import Machine from "../../assets/game/machine.png";
import MachineTongsHead from "../../assets/game/machine-tongs-head.png";
import MachineTongs from "../../assets/game/machine-tongs.png";
import AddButton from "../../assets/icons/common/add.png";

function GameContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [randomParticipant, setRandomParticipant] = useState(null);
  const [isTongsDown, setIsTongsDown] = useState(false);

  useEffect(() => {
    console.log(participants);
  }, [participants]);

  const addParticipant = () => {
    // 참여 인원 리셋
    setParticipants([]);
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const handleConfirm = (team, selectedParticipants) => {
    setSelectedTeam(team); // 선택된 팀 저장
    setParticipants(selectedParticipants); // 선택된 참여자들을 저장
    setIsModalOpen(false);
  };

  const handleCardPick = () => {
    // TODO 참여자 없을 시 모달 알림
    if (participants.length > 0) {
      setIsTongsDown(true);
      setTimeout(() => {
        setIsTongsDown(false);
      }, 1500);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setRandomParticipant(participants[randomIndex]);
        console.log(randomParticipant);
        setIsResultModalOpen(true);
      }, 3000);
    }
  };

  return (
    <div className="game-container">
      <h1>게임</h1>
      <div className="game-participants">참여 인원</div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="game-participants-list"
      >
        <img
          src={AddButton}
          onClick={addParticipant}
          className="game-add-button"
          alt="Add"
        />
        {participants.map((participant) => (
          <div key={participant.memberId} className="game-participant">
            <img
              src={participant.profileImg}
              alt={participant.nickname}
              className="game-participant-image"
            />
          </div>
        ))}
      </div>
      <div className="game-machine-container">
        <img src={Machine} className="game-machine" alt="machine" />
        <img
          src={MachineTongsHead}
          className="game-machine-tongs-head"
          alt="head"
        />
        <img
          src={MachineTongs}
          className={`game-machine-tongs ${
            isTongsDown ? "tongs-down" : "tongs-up"
          }`}
          alt="tongs"
        />
        <button className="game-start-button" onClick={handleCardPick}>
          카드 뽑기
        </button>
      </div>
      {isModalOpen && (
        <GameModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
      {isResultModalOpen && (
        <ResultModal
          onClose={() => setIsResultModalOpen(false)}
          selectedParticipant={randomParticipant}
          selectedTeam={selectedTeam}
        />
      )}
    </div>
  );
}

export default GameContainer;
