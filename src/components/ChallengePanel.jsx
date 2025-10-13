import React from 'react';

export const ChallengePanel = ({ challenge, status, blocksUsed, maxBlocks, snakeState }) => {
  const getStatusEmoji = () => {
    switch(status) {
      case 'success': return '🎉';
      case 'failed': return '😅';
      case 'running': return '⚡';
      default: return '🎯';
    }
  };

  const getStatusMessage = () => {
    switch(status) {
      case 'success': return 'Amazing! You did it!';
      case 'failed': return 'Try again, you got this!';
      case 'running': return 'Robot is moving...';
      default: return 'Ready to code!';
    }
  };

  const getStatusColor = () => {
    switch(status) {
      case 'success': return '#00b894';
      case 'failed': return '#e17055';
      case 'running': return '#fdcb6e';
      default: return '#74b9ff';
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      padding: '15px', // Reduced from 25px
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '3px solid #fdcb6e',
      flex: 1, // Take remaining space
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Compact Challenge Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h3 style={{ 
          color: '#2d3436', 
          marginBottom: '5px', // Reduced from 10px
          fontSize: '16px', // Reduced from 18px
          lineHeight: '1.2'
        }}>
          {challenge?.title || 'Loading Challenge...'}
        </h3>
        <p style={{ 
          color: '#636e72', 
          fontSize: '12px', // Reduced from 14px
          lineHeight: '1.3',
          margin: 0
        }}>
          {challenge?.description || 'Get ready for an exciting coding adventure!'}
        </p>
      </div>

      {/* Compact Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '6px' // Reduced from 8px
        }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d3436' }}>
            Blocks: {blocksUsed || 0} / {maxBlocks} blocks max
          </span>
          <span style={{ fontSize: '11px', color: '#636e72' }}>
            {maxBlocks - (blocksUsed || 0)} left
          </span>
        </div>
        
        <div style={{
          background: '#ecf0f1',
          borderRadius: '8px', // Reduced from 10px
          height: '6px', // Reduced from 8px
          overflow: 'hidden'
        }}>
          <div style={{
            background: blocksUsed > (maxBlocks || 10) ? '#e74c3c' : '#4ecdc4',
            height: '100%',
            width: `${Math.min(100, (blocksUsed / (maxBlocks)) * 100)}%`,
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Stars Counter */}
        <div style={{
          background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
          borderRadius: '15px',
          padding: '8px',
          textAlign: 'center',
          color: '#2d3436',
          boxShadow: '0 4px 15px rgba(253, 203, 110, 0.3)'
        }}>
          <p style={{
            fontSize: '12px',
            opacity: 0.8
          }}>
            ⭐ Stars Collected
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: 'bold',
            margin: 0
          }}>
            {snakeState?.collectedStars?.length || 0} / {challenge?.stars?.length || 0}
          </p>
        </div>

      {/* Compact AI Help Button */}
      <div style={{ textAlign: 'center' }}>
        <button style={{
          background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
          color: 'white',
          border: 'none',
          padding: '10px 16px', // Reduced padding
          borderRadius: '15px',
          fontSize: '13px', // Smaller font
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(155, 89, 182, 0.3)',
          width: '100%' // Full width for better accessibility
        }}>
          🤖 Ask AI Helper
        </button>
      </div>
    </div>
  );
};
