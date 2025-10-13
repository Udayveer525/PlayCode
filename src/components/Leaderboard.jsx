import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Leaderboard = ({ onBack }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userJson = localStorage.getItem('codequest_user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Fetch leaderboard data (top 10 users by challenges completed)
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]);
      } else {
        console.log('✅ Leaderboard data:', data);
        setLeaderboardData(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setLeaderboardData([]);
    }
    setIsLoading(false);
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        padding: '40px 20px',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: '30px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid white',
            padding: '12px 24px',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          ← Back Home
        </button>

        <h1
          style={{
            fontSize: '48px',
            color: 'white',
            margin: '0',
            textAlign: 'center',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          🏆 Leaderboard
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            margin: '10px 0 0 0',
          }}
        >
          Top Code Quest Champions!
        </p>
      </div>

      {/* Leaderboard Container */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#667eea' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Loading leaderboard...
            </div>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎮</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              No players yet!
            </div>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              Be the first to complete a challenge!
            </div>
          </div>
        ) : (
          <div>
            {/* Leaderboard Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 150px 150px',
                padding: '15px 20px',
                background: '#f0f0f0',
                borderRadius: '10px',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#666',
                fontSize: '14px',
              }}
            >
              <div>Rank</div>
              <div>Player</div>
              <div style={{ textAlign: 'center' }}>Challenges</div>
              <div style={{ textAlign: 'right' }}>Last Active</div>
            </div>

            {/* Leaderboard Rows */}
            {leaderboardData.map((player, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUser && player.id === currentUser.id;

              return (
                <div
                  key={player.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 150px 150px',
                    padding: '20px',
                    background: isCurrentUser
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : rank <= 3
                      ? 'rgba(255, 215, 0, 0.1)'
                      : 'white',
                    color: isCurrentUser ? 'white' : '#333',
                    borderRadius: '15px',
                    marginBottom: '10px',
                    alignItems: 'center',
                    boxShadow: rank <= 3
                      ? '0 4px 15px rgba(255, 215, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentUser) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      rank <= 3
                        ? '0 4px 15px rgba(255, 215, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      fontSize: rank <= 3 ? '32px' : '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {getRankEmoji(rank)}
                  </div>

                  {/* Player Name */}
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>{player.username}</span>
                    {isCurrentUser && (
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Challenges Completed */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {player.challenges_completed || 0}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'normal',
                        opacity: 0.7,
                        marginTop: '2px',
                      }}
                    >
                      completed
                    </div>
                  </div>

                  {/* Last Active */}
                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: '13px',
                      opacity: 0.8,
                    }}
                  >
                    {formatDate(player.last_activity)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={fetchLeaderboard}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
          >
            🔄 Refresh Leaderboard
          </button>
        </div>
      </div>

      {/* Stats Footer */}
      {leaderboardData.length > 0 && (
        <div
          style={{
            maxWidth: '800px',
            margin: '30px auto 0',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
          }}
        >
          Showing top {leaderboardData.length} players • Total challenges available: 3
        </div>
      )}
    </div>
  );
};
