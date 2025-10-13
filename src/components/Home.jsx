import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from './UserProfile';
import roboImage from '../assets/images/robo.png';

export const Home = ({ onStartAdventure, onViewChallenges }) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already exists in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('codequest_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleStartClick = () => {
    if (!currentUser) {
      setShowNameInput(true);
    } else {
      onStartAdventure();
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your name!');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .single();

      let user;

      if (existingUser) {
        // User exists, use existing
        user = existingUser;
        console.log('✅ Welcome back:', user.username);
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ username: username.trim() }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          alert('Error creating user. Please try again!');
          setIsLoading(false);
          return;
        }

        user = newUser;
        console.log('✅ New user created:', user.username);
      }

      // Save to localStorage
      localStorage.setItem('codequest_user', JSON.stringify(user));
      setCurrentUser(user);
      setShowNameInput(false);
      onStartAdventure();
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again!');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('codequest_user');
    setCurrentUser(null);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* User badge if logged in */}
      {currentUser && (
        <div
          onClick={() => setShowProfile(true)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.25)',
            padding: '12px 20px',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer', // ADD THIS
            transition: 'all 0.3s ease', // ADD THIS
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>👤 {currentUser.username}</span>
        </div>
      )}

      {/* Profile Modal - ADD THIS */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Name Input Modal */}
      {showNameInput && !currentUser && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#667eea' }}>
              🎮 Welcome to Code Quest!
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Enter your name to start your coding adventure:
            </p>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  boxSizing: 'border-box',
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Creating...' : 'Start Adventure! 🚀'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameInput(false)}
                  disabled={isLoading}
                  style={{
                    background: '#ddd',
                    color: '#666',
                    border: 'none',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
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
        {/* Left Side */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            maxWidth: '500px',
          }}
        >
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
            🚀 Code Quest
          </h1>

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

          {/* Feature Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            {[
              { icon: '🧩', text: 'Easy blocks!' },
              { icon: '🎯', text: 'Missions!' },
              { icon: '✨', text: 'See code alive!' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  padding: '15px 10px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '5px' }}>
                  {feature.icon}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'white',
                    margin: '0',
                    fontWeight: '600',
                  }}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <button
              onClick={handleStartClick}
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
            >
              {currentUser ? '🎮 Continue' : '🎮 Start Adventure'}
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
            >
              📋 Leaderboard
            </button>
          </div>
        </div>

        {/* Right Side - Robot */}
        <div style={{ flex: '0 0 auto' }}>
          <div
            style={{
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

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        Made with 💜 for young coders
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};
