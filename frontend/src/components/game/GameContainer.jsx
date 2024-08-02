import React, { useState } from 'react';
import GameModal from './GameModal';
import './Game.css';
import Machine from '../../assets/game/machine.png';

function GameContainer() {
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const scheduleParticipants = ['김범규', '김해수', '이지혜'];

  // 모달을 여는 함수
  const addParticipant = () => {
    setIsModalOpen(true);
  };

  // 모달에서 확인 버튼을 눌렀을 때 실행되는 함수
  const handleConfirm = () => {
    // 선택된 참가자 중 아직 참가자 목록에 없는 새로운 참가자들을 추가
    const newParticipants = selectedParticipants.filter(participant => 
      !participants.some(p => p.name === participant)
    ).map(participant => ({ id: Date.now() + Math.random(), name: participant, imgSrc: 'default.jpg' }));
    
    // 선택된 참가자들을 업데이트, 체크 해제된 참가자들은 목록에서 제거
    const updatedParticipants = participants.filter(participant => 
      selectedParticipants.includes(participant.name)
    );

    // 업데이트된 참가자 목록 설정
    setParticipants([...updatedParticipants, ...newParticipants]);
    setIsModalOpen(false);
  };

  return (
    <div className='game-container'>
      <h1>게임</h1>
      <div className='people'>참여 인원</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div onClick={addParticipant} className='game-add-button'>
          +
        </div>
        {participants.map(participant => (
            <div key={participant.id} className='game-participant'>
                <img src={participant.imgSrc} alt={participant.name} className='game-participant-image' />
            </div>
        ))}
      </div>
      <div className='game-machine-container'>
        <img src={Machine} className='game-machine' alt="machine"/>
        <button className='game-start-button'>카드 뽑기</button>
      </div>
      <GameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirm}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
        scheduleParticipants={scheduleParticipants}
      />
    </div>
  );
}

export default GameContainer;
