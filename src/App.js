import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
import LandingPage from './components/LandingPage';
import VibeSelection from './components/VibeSelection';
import PlaceDetail from './components/PlaceDetail';



function App() {

  return (
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vibes" element={<VibeSelection />} />
          <Route path="/place/:placeId" element={<PlaceDetail />} />{}
        </Routes>
      </div>
    </Router>
  );

  
}

export default App;