import React, { useEffect, useState } from "react";
import GameModal from "./GameModal";
import ResultModal from "./ResultModal";
import "./Game.css";
import Machine from "../../assets/game/machine.png";
import MachineTongsHead from "../../assets/game/machine-tongs-head.png";
import MachineTongs from "../../assets/game/machine-tongs.png";
import AddButton from "../../assets/icons/common/add.png";
import axiosInstance from "../../utils/axiosInstance";

function GameContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [randomParticipant, setRandomParticipant] = useState(null);
  const [isTongsDown, setIsTongsDown] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get("/teams/members/me");
        if (response) {
          setTeams(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("모임 전체 조회 중 문제가 발생했슴", error);
      }
    };
    fetchTeams();
  }, []);

  const addParticipant = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const newParticipants = selectedParticipants
      .filter(
        (participant) => !participants.some((p) => p.name === participant.name)
      )
      .map((participant) => ({
        id: Date.now() + Math.random(),
        name: participant.name,
        imgSrc: participant.imgSrc || "default.jpg",
      }));

    const updatedParticipants = participants.filter((participant) =>
      selectedParticipants.some((p) => p.name === participant.name)
    );

    setParticipants([...updatedParticipants, ...newParticipants]);
    setIsModalOpen(false);
  };

  const handleCardPick = () => {
    if (participants.length > 0) {
      setIsTongsDown(true);
      setTimeout(() => {
        setIsTongsDown(false);
      }, 1500);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setRandomParticipant(participants[randomIndex]);
        setIsResultModalOpen(true);
      }, 3000);
    }
  };

  const handleTeamSelect = async (team) => {
    setSelectedTeam(team);
    try {
      const response = await axiosInstance.get(`/teams/${team.teamId}/members`);
      if (response) {
        setSelectedParticipants(response.data.data);
      }
    } catch (error) {
      console.error("참여자 조회 중 문제가 발생했습니다", error);
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
          <div key={participant.id} className="game-participant">
            <img
              src={participant.imgSrc}
              alt={participant.name}
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
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamSelect={handleTeamSelect}
        teams={teams}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
        onConfirm={handleConfirm}
      />
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        selectedParticipant={randomParticipant}
      />
    </div>
  );
}

export default GameContainer;
