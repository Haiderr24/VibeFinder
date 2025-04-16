import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import VibeSelection from './components/VibeSelection';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vibes" element={<VibeSelection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;