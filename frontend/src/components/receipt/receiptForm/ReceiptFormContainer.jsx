import React, { useState } from 'react';
import './ReceiptForm.css';
import BackButton from '../../common/BackButton';
import Design from './DesignComponent';
import RecognizeComponent from './RecognizeComponent';

function ReceiptRegistForm() {
  const [activeTab, setActiveTab] = useState('design');

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
        {activeTab === 'design' && <Design />}
        {activeTab === 'recognize' && <RecognizeComponent />}
      </div>
    </div>
  )
}

export default ReceiptRegistForm;