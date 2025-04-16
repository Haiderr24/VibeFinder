import React, { useState } from 'react';
import './VibeSelection.css';

const VibeSelection = () => {
  const [selectedVibe, setSelectedVibe] = useState(null);

  const vibeOptions = [
    { id: 'social', label: 'Social' },
    { id: 'productive', label: 'Productive' },
    { id: 'adventurous', label: 'Adventurous' },
    { id: 'chill', label: 'Chill' }
  ];

  const handleVibeSelect = (vibeId) => {
    setSelectedVibe(vibeId);
  };

  return (
    <div className="vibe-selection">
      <div className="vibe-content">
        <h1>Find Your Vibe.</h1>
        <div className="vibe-options">
          <div className="map-container">
            {/* Google Maps will be integrated here */}
            <div className="map-placeholder"></div>
          </div>
          <div className="options-panel">
            <h2>Choose your vibe</h2>
            <div className="toggle-list">
              {vibeOptions.map((vibe) => (
                <div 
                  key={vibe.id} 
                  className="toggle-option"
                >
                  <label className="toggle">
                    <input
                      type="radio"
                      name="vibe"
                      checked={selectedVibe === vibe.id}
                      onChange={() => handleVibeSelect(vibe.id)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">{vibe.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeSelection; 