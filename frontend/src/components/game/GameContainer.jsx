import React, { useState } from 'react';
import Modal from './GameModal';
import './Game.css';
import Machine from '../../assets/game/machine.png';

function GameContainer() {
  const [participants, setParticipants] = useState([
      { id: 1, name: 'Cat 1', imgSrc: 'cat1.jpg' },
      { id: 2, name: 'Dog', imgSrc: 'dog.jpg' },
      { id: 3, name: 'Cat 2', imgSrc: 'cat2.jpg' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');

  const addParticipant = () => {
      setIsModalOpen(true);
  };

  const handleConfirm = () => {
      if (newParticipant.trim() !== '') {
          setParticipants([...participants, { id: Date.now(), name: newParticipant, imgSrc: 'default.jpg' }]);
      }
      setIsModalOpen(false);
      setNewParticipant('');
  };

  return (
    <div className='game-container'>
      <h1>누가 걸리게 될까요?</h1>
      <div className='people'>참여인원</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {participants.map(participant => (
            <div key={participant.id} style={{ width: 50, height: 50, borderRadius: '50%', margin: '0 5px' }}>
                <img src={participant.imgSrc} alt={participant.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
        ))}
        <div onClick={addParticipant} style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#d3d3d3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 24,
          cursor: 'pointer'
        }}>
          +
        </div>
      </div>
      <img src={Machine} className='machine'/>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirm}
        newParticipant={newParticipant}
        setNewParticipant={setNewParticipant}
      />
    </div>
  );
}

export default GameContainer;
