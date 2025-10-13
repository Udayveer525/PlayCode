import { soundManager } from "../lib/soundManager";

export class CommandInterpreter {
  constructor(onStateChange, onExecutionComplete) {
    this.onStateChange = onStateChange;
    this.onExecutionComplete = onExecutionComplete;
    this.isRunning = false;
    this.snakeState = null;
    this.challenge = null;
    this.collectedStars = [];
  }

  setSnakeState(state) {
    this.snakeState = {
      ...state,
      body: state.body || [],
    };
    this.collectedStars = state.collectedStars || [];
  }

  setChallenge(challenge) {
    this.challenge = challenge;
  }

  async executeCommands(commands) {
    if (this.isRunning || !commands || commands.length === 0) {
      this.onExecutionComplete(false);
      return;
    }

    console.log("🐍 Starting execution with commands:", commands);
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
      await this.delay(300);
    }
  }

  async executeCommand(command) {
    if (command.cmd === "move") {
      // FIX: Handle both "steps" and "value"
      const steps = command.steps || command.value || 1;
      await this.moveForward(steps);
    } else if (command.cmd === "turn") {
      await this.turn(command.dir);
    } else if (command.cmd === "repeat") {
      // FIX: Handle "body", "commands", or "do"
      const nestedCommands =
        command.body || command.commands || command.do || [];
      const times = parseInt(command.times) || 1;

      for (let i = 0; i < times; i++) {
        if (!this.isRunning) break;
        await this.processCommands(nestedCommands);
      }
    }
  }

  async moveForward(steps) {
    for (let i = 0; i < steps; i++) {
      if (!this.isRunning) break;

      const { row, col, direction } = this.snakeState;
      let newRow = row;
      let newCol = col;

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

      if (this.isValidPosition(newRow, newCol)) {
        // Move body segments BEFORE moving head
        this.moveBody();

        // Move snake head
        this.snakeState.row = newRow;
        this.snakeState.col = newCol;

        // Check if collected a star
        this.checkStarCollection(newRow, newCol);

        this.onStateChange({
          ...this.snakeState,
          collectedStars: this.collectedStars,
        });
      } else {
        console.log("❌ Invalid move - hit wall or obstacle!");
        this.onExecutionComplete(false);
        this.isRunning = false;
        return;
      }

      await this.delay(200);
    }
  }

  // Move body segments to follow head
  moveBody() {
    if (!this.snakeState.body || this.snakeState.body.length === 0) return;

    // Move each segment to the position in front of it (tail to head)
    for (let i = this.snakeState.body.length - 1; i > 0; i--) {
      this.snakeState.body[i] = { ...this.snakeState.body[i - 1] };
    }

    // First body segment takes head's OLD position
    this.snakeState.body[0] = {
      r: this.snakeState.row,
      c: this.snakeState.col,
    };
  }

  async turn(direction) {
    const directions = ["up", "right", "down", "left"];
    const currentIndex = directions.indexOf(this.snakeState.direction);

    if (direction === "right") {
      this.snakeState.direction = directions[(currentIndex + 1) % 4];
    } else if (direction === "left") {
      this.snakeState.direction = directions[(currentIndex + 3) % 4];
    }

    this.onStateChange({ ...this.snakeState });
  }

  checkStarCollection(row, col) {
    if (!this.challenge.stars) return;

    const starIndex = this.challenge.stars.findIndex(
      (star) =>
        star.r === row &&
        star.c === col &&
        !this.collectedStars.includes(`${star.r}-${star.c}`)
    );

    if (starIndex !== -1) {
      const star = this.challenge.stars[starIndex];
      const starKey = `${star.r}-${star.c}`;
      this.collectedStars.push(starKey);

      // PLAY STAR COLLECTION SOUND
      soundManager.playSFX("collectStar");

      // Initialize body if needed
      if (!this.snakeState.body) {
        this.snakeState.body = [];
      }

      // Add body segment at tail position
      if (this.snakeState.body.length > 0) {
        // Clone last segment position
        const tail = this.snakeState.body[this.snakeState.body.length - 1];
        this.snakeState.body.push({ r: tail.r, c: tail.c });
      } else {
        // First segment - add at current head position
        this.snakeState.body.push({
          r: this.snakeState.row,
          c: this.snakeState.col,
        });
      }

      console.log(
        `⭐ Star collected! Body segments: ${this.snakeState.body.length}`
      );
    }
  }

  checkWinCondition() {
    if (!this.challenge.stars) {
      this.onExecutionComplete(false);
      return;
    }

    const allStarsCollected =
      this.collectedStars.length === this.challenge.stars.length;

    console.log(
      `🏁 Win check: ${this.collectedStars.length}/${this.challenge.stars.length} stars collected`
    );
    this.onExecutionComplete(allStarsCollected);
  }

  isValidPosition(row, col) {
    if (!this.challenge || !this.challenge.grid) return true;

    const inBounds =
      row >= 0 &&
      row < this.challenge.grid.rows &&
      col >= 0 &&
      col < this.challenge.grid.cols;

    if (!inBounds) {
      console.log(`🚫 Out of bounds: (${row}, ${col})`);
      return false;
    }

    // Check obstacles
    if (this.challenge.obstacles && this.challenge.obstacles.length > 0) {
      const hasObstacle = this.challenge.obstacles.some(
        (obs) => obs.r === row && obs.c === col
      );
      if (hasObstacle) {
        console.log(`🚫 Hit obstacle at (${row}, ${col})`);
        return false;
      }
    }

    return true;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
  }
}
