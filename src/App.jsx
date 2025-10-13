import React, { useState } from 'react';
import { Home } from './components/Home';
import { Editor } from './components/Editor';
import { ChallengeList } from './components/ChallengeList';
import challengeData from './data/challenges.json';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Get next uncompleted challenge
  const getNextChallenge = () => {
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    
    // Find first uncompleted challenge
    for (let challenge of challengeData.challenges) {
      if (!completed.includes(challenge.id)) {
        return challenge.id;
      }
    }
    
    // If all completed, return first challenge
    return challengeData.challenges[0].id;
  };

  const handleStartAdventure = () => {
    const nextChallenge = getNextChallenge();
    setSelectedChallenge(nextChallenge);
    setCurrentView('editor');
  };

  const handleViewChallenges = () => {
    setCurrentView('challengeList');
  };

  const handleSelectChallenge = (challengeId) => {
    setSelectedChallenge(challengeId);
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedChallenge(null);
  };

  return (
    <>
      {currentView === 'home' && (
        <Home 
          onStartAdventure={handleStartAdventure}
          onViewChallenges={handleViewChallenges}
        />
      )}
      
      {currentView === 'challengeList' && (
        <ChallengeList
          onSelectChallenge={handleSelectChallenge}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentView === 'editor' && selectedChallenge && (
        <Editor 
          challengeId={selectedChallenge}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;
