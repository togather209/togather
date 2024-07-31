import React, { useState } from "react";
import './ConnectReceiptScheduleModal.css';
import Close from '../../../assets/icons/common/close.png';

function ConnectReceiptScheduleModal({ onClose, onConfirm }) {
  const [expandedDays, setExpandedDays] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const toggleDaySection = (index) => {
    setExpandedDays(prev =>
      prev.includes(index) ? prev.filter(day => day !== index) : [...prev, index]
    );
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  }

  const handleConfirm = () => {
    onConfirm(selectedPlace);
    onClose();
  }

  // 임시 데이터
  const tempData = [
    {
      date: "2023/07/30",
      places: [
        { id: 1, name: "일미 닭갈비" },
        { id: 2, name: "네네 치킨 유성점" },
      ]
    },
    {
        date: "2023/07/31",
        places: [
          { id: 3, name: "시림 미술관" },
          { id: 4, name: "How Cafe" },
          { id: 5, name: "한화 이글스 파크" },
        ]
    }
  ];

  return (
    <div className="connect-schedule-modal-overlay">
      <div className="connect-schedule-modal-content">
        <img src={Close} className='connect-schedule-modal-close' onClick={onClose} />
        <div className="connect-schedule-modal-detail">
          <div className="connect-schedule-select">연결할 장소를 선택해주세요</div>
          {tempData.map((dayData, index) => (
            <div className="day-section" key={index}>
              <h3 onClick={() => toggleDaySection(index)}>
                {index + 1}일차 ({dayData.date.substr(5)})
              </h3>
              {expandedDays.includes(index) && (
                <div>
                  {dayData.places.map(place => (
                    <div key={place.id} className="place-item">
                      <input 
                        type="radio" 
                        id={`place${place.id}`} 
                        name="place" 
                        value={place.name} 
                        onChange={() => {handlePlaceSelect(place)}}
                      />
                      <label htmlFor={`place${place.id}`}>{place.name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          className={`connect-confirm-button ${selectedPlace ? 'active' : 'inactive'}`} 
          onClick={handleConfirm}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}

export default ConnectReceiptScheduleModal;
