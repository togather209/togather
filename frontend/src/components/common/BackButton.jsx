import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';
import backImage from '../../assets/icons/common/back.png';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className='back-button' onClick={() => navigate(-1)}>
      <img src={backImage} alt="Back" />
    </button>
  )
}

export default BackButton;