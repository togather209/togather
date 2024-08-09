import React, { useEffect, useState } from "react";
import "./GameModal.css";
import Close from "../../assets/icons/common/close.png";
import axiosInstance from "../../utils/axiosInstance";

function GameModal({ onClose, onConfirm }) {
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [participantsByTeamId, setParticipantsByTeamId] = useState({});
  const [tempSelectedParticipants, setTempSelectedParticipants] = useState();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 팀과 참여자 데이터를 가져옵니다.
    const fetchTeamsAndParticipants = async () => {
      try {
        const response = await axiosInstance.get("/teams/members/me");
        if (response) {
          const teamsData = response.data.data;
          setTeams(teamsData);

          // 각 팀에 대한 참여자 데이터를 가져옵니다.
          const participantsData = {};
          for (const team of teamsData) {
            try {
              const participantsResponse = await axiosInstance.get(
                `/teams/${team.teamId}/members`
              );
              if (participantsResponse) {
                participantsData[team.teamId] = participantsResponse.data.data;
              }
            } catch (error) {
              console.error("참여자 데이터를 가져오는 중 오류 발생", error);
            }
          }
          setParticipantsByTeamId(participantsData);
        }
      } catch (error) {
        console.error("팀 데이터를 가져오는 중 오류 발생", error);
      }
    };

    fetchTeamsAndParticipants();
  }, []);

  const toggleTeam = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
      setTempSelectedParticipants([]); // 팀을 접으면 선택된 참여자 초기화
    } else {
      setExpandedTeamId(teamId);
      setTempSelectedParticipants(participantsByTeamId[teamId] || []); // 새로운 팀을 열면 참여자 리스트를 초기화
    }
  };

  const handleCheckboxChange = (participant) => {
    setTempSelectedParticipants((prevParticipants) => {
      const isSelected = prevParticipants.includes(participant);

      if (isSelected) {
        return prevParticipants.filter((person) => person !== participant);
      } else {
        return [...prevParticipants, participant];
      }
    });
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-content">
        <img
          src={Close}
          className="game-modal-close"
          onClick={() => {
            onClose();
            setExpandedTeamId(null);
          }}
          alt="Close"
        />
        <div className="game-modal-title">게임 인원을 선택해주세요</div>
        <div className="team-list">
          {teams.map((team) => (
            <div key={team.teamId} className="team-item">
              <div
                className="team-title"
                onClick={() => toggleTeam(team.teamId)}
              >
                {team.title}
              </div>
              {expandedTeamId === team.teamId && (
                <div className="game-participant-list">
                  {participantsByTeamId[team.teamId]?.map((participant) => (
                    <div
                      key={participant.memberId}
                      className="game-participant-item"
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSelectedParticipants.includes(
                            participant
                          )}
                          onChange={() => handleCheckboxChange(participant)}
                        />
                        <div className="game-participant-info">
                          <img
                            className="game-participant-info-img"
                            src={participant.profileImg}
                            alt="프로필"
                          />
                          {participant.nickname}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const selectedTeam = teams.find(
              (team) => team.teamId === expandedTeamId
            );
            onConfirm(selectedTeam, tempSelectedParticipants); // 선택된 팀과 참여자들을 onConfirm으로 전달
          }}
          className="game-modal-confirm-button"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default GameModal;
