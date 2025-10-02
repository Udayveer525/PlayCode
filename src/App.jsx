import React, { useState } from 'react';
import { Home } from './components/Home';
import { Editor } from './components/Editor';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState('c1_reach_treasure');

  const startChallenge = (challengeId = 'c1_reach_treasure') => {
    setSelectedChallenge(challengeId);
    setCurrentView('editor');
  };

  return (
    <div className="app">
      {currentView === 'home' ? (
        <Home onStartChallenge={startChallenge} />
      ) : (
        <Editor 
          challengeId={selectedChallenge}
          onBackToHome={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}

export default App;
