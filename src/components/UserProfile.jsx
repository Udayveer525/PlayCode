import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const UserProfile = ({ isOpen, onClose, currentUser, onLogout }) => {
  const [userStats, setUserStats] = useState({
    challengesCompleted: 0,
    totalBlocks: 0,
    averageBlocks: 0,
    rank: 0,
    joinedDate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUserStats();
    }
  }, [isOpen, currentUser]);

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      // Get user's progress
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', currentUser.id);

      if (progressError) throw progressError;

      // Calculate stats
      const challengesCompleted = progressData?.length || 0;
      const totalBlocks = progressData?.reduce((sum, p) => sum + (p.blocks_used || 0), 0) || 0;
      const averageBlocks = challengesCompleted > 0 ? Math.round(totalBlocks / challengesCompleted) : 0;

      // Get user's rank from leaderboard
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('challenges_completed', { ascending: false });

      if (!leaderboardError) {
        const userRank = leaderboardData.findIndex(u => u.id === currentUser.id) + 1;
        setUserStats({
          challengesCompleted,
          totalBlocks,
          averageBlocks,
          rank: userRank || 0,
          joinedDate: currentUser.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
    setIsLoading(false);
  };

  const getProfileIcon = (username) => {
    // Generate consistent icon based on first letter
    const firstLetter = username.charAt(0).toUpperCase();
    const icons = {
      'A': '🦊', 'B': '🐻', 'C': '🐱', 'D': '🐶', 'E': '🦅',
      'F': '🐸', 'G': '🦒', 'H': '🐹', 'I': '🦎', 'J': '🦘',
      'K': '🐨', 'L': '🦁', 'M': '🐵', 'N': '🦉', 'O': '🐙',
      'P': '🐧', 'Q': '🦆', 'R': '🦝', 'S': '🐍', 'T': '🐯',
      'U': '🦄', 'V': '🦇', 'W': '🐺', 'X': '🦖', 'Y': '🦓',
      'Z': '🦒'
    };
    return icons[firstLetter] || '🎮';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    return '🎯';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '25px',
          padding: '0',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 30px',
            borderRadius: '25px 25px 0 0',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            ×
          </button>

          {/* Profile Icon */}
          <div
            style={{
              fontSize: '80px',
              marginBottom: '15px',
              background: 'rgba(255, 255, 255, 0.2)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto',
              backdropFilter: 'blur(10px)',
            }}
          >
            {getProfileIcon(currentUser.username)}
          </div>

          {/* Username */}
          <h2
            style={{
              margin: '0 0 5px 0',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            {currentUser.username}
          </h2>

          {/* Rank Badge */}
          {userStats.rank > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {getRankBadge(userStats.rank)} Rank #{userStats.rank}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div style={{ padding: '30px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
              <div>Loading stats...</div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  marginBottom: '25px',
                }}
              >
                {/* Challenges Completed */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '20px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                    {userStats.challengesCompleted}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                    🎯 Challenges
                  </div>
                </div>

                {/* Average Blocks */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    padding: '20px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                    {userStats.averageBlocks}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                    🧩 Avg Blocks
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '25px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 15px 0',
                    fontSize: '18px',
                    color: '#333',
                  }}
                >
                  🏆 Achievements
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {userStats.challengesCompleted >= 1 && (
                    <div
                      style={{
                        background: 'white',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      🎯 First Steps
                    </div>
                  )}
                  {userStats.challengesCompleted >= 3 && (
                    <div
                      style={{
                        background: 'white',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      🌟 Master Coder
                    </div>
                  )}
                  {userStats.rank <= 3 && userStats.rank > 0 && (
                    <div
                      style={{
                        background: 'white',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      🥇 Top 3 Player
                    </div>
                  )}
                  {userStats.challengesCompleted === 0 && (
                    <div
                      style={{
                        color: '#999',
                        fontSize: '14px',
                        padding: '10px',
                      }}
                    >
                      Complete challenges to unlock achievements! 🎮
                    </div>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#999',
                  marginBottom: '20px',
                }}
              >
                📅 Member since {formatDate(userStats.joinedDate)}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(238, 90, 111, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 111, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 111, 0.3)';
                }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
