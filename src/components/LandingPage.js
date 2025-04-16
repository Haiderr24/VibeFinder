import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="content">
        <div className="logo">
          VibeFinder <span className="logo-icon">🔍</span>
        </div>
        <h1>Your mood. Your move.</h1>
        <h2>Find the vibe perfect for you.</h2>
        <button className="start-button" onClick={() => navigate('/vibes')}>
          Start Now
        </button>
      </div>
    </div>
  );
};

export default LandingPage; 