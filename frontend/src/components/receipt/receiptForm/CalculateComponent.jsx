import React from 'react';
import './CalculateComponent.css';

function CalculateComponent() {
  return (
    <>
      <div className='calcuate-component-container'>
        <div className='calculate-type-tab'>
          <div>1/n</div>
          <div>개별</div>
          <div>몰아주기</div>
        </div>
        <div className='calculated-content-detail'>

        </div>
        <div className='calculated-result'>
          <div className='calculated-result-title'>

          </div>
          <div className='calculated-result-content'>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default CalculateComponent;