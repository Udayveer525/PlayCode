import React, { useState, useEffect } from "react";
import challengeData from "../data/challenges.json";

export const ChallengeList = ({ onSelectChallenge, onBackToHome }) => {
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Load completed challenges from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("completedChallenges");
    if (saved) {
      setCompletedChallenges(JSON.parse(saved));
    }
  }, []);

  const isCompleted = (challengeId) => {
    return completedChallenges.includes(challengeId);
  };

  // Check if challenge is unlocked
  const isUnlocked = (index) => {
    // First challenge is always unlocked
    if (index === 0) return true;

    // Other challenges unlock after completing previous one
    const previousChallenge = challengeData.challenges[index - 1];
    return completedChallenges.includes(previousChallenge.id);
  };

  const handleChallengeClick = (challenge, index) => {
    if (isUnlocked(index)) {
      onSelectChallenge(challenge.id);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy":
        return "#00b894";
      case "medium":
        return "#fdcb6e";
      case "hard":
        return "#e17055";
      default:
        return "#74b9ff";
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      padding: '40px 20px',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        textAlign: 'center'
      }}>
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid white',
            padding: '10px 20px',
            borderRadius: '15px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ← Back Home
        </button>

        <h1 style={{
          color: 'white',
          fontSize: '48px',
          margin: '0 0 15px 0',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)'
        }}>
          🎮 All Challenges
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '18px',
          margin: 0
        }}>
          Complete challenges to unlock new ones! 🔓
        </p>
      </div>

      {/* Challenge Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px',
        padding: '0 20px'
      }}>
        {challengeData.challenges.map((challenge, index) => {
          const completed = isCompleted(challenge.id);
          const unlocked = isUnlocked(index);
          
          return (
            <div
              key={challenge.id}
              style={{
                background: unlocked ? 'rgba(255, 255, 255, 0.95)' : 'rgba(149, 165, 166, 0.5)',
                borderRadius: '25px',
                padding: '25px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                border: completed ? '4px solid #00b894' : unlocked ? '4px solid transparent' : '4px solid #95a5a6',
                transition: 'all 0.3s ease',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                position: 'relative',
                overflow: 'hidden',
                filter: unlocked ? 'none' : 'grayscale(80%)',
                opacity: unlocked ? 1 : 0.6
              }}
              onClick={() => handleChallengeClick(challenge, index)}
              onMouseOver={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
                }
              }}
            >
              {/* Locked Overlay */}
              {!unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '64px',
                  zIndex: 10
                }}>
                  🔒
                </div>
              )}

              {/* Completed Badge */}
              {completed && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#00b894',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(0, 184, 148, 0.3)'
                }}>
                  ✓ Completed
                </div>
              )}

              {/* Challenge Number */}
              <div style={{
                background: unlocked ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#95a5a6',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '15px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}>
                {index + 1}
              </div>

              {/* Title */}
              <h3 style={{
                color: unlocked ? '#2d3436' : '#636e72',
                fontSize: '22px',
                margin: '0 0 10px 0',
                lineHeight: '1.3'
              }}>
                {challenge.title}
              </h3>

              {/* Description */}
              <p style={{
                color: unlocked ? '#636e72' : '#95a5a6',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '0 0 20px 0'
              }}>
                {unlocked ? challenge.description : 'Complete the previous challenge to unlock!'}
              </p>

              {/* Stats Row */}
              {unlocked && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: 'rgba(116, 185, 255, 0.15)',
                    color: '#0984e3',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🧩 {challenge.maxBlocks} blocks max
                  </div>
                  
                  <div style={{
                    background: `${getDifficultyColor(challenge.difficulty || 'easy')}20`,
                    color: getDifficultyColor(challenge.difficulty || 'easy'),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    ⭐ {challenge.difficulty || 'Easy'}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button 
                disabled={!unlocked}
                style={{
                  width: '100%',
                  background: !unlocked 
                    ? '#95a5a6'
                    : completed 
                      ? 'linear-gradient(135deg, #00b894, #00cec9)' 
                      : 'linear-gradient(135deg, #4ecdc4, #45b7b8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                }}
              >
                {!unlocked ? '🔒 Locked' : completed ? '🎉 Play Again' : '▶️ Start Challenge'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0 auto',
        textAlign: 'center',
        padding: '25px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        <p style={{
          color: 'white',
          fontSize: '18px',
          margin: 0,
          fontWeight: 'bold'
        }}>
          🏆 Progress: {completedChallenges.length} / {challengeData.challenges.length} Challenges Completed
        </p>
      </div>
    </div>
  );
};
