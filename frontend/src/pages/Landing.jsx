import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingForm from '../components/landing/LandingForm';

function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <LandingForm />
    </div>
  );
}

export default Landing;