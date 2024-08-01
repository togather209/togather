import React, { useState } from 'react';
import './ReceiptForm.css';
import BackButton from '../../common/BackButton';
import Design from './DesignComponent';
import Recognize from './RecognizeComponent';
import Caculate from './CalculateComponent';

function ReceiptRegistForm() {
  const [activeTab, setActiveTab] = useState('design');
  const [receiptItems, setReceiptItems] = useState([]);
  const [receiptColor, setReceiptColor] = useState('sky');

  const handleSetActiveTab = (tab, items = []) => {
    setActiveTab(tab);
    if(items.length > 0) {
      setReceiptItems(items);
    }
  }

  return (
    <div className="form-container">
      <header className='form-header'>
        <BackButton />
        <div className="form-title">어떤 영수증인가요?</div>
      </header>
      <div className='tab-container'>
        <div className='tabs'>
          <button 
            className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => {setActiveTab('design')}}
          >
            디자인
          </button>
          <button 
            className={`tab-button ${activeTab === 'recognize' ? 'active' : ''}`}
            onClick={() => {setActiveTab('recognize')}}
          >
            인식
          </button>
          <button 
            className={`tab-button ${activeTab === 'calculate' ? 'active' : ''}`}
            onClick={() => {setActiveTab('calculate')}}
          >
            정산
          </button>
        </div>
      </div>
      <div className='tab-content'>
        {activeTab === 'design' && <Design setActiveTab={setActiveTab} setReceiptColor={setReceiptColor} />}
        {activeTab === 'recognize' && <Recognize setActiveTab={handleSetActiveTab} />}
        {activeTab === 'calculate' && <Caculate setActiveTab={setActiveTab} items={receiptItems} receiptColor={receiptColor} />}
      </div>
    </div>
  )
}

export default ReceiptRegistForm;