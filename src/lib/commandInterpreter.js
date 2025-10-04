export class CommandInterpreter {
  constructor(onStateChange, onExecutionComplete) {
    this.onStateChange = onStateChange;
    this.onExecutionComplete = onExecutionComplete;
    this.isRunning = false;
    this.robotState = null;
    this.challenge = null;
  }

  setRobotState(state) {
    this.robotState = { ...state };
  }

  setChallenge(challenge) {
    this.challenge = challenge;
  }

  async executeCommands(commands) {
    if (this.isRunning || !commands || commands.length === 0) {
      this.onExecutionComplete(false);
      return;
    }

    console.log("🤖 Starting execution with commands:", commands);
    this.isRunning = true;

    try {
      await this.processCommands(commands);
      this.checkWinCondition();
    } catch (error) {
      console.error("Execution error:", error);
      this.onExecutionComplete(false);
    } finally {
      this.isRunning = false;
    }
  }

  async processCommands(commands) {
    for (const command of commands) {
      if (!this.isRunning) break;

      console.log("🔄 Executing command:", command);
      await this.executeCommand(command);
      await this.delay(600); // Animation delay
    }
  }

  async executeCommand(command) {
    switch (command.cmd) {
      case "move":
        await this.moveForward(command.value || 1);
        break;
      case "turn":
        await this.turn(command.dir || "right");
        break;
      case "repeat":
        await this.repeatCommands(command.times || 1, command.body || []);
        break;
      default:
        console.warn("Unknown command:", command);
    }
  }

  async moveForward(steps) {
    for (let i = 0; i < steps; i++) {
      if (!this.isRunning) break;

      const { row, col, direction } = this.robotState;
      let newRow = row;
      let newCol = col;

      // Calculate new position based on direction
      switch (direction) {
        case "up":
          newRow = row - 1;
          break;
        case "down":
          newRow = row + 1;
          break;
        case "left":
          newCol = col - 1;
          break;
        case "right":
          newCol = col + 1;
          break;
      }

      // Check boundaries
      if (this.isValidPosition(newRow, newCol)) {
        this.robotState.row = newRow;
        this.robotState.col = newCol;
        this.robotState.stepCount++;

        console.log(`🤖 Robot moved to (${newRow}, ${newCol})`);
        this.onStateChange({ ...this.robotState });
        await this.delay(400);
      } else {
        console.log("🚫 Hit wall - execution failed");
        this.onExecutionComplete(false);
        return;
      }
    }
  }

  async turn(direction) {
    const directions = ["up", "right", "down", "left"];
    const currentIndex = directions.indexOf(this.robotState.direction);

    let newIndex;
    if (direction === "right") {
      newIndex = (currentIndex + 1) % 4;
    } else if (direction === "left") {
      newIndex = (currentIndex - 1 + 4) % 4;
    }

    this.robotState.direction = directions[newIndex];
    console.log(
      `🔄 Robot turned ${direction}, now facing ${this.robotState.direction}`
    );
    this.onStateChange({ ...this.robotState });
    await this.delay(200);
  }

  async repeatCommands(times, commands) {
    console.log(`🔁 Repeating ${times} times:`, commands);
    for (let i = 0; i < times; i++) {
      if (!this.isRunning) break;
      await this.processCommands(commands);
    }
  }

  isValidPosition(row, col) {
    if (!this.challenge || !this.challenge.grid) return true;

    return (
      row >= 0 &&
      row < this.challenge.grid.rows &&
      col >= 0 &&
      col < this.challenge.grid.cols
    );
  }

  checkWinCondition() {
    if (!this.challenge || !this.challenge.goal) {
      this.onExecutionComplete(true);
      return;
    }

    const { row, col } = this.robotState;
    const goal = this.challenge.goal;

    const isWin = row === goal.r && col === goal.c;
    console.log(
      `🎯 Win check: Robot at (${row}, ${col}), Goal at (${goal.r}, ${goal.c}), Win: ${isWin}`
    );
    this.onExecutionComplete(isWin);
  }

  stop() {
    this.isRunning = false;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
