import React from 'react';

export const BlocklyPanel = ({ challengeId, allowedBlocks, onCodeGenerated, isDisabled }) => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          color: '#2d3436', 
          marginBottom: '10px',
          fontSize: '20px'
        }}>
          🧩 Code Blocks
        </h3>
        <p style={{ 
          color: '#636e72', 
          fontSize: '14px',
          margin: 0
        }}>
          Drag blocks here to build your program!
        </p>
      </div>

      {/* Blockly Workspace Placeholder */}
      <div style={{
        flex: 1,
        background: '#f8f9fa',
        border: '3px dashed #74b9ff',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        position: 'relative'
      }}>
        {/* Temporary Block Palette */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#74b9ff', marginBottom: '15px', textAlign: 'center' }}>
            Available Blocks:
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            {(allowedBlocks || ['move', 'turn', 'repeat']).map(block => (
              <div
                key={block}
                style={{
                  background: block === 'move' ? '#4ecdc4' : 
                            block === 'turn' ? '#ff6b6b' : '#fdcb6e',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: isDisabled ? 'not-allowed' : 'grab',
                  opacity: isDisabled ? 0.5 : 1,
                  userSelect: 'none',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                {block === 'move' && '➡️ Move Forward'}
                {block === 'turn' && '🔄 Turn Right'} 
                {block === 'repeat' && '🔁 Repeat'}
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Area */}
        <div style={{
          background: 'white',
          border: '2px solid #ddd',
          borderRadius: '10px',
          width: '90%',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#95a5a6',
          fontSize: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
            <div>Blockly workspace coming soon!</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              Drag blocks here to create your program
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
