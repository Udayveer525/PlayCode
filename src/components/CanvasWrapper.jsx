import React, { useEffect, useRef, useState } from "react";
import { CommandInterpreter } from "../lib/commandInterpreter";
import robotImage from "../assets/images/roboFace.png";

export const CanvasWrapper = ({
  challenge,
  robotState,
  commands,
  isRunning,
  onStateChange,
  onExecutionComplete,
}) => {
  const canvasRef = useRef(null);
  const commandInterpreter = useRef(null);
  const animationFrame = useRef(null);
  const [currentRobotState, setCurrentRobotState] = useState(robotState);
  const isExecuting = useRef(false); // PREVENT MULTIPLE EXECUTIONS
  const robotImg = useRef(null);

  // Initialize command interpreter ONCE
  useEffect(() => {
    commandInterpreter.current = new CommandInterpreter(
      (newState) => {
        setCurrentRobotState(newState);
        onStateChange(newState);
      },
      (success) => {
        isExecuting.current = false; // RESET EXECUTION FLAG
        onExecutionComplete(success);
      }
    );

    // PRELOAD THE ROBOT IMAGE
    robotImg.current = new Image();
    robotImg.current.onload = () => {
      // Trigger redraw when image is loaded
      if (currentRobotState && challenge) {
        drawGrid();
      }
    };
    robotImg.current.src = robotImage;
  }, []); // EMPTY DEPENDENCY ARRAY

  // Update canvas when state changes
  useEffect(() => {
    if (currentRobotState && challenge) {
      drawGrid();
    }
  }, [currentRobotState, challenge]);

  // FIXED: Execute commands only once per run
  useEffect(() => {
    if (
      isRunning &&
      commands &&
      commands.length > 0 &&
      commandInterpreter.current &&
      !isExecuting.current
    ) {
      console.log("🚀 SINGLE execution with commands:", commands);
      isExecuting.current = true; // PREVENT MULTIPLE EXECUTIONS

      commandInterpreter.current.setChallenge(challenge);
      commandInterpreter.current.setRobotState(currentRobotState);
      commandInterpreter.current.executeCommands(commands);
    } else if (!isRunning && commandInterpreter.current) {
      commandInterpreter.current.stop();
      isExecuting.current = false;
    }
  }, [isRunning]); // ONLY DEPEND ON isRunning, NOT commands

  // Update robot state for resets
  useEffect(() => {
    if (robotState && !isRunning) {
      setCurrentRobotState(robotState);
    }
  }, [robotState, isRunning]);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas || !challenge) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = challenge.grid || { rows: 5, cols: 5 };
    const cellSize =
      Math.min(canvas.width / gridSize.cols, canvas.height / gridSize.rows) - 4;
    const offsetX = (canvas.width - cellSize * gridSize.cols) / 2;
    const offsetY = (canvas.height - cellSize * gridSize.rows) / 2;

    // Draw grid
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const isEvenCell = (row + col) % 2 === 0;
        ctx.fillStyle = isEvenCell ? "#ffffff" : "#f1f3f4";
        ctx.fillRect(
          offsetX + col * cellSize,
          offsetY + row * cellSize,
          cellSize,
          cellSize
        );
      }
    }

    // Draw grid lines
    ctx.strokeStyle = "#dee2e6";
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
    if (challenge.goal) {
      const goalX = offsetX + challenge.goal.c * cellSize;
      const goalY = offsetY + challenge.goal.r * cellSize;

      ctx.fillStyle = "#ffd700";
      ctx.fillRect(goalX + 4, goalY + 4, cellSize - 8, cellSize - 8);

      ctx.font = `${cellSize * 0.5}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#2d3436";
      ctx.fillText("💎", goalX + cellSize / 2, goalY + cellSize / 2);
    }

    // Draw robot
    // FIXED: Draw robot with proper rotation
    if (currentRobotState && robotImg.current && robotImg.current.complete) {
      const robotX = offsetX + currentRobotState.col * cellSize;
      const robotY = offsetY + currentRobotState.row * cellSize;
      const robotSize = cellSize * 0.8;

      // Save the current context
      ctx.save();

      // Move to robot center for rotation
      ctx.translate(robotX + cellSize / 2, robotY + cellSize / 2);

      // Rotate based on direction
      let rotation = 0;
      switch (currentRobotState.direction) {
        case "up":
          rotation = 0;
          break;
        case "right":
          rotation = Math.PI / 2;
          break;
        case "down":
          rotation = Math.PI;
          break;
        case "left":
          rotation = -Math.PI / 2;
          break;
      }
      ctx.rotate(rotation);

      // Draw the robot image centered
      ctx.drawImage(
        robotImg.current,
        -robotSize / 2,
        -robotSize / 2,
        robotSize,
        robotSize
      );

      // Restore the context
      ctx.restore();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          textAlign: "center",
          background: isRunning
            ? "linear-gradient(135deg, #4ecdc4, #45b7b8)"
            : "linear-gradient(135deg, #ff6b6b, #ee5a52)",
          color: "white",
          padding: "12px 20px",
          borderRadius: "20px",
          boxShadow: `0 6px 25px ${
            isRunning ? "rgba(78, 205, 196, 0.4)" : "rgba(255, 107, 107, 0.3)"
          }`,
          transition: "all 0.3s ease",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          {isRunning
            ? "⚡ Robot Moving!"
            : challenge?.title || "🎮 Loading Adventure..."}
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: "12px", opacity: 0.9 }}>
          {isRunning
            ? "Watch your code execute!"
            : challenge?.description || "Get ready!"}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        style={{
          border: "4px solid #74b9ff",
          borderRadius: "15px",
          background: "white",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      />

      <div
        style={{
          marginTop: "8px",
          textAlign: "center",
          fontSize: "12px",
          color: "#2d3436",
          fontWeight: "bold",
        }}
      >
        <img
          src={robotImage}
          alt="Robot Logo"
          style={{
            height: "30px",
            width: "30px",
            verticalAlign: "middle",
            marginRight: "8px",
          }}
        />
        Robot • 💎 Treasure • {isRunning ? "⚡ Executing!" : "⭐ Ready!"}
      </div>
    </div>
  );
};
