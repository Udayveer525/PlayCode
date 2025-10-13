import React from 'react';
import '../styles/Home.css';
import roboImage from '../assets/images/robo.png';

export const Home = ({ onStartAdventure, onViewChallenges }) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden', // Prevent scrolling
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* Content Container - Centered */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
          maxWidth: '1100px',
          width: '90%',
        }}
      >
        {/* Left Side - Text Content */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            maxWidth: '500px',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0',
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.2',
            }}
          >
            PlayCode
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: '0',
              lineHeight: '1.4',
            }}
          >
            Learn coding through epic adventures! 🌟
          </p>

          {/* Features Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '15px 10px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '5px' }}>🧩</div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'white',
                  margin: '0',
                  fontWeight: '600',
                }}
              >
                Easy block coding!
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '15px 10px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '5px' }}>🎯</div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'white',
                  margin: '0',
                  fontWeight: '600',
                }}
              >
                Complete missions!
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '15px 10px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '5px' }}>✨</div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'white',
                  margin: '0',
                  fontWeight: '600',
                }}
              >
                See code alive!
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '15px',
            }}
          >
            <button
              onClick={onStartAdventure}
              style={{
                flex: '1',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 28px',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 87, 108, 0.4)',
                transition: 'all 0.3s ease',
                fontFamily: "'Comic Sans MS', cursive, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(245, 87, 108, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
              }}
            >
              🎮 Start Adventure
            </button>

            <button
              onClick={onViewChallenges}
              style={{
                flex: '1',
                background: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                border: '2px solid white',
                padding: '16px 28px',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                fontFamily: "'Comic Sans MS', cursive, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.35)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📋 View Challenges
            </button>
          </div>
        </div>

        {/* Right Side - Robot Image */}
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '350px',
              height: '350px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src={roboImage}
              alt="Code Quest Robot"
              style={{
                width: '280px',
                height: '280px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
                animation: 'float 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
        }}
      >
        Made with 💜 for young coders
      </div>

      {/* Floating Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  );
};