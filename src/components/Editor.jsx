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

  // Initialize robot state
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
    console.log('📋 Commands to execute:', blocklyCommands);
    
    if (!blocklyCommands || blocklyCommands.length === 0) {
      alert("🤖 Add some blocks first to make the robot move!");
      return;
    }
    
    // STORE COMMANDS AND START EXECUTION
    setCommands(blocklyCommands);
    setIsRunning(true);
    setChallengeStatus('running');
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setChallengeStatus('waiting');
    setCommands([]); // CLEAR COMMANDS
    
    // Reset robot to start position
    if (currentChallenge) {
      setRobotState({
        row: currentChallenge.start.r,
        col: currentChallenge.start.c,
        direction: currentChallenge.start.dir,
        stepCount: 0
      });
    }
  };

  const handleExecutionComplete = (success) => {
    setIsRunning(false);
    setChallengeStatus(success ? 'success' : 'failed');
    setCommands([]); // CLEAR COMMANDS AFTER EXECUTION
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr',
      gap: '10px',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      
      {/* Left Panel */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '3px solid #74b9ff',
        overflow: 'hidden',
        position: 'relative',
        height: 'calc(100vh - 20px)'
      }}>
        <button 
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#4ecdc4',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          🏠 Home
        </button>
        
        <BlocklyPanel 
          challengeId={challengeId}
          allowedBlocks={currentChallenge?.allowedBlocks}
          onCodeGenerated={() => {}} // Don't auto-execute
          isDisabled={isRunning}
        />
      </div>

      {/* Center */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '3px solid #fdcb6e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 20px)'
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

      {/* Right Panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: 'calc(100vh - 20px)'
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
