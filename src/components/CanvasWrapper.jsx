import React, { useEffect, useRef } from 'react';

export const CanvasWrapper = ({ 
  challenge, 
  robotState, 
  commands, 
  isRunning, 
  onStateChange, 
  onExecutionComplete 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && challenge) {
      drawGrid();
    }
  }, [challenge, robotState]);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gridSize = challenge?.grid || { rows: 5, cols: 5 };
    const cellSize = Math.min(canvas.width / gridSize.cols, canvas.height / gridSize.rows);
    const offsetX = (canvas.width - cellSize * gridSize.cols) / 2;
    const offsetY = (canvas.height - cellSize * gridSize.rows) / 2;
    
    // Draw grid lines
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 2;
    
    for (let i = 0; i <= gridSize.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * cellSize);
      ctx.lineTo(offsetX + gridSize.cols * cellSize, offsetY + i * cellSize);
      ctx.stroke();
    }
    
    for (let j = 0; j <= gridSize.cols; j++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + j * cellSize, offsetY);
      ctx.lineTo(offsetX + j * cellSize, offsetY + gridSize.rows * cellSize);
      ctx.stroke();
    }
    
    // Draw goal
    if (challenge?.goal) {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(
        offsetX + challenge.goal.c * cellSize + 5,
        offsetY + challenge.goal.r * cellSize + 5,
        cellSize - 10,
        cellSize - 10
      );
      
      // Add treasure emoji
      ctx.font = `${cellSize * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#2d3436';
      ctx.fillText(
        '💎',
        offsetX + challenge.goal.c * cellSize + cellSize / 2,
        offsetY + challenge.goal.r * cellSize + cellSize * 0.7
      );
    }
    
    // Draw robot
    if (robotState) {
      ctx.fillStyle = '#3498db';
      ctx.fillRect(
        offsetX + robotState.col * cellSize + 10,
        offsetY + robotState.row * cellSize + 10,
        cellSize - 20,
        cellSize - 20
      );
      
      // Add robot emoji
      ctx.font = `${cellSize * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#2d3436';
      ctx.fillText(
        '🤖',
        offsetX + robotState.col * cellSize + cellSize / 2,
        offsetY + robotState.row * cellSize + cellSize * 0.65
      );
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Compact Challenge Title */}
      <div style={{
        marginBottom: '12px', // Reduced from 20px
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
        color: 'white',
        padding: '12px 20px', // Reduced from 15px 25px
        borderRadius: '20px', // Reduced from 25px
        boxShadow: '0 6px 25px rgba(255, 107, 107, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: '20px', // Reduced from 24px
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          {challenge?.title || '🎮 Loading Adventure...'}
        </h2>
        <p style={{ 
          margin: '3px 0 0 0', // Reduced from 5px
          fontSize: '12px', // Reduced from 14px
          opacity: 0.9
        }}>
          {challenge?.description || 'Get ready for coding fun!'}
        </p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400} // Reduced from 450
        height={400} // Reduced from 450
        style={{
          border: '4px solid #74b9ff',
          borderRadius: '15px',
          background: 'white',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      <div style={{
        marginTop: '8px', // Reduced from 15px
        textAlign: 'center',
        color: '#2d3436',
        fontSize: '12px', // Reduced from 14px
        fontWeight: 'bold'
      }}>
        🤖 Robot • 💎 Treasure • {isRunning ? '⚡ Running' : '⭐ Ready!'}
      </div>
    </div>
  );
};
