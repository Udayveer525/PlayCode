import React, { useEffect, useRef, useState } from "react";
import { CommandInterpreter } from "../lib/commandInterpreter";
import snakeHeadImg from "../assets/images/snakeHead.png"; // Your snake head image
import snakeBodyImg from "../assets/images/snakeBody.png"; // Your snake body segment image
import starImg from "../assets/images/star.png"; // Star image
import stoneImg from "../assets/images/stone.png";

export const CanvasWrapper = ({
  challenge,
  snakeState,
  commands,
  isRunning,
  onStateChange,
  onExecutionComplete,
}) => {
  const canvasRef = useRef(null);
  const commandInterpreter = useRef(null);
  const [currentSnakeState, setCurrentSnakeState] = useState(snakeState);
  const isExecuting = useRef(false);

  // Image refs
  const snakeHeadImage = useRef(null);
  const snakeBodyImage = useRef(null);
  const starImage = useRef(null);
  const stoneImage = useRef(null);

  // Track if all images are loaded
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedCount = useRef(0);

  // Preload all images
  useEffect(() => {
    const totalImages = 4;
    loadedCount.current = 0;

    const checkAllLoaded = () => {
      loadedCount.current++;
      console.log(`✅ Image loaded: ${loadedCount.current}/${totalImages}`);
      
      if (loadedCount.current === totalImages) {
        setImagesLoaded(true);
        console.log('🎨 All images loaded! Ready to render.');
      }
    };

    // Snake Head
    snakeHeadImage.current = new window.Image();
    snakeHeadImage.current.onload = checkAllLoaded;
    snakeHeadImage.current.onerror = () => {
      console.warn('⚠️ Snake head image failed to load');
      checkAllLoaded(); // Still count it so we don't hang
    };
    snakeHeadImage.current.src = snakeHeadImg;

    // Snake Body
    snakeBodyImage.current = new window.Image();
    snakeBodyImage.current.onload = checkAllLoaded;
    snakeBodyImage.current.onerror = () => {
      console.warn('⚠️ Snake body image failed to load');
      checkAllLoaded();
    };
    snakeBodyImage.current.src = snakeBodyImg;

    // Star
    starImage.current = new window.Image();
    starImage.current.onload = checkAllLoaded;
    starImage.current.onerror = () => {
      console.warn('⚠️ Star image failed to load');
      checkAllLoaded();
    };
    starImage.current.src = starImg;

    // Stone
    stoneImage.current = new window.Image();
    stoneImage.current.onload = checkAllLoaded;
    stoneImage.current.onerror = () => {
      console.warn('⚠️ Stone image failed to load');
      checkAllLoaded();
    };
    stoneImage.current.src = stoneImg;
  }, []);

  // Initialize command interpreter ONCE
  useEffect(() => {
    commandInterpreter.current = new CommandInterpreter(
      (newState) => {
        setCurrentSnakeState(newState);
        onStateChange(newState);
      },
      (success) => {
        isExecuting.current = false;
        onExecutionComplete(success);
      }
    );
  }, []);

  // Update canvas when state changes - BUT ONLY IF IMAGES ARE LOADED
  useEffect(() => {
    if (currentSnakeState && challenge && imagesLoaded) {
      drawGrid();
    }
  }, [currentSnakeState, challenge, imagesLoaded]);

  // Execute commands
  useEffect(() => {
    if (
      isRunning &&
      commands &&
      commands.length > 0 &&
      commandInterpreter.current &&
      !isExecuting.current
    ) {
      console.log("🚀 Executing commands:", commands);
      isExecuting.current = true;
      commandInterpreter.current.setChallenge(challenge);
      commandInterpreter.current.setSnakeState(currentSnakeState);
      commandInterpreter.current.executeCommands(commands);
    } else if (!isRunning && commandInterpreter.current) {
      commandInterpreter.current.stop();
      isExecuting.current = false;
    }
  }, [isRunning]);

  // Update snake state for resets
  useEffect(() => {
    if (snakeState && !isRunning) {
      setCurrentSnakeState(snakeState);
    }
  }, [snakeState, isRunning]);

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

    // Draw grid cells (checkerboard)
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

    // Draw obstacles (stones)
    if (challenge.obstacles && challenge.obstacles.length > 0) {
      challenge.obstacles.forEach((obstacle) => {
        const obstX = offsetX + obstacle.c * cellSize;
        const obstY = offsetY + obstacle.r * cellSize;

        // Images are guaranteed loaded now
        if (stoneImage.current.complete) {
          ctx.drawImage(
            stoneImage.current,
            obstX + cellSize * 0.05,
            obstY + cellSize * 0.05,
            cellSize * 0.9,
            cellSize * 0.9
          );
        }
      });
    }

    // Draw stars (uncollected ones)
    if (challenge.stars && challenge.stars.length > 0) {
      challenge.stars.forEach((star) => {
        const starKey = `${star.r}-${star.c}`;
        const isCollected = currentSnakeState?.collectedStars?.includes(starKey);

        if (!isCollected) {
          const starX = offsetX + star.c * cellSize;
          const starY = offsetY + star.r * cellSize;

          if (starImage.current.complete) {
            ctx.save();
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 15;
            ctx.drawImage(
              starImage.current,
              starX + cellSize * 0.1,
              starY + cellSize * 0.1,
              cellSize * 0.8,
              cellSize * 0.8
            );
            ctx.restore();
          }
        }
      });
    }

    // Draw snake body segments FIRST (so head is on top)
    if (
      currentSnakeState &&
      currentSnakeState.body &&
      currentSnakeState.body.length > 0
    ) {
      currentSnakeState.body.forEach((segment) => {
        const bodyX = offsetX + segment.c * cellSize;
        const bodyY = offsetY + segment.r * cellSize;

        if (snakeBodyImage.current.complete) {
          const bodySize = cellSize * 0.9;
          ctx.drawImage(
            snakeBodyImage.current,
            bodyX + (cellSize - bodySize) / 2,
            bodyY + (cellSize - bodySize) / 2,
            bodySize,
            bodySize
          );
        }
      });
    }

    // Draw snake head (with rotation)
    if (currentSnakeState) {
      const snakeX = offsetX + currentSnakeState.col * cellSize;
      const snakeY = offsetY + currentSnakeState.row * cellSize;

      ctx.save();
      ctx.translate(snakeX + cellSize / 2, snakeY + cellSize / 2);

      let rotation = 0;
      switch (currentSnakeState.direction) {
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

      if (snakeHeadImage.current.complete) {
        const headSize = cellSize * 0.9;
        ctx.drawImage(
          snakeHeadImage.current,
          -headSize / 2,
          -headSize / 2,
          headSize,
          headSize
        );
      }

      ctx.restore();
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        border: "3px solid #dfe6e9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {/* Show loading state while images load */}
      {!imagesLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            color: "#667eea",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          🎨 Loading game assets...<br />
          <span style={{ fontSize: "16px", opacity: 0.7 }}>
            {loadedCount.current}/4 loaded
          </span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        style={{
          border: "3px solid #74b9ff",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(116, 185, 255, 0.2)",
          opacity: imagesLoaded ? 1 : 0.3, // Fade in when loaded
          transition: "opacity 0.5s ease",
        }}
      />
      <p
        style={{
          fontSize: "16px",
          color: "#636e72",
          margin: 0,
          textAlign: "center",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
      >
        {isRunning
          ? "🐍 Watch the snake move!"
          : challenge?.description || "Get ready!"}
      </p>
    </div>
  );
};
