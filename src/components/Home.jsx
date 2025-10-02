import React from 'react';
import '../styles/Home.css';
import roboImage from '../assets/images/robo.png';

export const Home = ({ onStartChallenge }) => {
  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1">🎮</div>
        <div className="shape shape-2">⭐</div>
        <div className="shape shape-3">🚀</div>
        <div className="shape shape-4">💎</div>
        <div className="shape shape-5">🎯</div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Header */}
          <div className="home-header">
            <div className="logo-section">
              <h1 className="app-title">
                <span className="play-text">Play</span>
                <span className="code-text">Code</span>
              </h1>
            </div>
            <p className="tagline">Learn coding through epic adventures! 🌟</p>
          </div>

          {/* Hero Section */}
        <div className="hero-section">
          <div className="robot-character">
            <div><img src={roboImage} alt="Robot Logo" className="logo-icon" /></div>
            <div className="speech-bubble">
              Ready for some coding fun? Let's go! 
            </div>
          </div>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">🧩</div>
              <h3>Drag & Drop</h3>
              <p>Easy block coding!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Fun Challenges</h3>
              <p>Complete missions!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Magic</h3>
              <p>See code come alive!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button 
            className="start-btn primary-btn"
            onClick={() => onStartChallenge()}
          >
            Start Adventure!
          </button>
        
          <button className="demo-btn secondary-btn">
            View Challenges
          </button>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Challenges</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Fun</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">🎉</div>
            <div className="stat-label">Rewards</div>
          </div>
        </div>
      </div>
    </div>
  );
};
