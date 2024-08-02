import React, { useState } from 'react';
import GameModal from './GameModal';
import ResultModal from './ResultModal';
import './Game.css';
import Machine from '../../assets/game/machine.png';
import MachineTongsHead from '../../assets/game/machine-tongs-head.png';
import MachineTongs from '../../assets/game/machine-tongs.png';

function GameContainer() {
  // 참가자 목록을 관리하는 상태
  const [participants, setParticipants] = useState([]);
  
  // 참가자 선택 모달의 열림/닫힘 상태를 관리하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 선택된 참가자 목록을 관리하는 상태
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  
  // 결과 모달의 열림/닫힘 상태를 관리하는 상태
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  
  // 무작위로 선택된 참가자를 저장하는 상태
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // 집게 상태 관리
  const [isTongnsDown, setIsTongsDown] = useState(false);

  // 전체 참가자 목록
  const scheduleParticipants = ['김범규', '김해수', '이지혜'];

  // 참가자 추가 모달을 여는 함수
  const addParticipant = () => {
    setIsModalOpen(true);
  };

  // 모달에서 확인 버튼을 눌렀을 때 실행되는 함수
  const handleConfirm = () => {
    // 선택된 참가자 중 아직 참가자 목록에 없는 새로운 참가자들을 추가
    const newParticipants = selectedParticipants.filter(participant => 
      !participants.some(p => p.name === participant)
    ).map(participant => ({ id: Date.now() + Math.random(), name: participant, imgSrc: 'default.jpg' }));
    
    // 선택된 참가자들 중 이미 있는 참가자들을 업데이트
    const updatedParticipants = participants.filter(participant => 
      selectedParticipants.includes(participant.name)
    );

    // 참가자 목록을 업데이트
    setParticipants([...updatedParticipants, ...newParticipants]);
    setIsModalOpen(false);
  };

  // "카드 뽑기" 버튼을 눌렀을 때 실행되는 함수
  const handleCardPick = () => {
    if (participants.length > 0) {
      // 집게 내려감
      setIsTongsDown(true);

      // 1.5초 후에 집게를 다시 올림
      setTimeout(() => {
        setIsTongsDown(false);
      }, 1500)

      // 무작위로 참가자 선택
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setSelectedParticipant(participants[randomIndex]);
        setIsResultModalOpen(true);
      }, 3000);
    }
  };

  return (
    <div className='game-container'>
      <h1>게임</h1>
      <div className='game-participants'>참여 인원</div>
      <div style={{ display: 'flex', alignItems: 'center'}} className='game-participants-list'>
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
        <img src={MachineTongsHead} className='game-machine-tongs-head' alt="head" />
        <img 
          src={MachineTongs} 
          className={`game-machine-tongs ${isTongnsDown ? 'tongs-down' : 'tongs-up'}`}
          alt="tongs" 
        />
        <button className='game-start-button' onClick={handleCardPick}>카드 뽑기</button>
      </div>
      <GameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirm}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
        scheduleParticipants={scheduleParticipants}
      />
      <ResultModal 
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        selectedParticipant={selectedParticipant}
      />
    </div>
  );
}

export default GameContainer;
