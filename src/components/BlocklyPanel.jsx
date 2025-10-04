import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript'; // Import the official generator

const initializeCustomBlocks = () => {
  // MOVE FORWARD Block
  Blockly.Blocks['move_forward'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🚀 Move Forward");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4ecdc4');
      this.setTooltip("Move the robot forward one step");
    }
  };

  // TURN RIGHT Block  
  Blockly.Blocks['turn_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔄 Turn Right");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ff6b6b');
      this.setTooltip("Turn the robot right");
    }
  };

  // REPEAT Block
  Blockly.Blocks['repeat_times'] = {
    init: function() {
      this.appendValueInput("TIMES")
          .setCheck("Number")
          .appendField("🔁 Repeat");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("times do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fdcb6e');
      this.setTooltip("Repeat blocks multiple times");
    }
  };
};

const initializeCodeGenerators = () => {
  // Use the official JavaScript generator and add our custom blocks
  javascriptGenerator.forBlock['move_forward'] = function(block) {
    return '{"cmd": "move", "value": 1},\n';
  };

  javascriptGenerator.forBlock['turn_right'] = function(block) {
    return '{"cmd": "turn", "dir": "right"},\n';
  };

  // FIXED: Proper order handling for repeat block
  javascriptGenerator.forBlock['repeat_times'] = function(block) {
    const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '2';
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    
    // Handle empty statements
    if (!statements.trim()) {
      return `{"cmd": "repeat", "times": ${times}, "body": []},\n`;
    }
    
    // Parse statements into individual commands
    const commands = statements.split(',\n').filter(cmd => cmd.trim());
    return `{"cmd": "repeat", "times": ${times}, "body": [${commands.join(', ')}]},\n`;
  };

  return javascriptGenerator;
};

export const BlocklyPanel = ({ challengeId, allowedBlocks, onCodeGenerated, isDisabled }) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const generator = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      initializeCustomBlocks();
      generator.current = initializeCodeGenerators();

      // Only show blocks needed for this challenge
      const getBlocksForChallenge = () => {
        const baseBlocks = [
          { "kind": "block", "type": "move_forward" },
          { "kind": "block", "type": "turn_right" }
        ];
        
        // Add repeat block if allowed
        if (allowedBlocks?.includes('repeat')) {
          baseBlocks.push({
            "kind": "block",
            "type": "repeat_times",
            "inputs": {
              "TIMES": {
                "shadow": { "type": "math_number", "fields": { "NUM": 3 } }
              }
            }
          });
        }
        
        return baseBlocks;
      };

      // Simple toolbox
      const toolbox = {
        "kind": "flyoutToolbox",
        "contents": getBlocksForChallenge()
      };

      // Kid-friendly workspace config
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        scrollbars: true,
        media: 'https://unpkg.com/blockly/media/',
        trashcan: true,
        zoom: {
          controls: false,
          wheel: true,
          startScale: 1.0,
          maxScale: 1.3,
          minScale: 0.6
        },
        grid: {
          spacing: 25,
          length: 1,
          colour: '#e8f4fd',
          snap: true
        }
      });

      // FIXED: Only generate code on meaningful changes
      workspace.current.addChangeListener((event) => {
        if (event.type === Blockly.Events.BLOCK_MOVE || 
            event.type === Blockly.Events.BLOCK_CHANGE ||
            event.type === Blockly.Events.BLOCK_CREATE ||
            event.type === Blockly.Events.BLOCK_DELETE) {
          if (onCodeGenerated) {
            generateCode();
          }
        }
      });

      // Store workspace reference for ControlPanel access
      window.blocklyWorkspace = workspace.current;
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        delete window.blocklyWorkspace;
      }
    };
  }, [challengeId, allowedBlocks]);

  const generateCode = () => {
    if (workspace.current && generator.current && onCodeGenerated) {
      try {
        const code = generator.current.workspaceToCode(workspace.current);
        const commands = parseCommands(code);
        console.log('📝 Generated commands:', commands);
        onCodeGenerated(commands);
      } catch (error) {
        console.error('Code generation error:', error);
        onCodeGenerated([]);
      }
    }
  };

  const parseCommands = (code) => {
    if (!code.trim()) return [];
    
    try {
      const cleanCode = code.replace(/,\s*$/, ''); // Remove trailing comma
      if (!cleanCode) return [];
      
      const commandsArray = eval(`[${cleanCode}]`);
      return commandsArray;
    } catch (error) {
      console.error('Parse commands error:', error);
      return [];
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px',
        padding: '6px 12px',
        background: 'rgba(116, 185, 255, 0.1)',
        borderRadius: '12px'
      }}>
        <h3 style={{
          color: '#74b9ff',
          margin: 0,
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🧩 Drag Blocks to Build Program
        </h3>
      </div>

      {/* HUGE Workspace */}
      <div 
        ref={blocklyDiv}
        style={{
          flex: 1,
          minHeight: '450px',
          border: '3px solid #74b9ff',
          borderRadius: '15px',
          background: '#fafbfc',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};
