import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript"; // Import the official generator

const initializeCustomBlocks = () => {
  // MOVE FORWARD Block
  Blockly.Blocks["move_forward"] = {
    init: function () {
      this.appendDummyInput().appendField("🚀 Move Forward");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#4ecdc4");
      this.setTooltip("Move the robot forward one step");
    },
  };

  // TURN RIGHT Block
  Blockly.Blocks["turn_right"] = {
    init: function () {
      this.appendDummyInput().appendField("🔄 Turn Right");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#ff6b6b");
      this.setTooltip("Turn the robot right");
    },
  };

  // TURN LEFT Block
  Blockly.Blocks["turn_left"] = {
    init: function () {
      this.appendDummyInput().appendField("↩️ Turn Left");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#a29bfe");
      this.setTooltip("Turn the robot left");
    },
  };

  // REPEAT Block
  Blockly.Blocks["repeat_times"] = {
    init: function () {
      this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("🔁 Repeat");
      this.appendStatementInput("DO").setCheck(null).appendField("times do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#fdcb6e");
      this.setTooltip("Repeat blocks multiple times");
    },
  };
};

const initializeCodeGenerators = () => {
  // Use the official JavaScript generator and add our custom blocks
  javascriptGenerator.forBlock["move_forward"] = function (block) {
    return '{"cmd": "move", "value": 1},\n';
  };

  javascriptGenerator.forBlock["turn_right"] = function (block) {
    return '{"cmd": "turn", "dir": "right"},\n';
  };

  javascriptGenerator.forBlock["turn_left"] = function (block) {
    return '{"cmd": "turn", "dir": "left"},\n';
  };

  // FIXED: Proper order handling for repeat block
  javascriptGenerator.forBlock["repeat_times"] = function (block) {
    const times =
      javascriptGenerator.valueToCode(
        block,
        "TIMES",
        javascriptGenerator.ORDER_ATOMIC
      ) || "2";
    const statements = javascriptGenerator.statementToCode(block, "DO");

    // Handle empty statements
    if (!statements.trim()) {
      return `{"cmd": "repeat", "times": ${times}, "body": []},\n`;
    }

    // Parse statements into individual commands
    const commands = statements.split(",\n").filter((cmd) => cmd.trim());
    return `{"cmd": "repeat", "times": ${times}, "body": [${commands.join(
      ", "
    )}]},\n`;
  };

  return javascriptGenerator;
};

// Count total blocks used (FIXED - don't count shadow blocks!)
const countBlocks = (workspace) => {
  if (!workspace) return 0;
  
  const topBlocks = workspace.getTopBlocks(false);
  let totalCount = 0;
  
  const countBlockRecursive = (block) => {
    if (!block) return 0;
    
    // Skip shadow blocks (like the number in repeat)
    if (block.isShadow()) return 0;
    
    let count = 1; // Count this block
    
    // Count child blocks (next in sequence)
    if (block.getNextBlock()) {
      count += countBlockRecursive(block.getNextBlock());
    }
    
    // Count nested blocks ONLY in statement inputs (not value inputs)
    const inputList = block.inputList;
    for (let input of inputList) {
      // Only count blocks in statement inputs (like "DO" in repeat)
      if (input.type === Blockly.INPUT_VALUE) {
        // Skip value inputs like the number in repeat
        continue;
      }
      
      if (input.connection && input.connection.targetBlock()) {
        count += countBlockRecursive(input.connection.targetBlock());
      }
    }
    
    return count;
  };
  
  topBlocks.forEach(block => {
    totalCount += countBlockRecursive(block);
  });
  
  return totalCount;
};

// Expose it to window for ControlPanel
window.countBlocklyBlocks = () => {
  return countBlocks(window.blocklyWorkspace);
};

export const BlocklyPanel = ({
  challengeId,
  allowedBlocks,
  onCodeGenerated,
  isDisabled,
}) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const generator = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      initializeCustomBlocks();
      generator.current = initializeCodeGenerators();

      // Only show blocks needed for this challenge
      const getBlocksForChallenge = () => {
        const blocks = [];

        if (allowedBlocks?.includes("move")) {
          blocks.push({ kind: "block", type: "move_forward" });
        }

        if (allowedBlocks?.includes("turn_right")) {
          blocks.push({ kind: "block", type: "turn_right" });
        }

        if (allowedBlocks?.includes("turn_left")) {
          blocks.push({ kind: "block", type: "turn_left" });
        }

        if (allowedBlocks?.includes("repeat")) {
          blocks.push({
            kind: "block",
            type: "repeat_times",
            inputs: {
              TIMES: {
                shadow: { type: "math_number", fields: { NUM: 3 } },
              },
            },
          });
        }

        return blocks;
      };

      // Simple toolbox
      const toolbox = {
        kind: "flyoutToolbox",
        contents: getBlocksForChallenge(),
      };

      // Kid-friendly workspace config
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        scrollbars: true,
        media: "https://unpkg.com/blockly/media/",
        trashcan: true,
        zoom: {
          controls: false,
          wheel: true,
          startScale: 1.0,
          maxScale: 1.3,
          minScale: 0.6,
        },
        grid: {
          spacing: 25,
          length: 1,
          colour: "#e8f4fd",
          snap: true,
        },
      });

      // FIXED: Only generate code on meaningful changes
      workspace.current.addChangeListener((event) => {
        if (
          event.type === Blockly.Events.BLOCK_MOVE ||
          event.type === Blockly.Events.BLOCK_CHANGE ||
          event.type === Blockly.Events.BLOCK_CREATE ||
          event.type === Blockly.Events.BLOCK_DELETE
        ) {
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
        console.log("📝 Generated commands:", commands);
        onCodeGenerated(commands);
      } catch (error) {
        console.error("Code generation error:", error);
        onCodeGenerated([]);
      }
    }
  };

  const parseCommands = (code) => {
    if (!code.trim()) return [];

    try {
      const cleanCode = code.replace(/,\s*$/, ""); // Remove trailing comma
      if (!cleanCode) return [];

      const commandsArray = eval(`[${cleanCode}]`);
      return commandsArray;
    } catch (error) {
      console.error("Parse commands error:", error);
      return [];
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Minimal Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "8px",
          padding: "6px 12px",
          background: "rgba(116, 185, 255, 0.1)",
          borderRadius: "12px",
        }}
      >
        <h3
          style={{
            color: "#74b9ff",
            margin: 0,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          🧩 Drag Blocks to Build Program
        </h3>
      </div>

      {/* HUGE Workspace */}
      <div
        ref={blocklyDiv}
        style={{
          flex: 1,
          minHeight: "450px",
          border: "3px solid #74b9ff",
          borderRadius: "15px",
          background: "#fafbfc",
          overflow: "hidden",
        }}
      />
    </div>
  );
};
