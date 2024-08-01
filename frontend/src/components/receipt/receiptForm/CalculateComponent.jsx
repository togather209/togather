import React, { useState, useEffect } from 'react';
import './CalculateComponent.css';
import SelectParticipantsModal from './SelectParticipantsModal';
import AddButton from '../../../assets/icons/common/add.png';
import Button from '../../common/Button';

function CalculateComponent({ items }) {
  const [activeType, setActiveType] = useState('divide');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParticipants, setItemParticipants] = useState({});
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [generalParticipants, setGeneralParticipants] = useState([]);

  const handleCalculateType = (type) => {
    setItemParticipants({});
    setGeneralParticipants([]);
    setCurrentItemIndex(null);
    setActiveType(type);
  };

  const handleOpenModal = (itemIndex) => {
    setCurrentItemIndex(itemIndex);
    setIsModalOpen(true);
  };

  const handleSelectParticipants = (selected) => {
    if (currentItemIndex !== null) {
      setItemParticipants((prev) => ({
        ...prev,
        [currentItemIndex]: selected
      }));
    } else {
      setGeneralParticipants(selected);
    }
    setIsModalOpen(false);
  };

  const calculateSettlements = () => {
    const settlements = {};
    if (activeType === 'personal') {
      Object.keys(itemParticipants).forEach((itemIndex) => {
        const item = items[itemIndex];
        const participants = itemParticipants[itemIndex] || [];
        const share = Math.floor(item.price / participants.length);
        participants.forEach((participant) => {
          if (!settlements[participant]) {
            settlements[participant] = 0;
          }
          settlements[participant] += share;
        });
      });
    } else if (activeType === 'divide') {
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const share = Math.floor(totalAmount / generalParticipants.length);
      generalParticipants.forEach((participant) => {
        settlements[participant] = share;
      });
    } else if (activeType === 'all') {
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const participant = generalParticipants[0];
      if (participant) {
        settlements[participant] = totalAmount;
      }
    }
    return settlements;
  };

  const settlements = calculateSettlements();

  const allItemsTagged = activeType === 'personal'
    ? items.every((_, index) => itemParticipants[index] && itemParticipants[index].length > 0)
    : generalParticipants.length > 0;

  const handleRegister = () => {
    console.log('Items:', items);
    Object.keys(itemParticipants).forEach((itemIndex) => {
      console.log(`Item ${itemIndex}:`, itemParticipants[itemIndex]);
    });
  };

  const participants = ['김범규', '김해수', '이지혜'];

  const haveParticipants = Object.keys(settlements).length > 0;
  
  return (
    <>
      <div className='calculate-component-container'>
        <div className='calculate-type-tab'>
          <button
            className={`calculate-type-button ${activeType === 'divide' ? 'active' : ''}`}
            onClick={() => handleCalculateType('divide')}
          >
            1/n
          </button>
          <button
            className={`calculate-type-button ${activeType === 'personal' ? 'active' : ''}`}
            onClick={() => handleCalculateType('personal')}
          >
            개별
          </button>
          <button
            className={`calculate-type-button ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => handleCalculateType('all')}
          >
            몰아주기
          </button>
        </div>
        <div className='select-participant-detail'>
          {activeType === 'personal' ? (
            <>
              <div className='select-participant-title'>품목 별 인원 선택</div>
              <table className='select-participant-table'>
                <thead>
                  <tr>
                    <th>품목</th>
                    <th>수량</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString()}원</td>
                      </tr>
                      <tr className='calculate-tag-list'>
                        <td colSpan='3' className="calculate-tagged-people">
                          <img 
                            src={AddButton} 
                            onClick={() => handleOpenModal(index)} 
                            className="add-participant-button" 
                            alt="Add" 
                          />
                          {itemParticipants[index]?.map((participant, idx) => (
                            <span key={idx} className="participant-badge">
                              {participant}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <button
              className='select-participant-title'
              onClick={() => handleOpenModal(null)}
            >
              인원 선택
            </button>
          )}
        </div>
        {haveParticipants && (
          <div className='calculated-result'>
            <div className='calculated-result-title'>
              정산 결과
            </div>
            <div className='calculated-result-content'>
              <table className="calculated-result-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>정산액</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(settlements).map((name, index) => (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>{settlements[name].toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Button 
          type={allItemsTagged ? 'purple' : 'gray'} 
          className='receipt-regist-button'
          onClick={handleRegister}
          disabled={!allItemsTagged}
        >
          등록
        </Button>
      </div>
      {isModalOpen && (
        <SelectParticipantsModal
          participants={participants}
          selectedParticipants={currentItemIndex === null ? generalParticipants : itemParticipants[currentItemIndex]}
          onSelect={handleSelectParticipants}
          onClose={() => setIsModalOpen(false)}
          isSingleSelect={activeType === 'all'}
        />
      )}
    </>
  );
}

export default CalculateComponent;
