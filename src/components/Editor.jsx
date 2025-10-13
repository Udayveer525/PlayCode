import React, { useState, useEffect } from "react";
import { BlocklyPanel } from "./BlocklyPanel";
import { CanvasWrapper } from "./CanvasWrapper";
import { ControlPanel } from "./ControlPanel";
import { ChallengePanel } from "./ChallengePanel";
import challengeData from "../data/challenges.json";
import { GameModal } from "./GameModal";

export const Editor = ({ challengeId, onBackToHome }) => {
  // Add modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    actionText: "Continue",
  });

  const [isRunning, setIsRunning] = useState(false);
  const [commands, setCommands] = useState([]);
  const [blocksUsed, setBlocksUsed] = useState(0);
  const [robotState, setRobotState] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState("waiting");

  const currentChallenge = challengeData.challenges.find(
    (c) => c.id === challengeId
  );

  // Initialize robot state
  useEffect(() => {
    if (currentChallenge) {
      setRobotState({
        row: currentChallenge.start.r,
        col: currentChallenge.start.c,
        direction: currentChallenge.start.dir,
        stepCount: 0,
      });
    }
  }, [currentChallenge]);

  const handleRunCode = (blocklyCommands) => {
    console.log("📋 Commands to execute:", blocklyCommands);

    if (!blocklyCommands || blocklyCommands.length === 0) {
      setModalState({
        isOpen: true,
        type: "info",
        title: "Oops! Missing Blocks",
        message:
          "🧩 You need to add some code blocks first! Drag blocks from the left panel to create your robot's program.",
        actionText: "Got It!",
      });
      return;
    }

    // Count blocks used
    const blocksUsed = window.countBlocklyBlocks
      ? window.countBlocklyBlocks()
      : 0;
    console.log(
      `🔢 Blocks used: ${blocksUsed} / ${currentChallenge.maxBlocks}`
    );

    // Check if within block limit
    if (blocksUsed > currentChallenge.maxBlocks) {
      setModalState({
        isOpen: true,
        type: "info",
        title: "Too Many Blocks!",
        message: `🚫 You used ${blocksUsed} blocks, but the limit is ${currentChallenge.maxBlocks}! Try using the repeat block to make your code shorter.`,
        actionText: "Try Again",
      });
      return;
    }

    setCommands(blocklyCommands);
    setBlocksUsed(blocksUsed); // Store for display
    setIsRunning(true);
    setChallengeStatus("running");
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setChallengeStatus("waiting");
    setCommands([]); // CLEAR COMMANDS

    // Reset robot to start position
    if (currentChallenge) {
      setRobotState({
        row: currentChallenge.start.r,
        col: currentChallenge.start.c,
        direction: currentChallenge.start.dir,
        stepCount: 0,
      });
    }
  };

  const handleExecutionComplete = (success) => {
    setIsRunning(false);
    setChallengeStatus(success ? "success" : "failed");
    setCommands([]); // CLEAR COMMANDS AFTER EXECUTION

    // Save completed challenge to localStorage
    if (success) {
      const saved = localStorage.getItem("completedChallenges");
      const completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(challengeId)) {
        completed.push(challengeId);
        localStorage.setItem("completedChallenges", JSON.stringify(completed));
      }
    }

    if (success) {
      setModalState({
        isOpen: true,
        type: "success",
        title: "🎉 AMAZING! You Did It!",
        message:
          "🌟 Fantastic work! Your robot reached the treasure successfully! You're becoming a coding superstar! 🚀",
        actionText: "Play Again",
      });
    } else {
      setModalState({
        isOpen: true,
        type: "failure",
        title: "Oops! Try Again",
        message:
          "💪 Don't worry! Every great programmer makes mistakes. Check your code and try a different path to the treasure!",
        actionText: "Try Again",
      });
    }
  };

  const handleModalAction = () => {
    setModalState({ ...modalState, isOpen: false });
    // Auto-reset for failed attempts
    if (modalState.type === "failure") {
      handleReset();
    }
  };

  const handleModalClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const handleReset = () => {
    // Stop any running execution
    setIsRunning(false);
    setChallengeStatus("waiting");
    setCommands([]);

    // Reset robot to start position
    if (currentChallenge) {
      setRobotState({
        row: currentChallenge.start.r,
        col: currentChallenge.start.c,
        direction: currentChallenge.start.dir,
        stepCount: 0,
      });
    }

    // Clear the Blockly workspace
    if (window.blocklyWorkspace) {
      window.blocklyWorkspace.clear();
    }

    console.log("🔄 Challenge Reset Complete!");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr",
        gap: "10px",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "3px solid #74b9ff",
          overflow: "hidden",
          position: "relative",
          height: "calc(100vh - 20px)",
        }}
      >
        <button
          onClick={onBackToHome}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "#4ecdc4",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "10px",
            fontSize: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 10,
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
      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "20px",
          padding: "15px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "3px solid #fdcb6e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 20px)",
        }}
      >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "calc(100vh - 20px)",
        }}
      >
        <ControlPanel
          isRunning={isRunning}
          onRun={handleRunCode}
          onStop={handleStopExecution}
          onReset={handleReset}
          challengeId={challengeId}
        />

        <ChallengePanel
          challenge={currentChallenge}
          status={challengeStatus}
          blocksUsed={blocksUsed}
          maxBlocks={currentChallenge?.maxBlocks}
        />
      </div>

      <GameModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actionText={modalState.actionText}
        onAction={handleModalAction}
        onClose={handleModalClose}
      />
    </div>
  );
};
