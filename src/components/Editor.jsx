import React, { useState, useEffect } from 'react';
import { BlocklyPanel } from './BlocklyPanel';
import { CanvasWrapper } from './CanvasWrapper';
import { ControlPanel } from './ControlPanel';
import { ChallengePanel } from './ChallengePanel';
import challengeData from '../data/challenges.json';

export const Editor = ({ challengeId, onBackToHome }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [commands, setCommands] = useState([]);
  const [robotState, setRobotState] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState('waiting');
  
  const currentChallenge = challengeData.challenges.find(c => c.id === challengeId);

  // Initialize robot state based on challenge
  useEffect(() => {
    if (currentChallenge) {
      setRobotState({
        row: currentChallenge.start.r,
        col: currentChallenge.start.c,
        direction: currentChallenge.start.dir,
        stepCount: 0
      });
    }
  }, [currentChallenge]);

  const handleRunCode = (blocklyCommands) => {
    setCommands(blocklyCommands);
    setIsRunning(true);
    setChallengeStatus('running');
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setChallengeStatus('waiting');
    setRobotState({
      row: currentChallenge.start.r,
      col: currentChallenge.start.c,
      direction: currentChallenge.start.dir,
      stepCount: 0
    });
  };

  const handleExecutionComplete = (success) => {
    setIsRunning(false);
    setChallengeStatus(success ? 'success' : 'failed');
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gap: '10px', // Reduced from 15px
      padding: '10px', // Reduced from 15px
      boxSizing: 'border-box'
    }}>
      
      {/* Left Panel - Blockly */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '15px', // Reduced from 20px
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '3px solid #74b9ff',
        overflow: 'hidden',
        position: 'relative',
        height: 'calc(100vh - 20px)' // Ensure exact height
      }}>
        <button 
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#4ecdc4',
            color: 'white',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 10px rgba(78, 205, 196, 0.3)'
          }}
        >
          🏠
        </button>
        
        <BlocklyPanel 
          challengeId={challengeId}
          allowedBlocks={currentChallenge?.allowedBlocks}
          onCodeGenerated={handleRunCode}
          isDisabled={isRunning}
        />
      </div>

      {/* Center - Canvas */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '15px', // Reduced from 20px
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '3px solid #fdcb6e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 20px)' // Ensure exact height
      }}>
        <CanvasWrapper 
          challenge={currentChallenge}
          robotState={robotState}
          commands={commands}
          isRunning={isRunning}
          onStateChange={setRobotState}
          onExecutionComplete={handleExecutionComplete}
        />
      </div>

      {/* Right Panel - Controls & Challenge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Reduced from 15px
        height: 'calc(100vh - 20px)' // Ensure exact height
      }}>
        <ControlPanel 
          isRunning={isRunning}
          onRun={handleRunCode}
          onStop={handleStopExecution}
          challengeId={challengeId}
        />
        
        <ChallengePanel 
          challenge={currentChallenge}
          status={challengeStatus}
          stepCount={robotState?.stepCount || 0}
          maxSteps={currentChallenge?.maxSteps}
        />
      </div>
    </div>
  );
};
