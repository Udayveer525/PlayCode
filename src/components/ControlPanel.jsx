import React from 'react';
import { javascriptGenerator } from 'blockly/javascript';


export const ControlPanel = ({ isRunning, onRun, onStop, challengeId }) => {
  const handleRunClick = () => {
    // Access the globally stored workspace
    const workspace = window.blocklyWorkspace;
    
    if (workspace) {
      try {
        // Generate code from workspace
        const code = javascriptGenerator.workspaceToCode(workspace);
        
        // Parse commands
        if (code.trim()) {
          const cleanCode = code.replace(/,\s*$/, '');
          const commandsArray = eval(`[${cleanCode}]`);
          console.log('🎮 Running commands:', commandsArray);
          onRun(commandsArray);
        } else {
          onRun([]);
        }
      } catch (error) {
        console.error('Error generating code:', error);
        onRun([]);
      }
    } else {
      console.log('📋 No workspace found');
      onRun([]);
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      padding: '25px', 
      borderRadius: '20px', 
      marginBottom: '15px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '3px solid #4ecdc4'
    }}>
      <h3 style={{ 
        color: '#2d3436', 
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '20px'
      }}>
        🎮 Control Panel
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={handleRunClick} 
          disabled={isRunning}
          style={{ 
            background: isRunning ? '#95a5a6' : 'linear-gradient(135deg, #4ecdc4, #45b7b8)', 
            color: 'white', 
            border: 'none', 
            padding: '15px 25px', 
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
          }}
        >
          {isRunning ? '⏸️ Running...' : '▶️ Run Code'}
        </button>
        
        <button 
          onClick={onStop}
          disabled={!isRunning}
          style={{ 
            background: !isRunning ? '#95a5a6' : 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 
            color: 'white', 
            border: 'none', 
            padding: '15px 25px', 
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: !isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
          }}
        >
          ⏹️ Stop
        </button>
        
        <button 
          style={{ 
            background: 'rgba(116, 185, 255, 0.2)', 
            color: '#74b9ff', 
            border: '2px solid #74b9ff', 
            padding: '12px 20px', 
            borderRadius: '15px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          💾 Save Progress
        </button>
      </div>
    </div>
  );
};
