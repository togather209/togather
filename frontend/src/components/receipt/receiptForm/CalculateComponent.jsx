import React, { useState, useEffect } from 'react';
import './CalculateComponent.css';
import SelectParticipantsModal from './SelectParticipantsModal';
import AddButton from '../../../assets/icons/common/add.png';
import Button from '../../common/Button';

// CalculateComponent: 품목 분할 방식에 따라 정산을 관리하는 컴포넌트
function CalculateComponent({ items, receiptColor }) {
  // 상태 변수
  const [activeType, setActiveType] = useState('divide'); // 활성화된 계산 유형 추적
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 추적
  const [itemParticipants, setItemParticipants] = useState({}); // 'personal' 유형에 대한 품목별 참여자 추적
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // 현재 편집 중인 품목 인덱스 추적
  const [generalParticipants, setGeneralParticipants] = useState([]); // 'divide' 및 'all' 유형에 대한 참여자 추적

  // 계산 유형 변경 핸들러
  const handleCalculateType = (type) => {
    setItemParticipants({});
    setGeneralParticipants([]);
    setCurrentItemIndex(null);
    setActiveType(type);
  };

  // 참여자 선택 모달 열기 핸들러
  const handleOpenModal = (itemIndex) => {
    setCurrentItemIndex(itemIndex);
    setIsModalOpen(true);
  };

  // 모달에서 참여자 선택 핸들러
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

  // 활성화된 계산 유형에 따른 정산 계산
  const calculateSettlements = () => {
    const settlements = {};
    if (activeType === 'personal') {
      // 'personal' 유형에 대한 계산
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
      // 'divide' 유형에 대한 계산
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const share = Math.floor(totalAmount / generalParticipants.length);
      generalParticipants.forEach((participant) => {
        settlements[participant] = share;
      });
    } else if (activeType === 'all') {
      // 'all' 유형에 대한 계산
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const participant = generalParticipants[0];
      if (participant) {
        settlements[participant] = totalAmount;
      }
    }
    return settlements;
  };

  // 정산 결과 가져오기
  const settlements = calculateSettlements();

  // 모든 품목에 참여자가 태그되었는지 확인
  const allItemsTagged = activeType === 'personal'
    ? items.every((_, index) => itemParticipants[index] && itemParticipants[index].length > 0)
    : generalParticipants.length > 0;

  // 영수증 정보 등록 핸들러
  const handleRegister = () => {
    const receiptTempInfo = {
      color: receiptColor,
      items: items.map((item, index) => {
        let participants = itemParticipants[index] || [];
        if (activeType === 'divide') {
          participants = generalParticipants;
        } else if (activeType === 'all') {
          participants = generalParticipants;
        }
        return {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          participants: participants
        };
      })
    };

    // 전체 정보 전달
    console.log(receiptTempInfo);
  };

  // TODO : 참여자 불러오기
  const participants = ['김범규', '김해수', '이지혜']; // 예제 참여자 목록

  // 선택된 참여자가 있는지 확인
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
