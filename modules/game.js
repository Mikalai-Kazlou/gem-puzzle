import Timer from "./timer.js";
import Tile from "./tile.js";
import Counter from "./counter.js";
import Collection from "./collection.js";

export default class Game {
  constructor(html) {
    this.size = 4;
    this.tileSize = this.calculateTileSize();
    this.isSoundOn = false;
    this.isAnimationOn = true;

    this.html = html;
    this.generateContent(this);

    this.sound = new Audio("./sounds/move.mp3");
    this.canvas = this.html.canvas;

    this.ctx = this.canvas.getContext("2d");
    this.timer = new Timer(document.querySelector(".time>.value"));
    this.counter = new Counter(document.querySelector(".moves>.value"));

    this.skipClickHandler = false;
    this.isFinished = false;
  }

  generateContent(game) {
    this.html.generateControls();
    this.html.generateIndicators();
    this.html.generateField();
    this.html.generateSizeButtons();

    function startGameWithOtherSize(event) {
      if (event.target.classList.contains("size")) {
        game.start(Number(event.target.dataset.size));
      }
    }

    function toggleSound(event) {
      game.isSoundOn = !game.isSoundOn;
      game.refresh();
    }

    function toggleAnimation(event) {
      game.isAnimationOn = !game.isAnimationOn;
      game.refresh();
    }

    const sizeButtons = document.querySelector(".size-buttons");
    sizeButtons.addEventListener('click', startGameWithOtherSize);

    const btStart = document.querySelector(".button.action[data-action=start]");
    btStart.addEventListener('click', () => game.start(game.size));

    const btScore = document.querySelector(".button.action[data-action=score]");
    btScore.addEventListener('click', () => game.showScore());

    const btSave = document.querySelector(".button.action[data-action=save]");
    btSave.addEventListener('click', () => game.save());

    const btRestore = document.querySelector(".button.action[data-action=restore]");
    btRestore.addEventListener('click', () => game.restore());

    const btSound = document.querySelector(".button.action[data-action=sound]");
    btSound.addEventListener('click', toggleSound);

    const btAnimation = document.querySelector(".button.action[data-action=animation]");
    btAnimation.addEventListener('click', toggleAnimation);

    this.html.canvas.addEventListener('click', (event) => game.move(event));
    this.html.canvas.addEventListener('mousedown', (event) => game.drag(event));

    this.html.canvas.addEventListener('pointerup', (event) => {
      if (event.pointerType === 'touch') { game.move(event); }
    });

    this.html.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
    });
  }

  refresh() {
    this.tileSize = this.calculateTileSize();
    this.canvas.width = this.canvas.height = this.size * this.tileSize;

    Array.from(this.tiles.values()).forEach(tile => {
      if (tile !== null) {
        tile.animation = this.isAnimationOn;
        tile.setSize(this.tileSize);
        tile.show();
      }
    });

    const buttons = document.querySelectorAll(".button.size");
    buttons.forEach((bt) => {
      bt.classList.remove("active");
      if (bt.dataset.size == this.size) {
        bt.classList.add("active");
      }
    });

    const btSound = document.querySelector(".button.action[data-action=sound]");
    if (this.isSoundOn) {
      btSound.classList.add("active");
    } else {
      btSound.classList.remove("active");
    };

    const btAnimation = document.querySelector(".button.action[data-action=animation]");
    if (this.isAnimationOn) {
      btAnimation.classList.add("active");
    } else {
      btAnimation.classList.remove("active");
    };
  }

  enableField() {
    const cap = document.querySelector(".cap");
    if (cap) {
      cap.remove();
    }
  }

  disableField() {
    let cap = document.querySelector(".cap");
    if (!cap) {
      const field = document.querySelector(".field");
      cap = document.createElement("div");
      cap.classList.add("cap");
      field.append(cap);
    }
  }

  calculateTileSize() {
    let tileSize = 30;

    switch (true) {
      case (document.documentElement.clientWidth >= 1280):
        tileSize = 80; break;
      case (document.documentElement.clientWidth >= 768):
        tileSize = 60; break;
      case (document.documentElement.clientWidth >= 340):
        tileSize = 40; break;
      case (document.documentElement.clientWidth >= 320):
        tileSize = 30; break;
    }
    return tileSize;
  }

  start(size) {
    this.size = size;
    this.isFinished = false;
    this.enableField();

    const numberOfTiles = this.size ** 2 - 1;
    const collection = new Collection(numberOfTiles);
    const numbers = collection.generate();

    this.tiles = new Map();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let position = String(x) + String(y);

        if (this.tiles.size < numberOfTiles) {
          let tile = new Tile(
            this.ctx,
            numbers[this.tiles.size],
            this.tileSize,
            x * this.tileSize,
            y * this.tileSize,
            this.isAnimationOn);

          this.tiles.set(position, tile);
        } else {
          this.tiles.set(position, null);
        }
      }
    }

    this.refresh();
    this.counter.reset();
    this.timer.stop();
    this.timer.start();
  }

  calculateCurrentPosition(x, y, size) {
    function div(val, by) {
      return (val - val % by) / by;
    }
    return String(div(x, size)) + String(div(y, size));
  }

  move(event) {
    if (this.skipClickHandler) {
      return;
    }

    let newPosition = "";
    const oldPosition = this.calculateCurrentPosition(event.offsetX, event.offsetY, this.tileSize);
    const tile = this.tiles.get(oldPosition);

    if (tile) {
      if (tile.transition) {
        return;
      }

      // Left
      newPosition = String(Number(oldPosition[0]) - 1) + oldPosition[1];
      if (this.tiles.get(newPosition) === null) {
        tile.moveLeft();
        this.fixMovement(tile, oldPosition, newPosition);
        return;
      }
      // Right
      newPosition = String(Number(oldPosition[0]) + 1) + oldPosition[1];
      if (this.tiles.get(newPosition) === null) {
        tile.moveRight();
        this.fixMovement(tile, oldPosition, newPosition);
        return;
      }
      // Top
      newPosition = oldPosition[0] + String(Number(oldPosition[1]) - 1);
      if (this.tiles.get(newPosition) === null) {
        tile.moveTop();
        this.fixMovement(tile, oldPosition, newPosition);
        return;
      }
      // Bottom
      newPosition = oldPosition[0] + String(Number(oldPosition[1]) + 1);
      if (this.tiles.get(newPosition) === null) {
        tile.moveBottom();
        this.fixMovement(tile, oldPosition, newPosition);
        return;
      }
    }
  }

  drag(event) {
    const game = this;
    this.skipClickHandler = false;

    let newPosition = "";
    const oldPosition = this.calculateCurrentPosition(event.offsetX, event.offsetY, this.tileSize);
    const tile = this.tiles.get(oldPosition);

    let direction = "";

    if (tile) {
      if (tile.transition) {
        return;
      }

      // Left
      if (!direction) {
        newPosition = String(Number(oldPosition[0]) - 1) + oldPosition[1];
        if (this.tiles.get(newPosition) === null) {
          direction = "left";
        }
      }
      // Right
      if (!direction) {
        newPosition = String(Number(oldPosition[0]) + 1) + oldPosition[1];
        if (this.tiles.get(newPosition) === null) {
          direction = "right";
        }
      }
      // Top
      if (!direction) {
        newPosition = oldPosition[0] + String(Number(oldPosition[1]) - 1);
        if (this.tiles.get(newPosition) === null) {
          direction = "top";
        }
      }
      // Bottom
      if (!direction) {
        newPosition = oldPosition[0] + String(Number(oldPosition[1]) + 1);
        if (this.tiles.get(newPosition) === null) {
          direction = "bottom";
        }
      }
    }

    if (!direction) return;

    const shiftX = event.offsetX - tile.x;
    const shiftY = event.offsetY - tile.y;

    const screenX = event.screenX;
    const screenY = event.screenY;

    let minX = tile.x;
    let maxX = tile.x;
    let minY = tile.y;
    let maxY = tile.y;

    switch (direction) {
      case "left":
        minX = tile.x - tile.width;
        maxX = tile.x;
        break;
      case "right":
        minX = tile.x;
        maxX = tile.x + tile.width;
        break;
      case "top":
        minY = tile.y - tile.height;
        maxY = tile.y;
        break;
      case "bottom":
        minY = tile.y;
        maxY = tile.y + tile.height;
        break;
    }

    let tsStart = Date.now();

    function move(newX, newY, emphasized = false) {
      tile.clear();
      tile.x = newX;
      tile.y = newY;
      tile.show(emphasized);
    }

    function moveAt(x, y) {
      switch (direction) {
        case "left":
        case "right":
          let newX = x - shiftX;
          newX = (newX > maxX) ? maxX : newX;
          newX = (newX < minX) ? minX : newX;
          move(newX, tile.y, true);
          break;
        case "top":
        case "bottom":
          let newY = y - shiftY;
          newY = (newY > maxY) ? maxY : newY;
          newY = (newY < minY) ? minY : newY;
          move(tile.x, newY, true);
          break;
      }
    }

    function finishMove(event) {
      const delta = Date.now() - tsStart;
      const isClick = (delta < 200) || (screenX === event.screenX && screenY === event.screenY);

      const halfX = minX + (maxX - minX) / 2;
      const halfY = minY + (maxY - minY) / 2;

      switch (direction) {
        case "left":
          if (isClick) {
            move(maxX, tile.y);
          } else {
            if (tile.x < halfX) {
              move(minX, tile.y);
              game.fixMovement(tile, oldPosition, newPosition);
            } else {
              move(maxX, tile.y);
            }
            game.skipClickHandler = true;
          }
          break;
        case "right":
          if (isClick) {
            move(minX, tile.y);
          } else {
            if (tile.x < halfX) {
              move(minX, tile.y);
            } else {
              move(maxX, tile.y);
              game.fixMovement(tile, oldPosition, newPosition);
            }
            game.skipClickHandler = true;
          }
          break;
        case "top":
          if (isClick) {
            move(tile.x, maxY);
          } else {
            if (tile.y < halfY) {
              move(tile.x, minY);
              game.fixMovement(tile, oldPosition, newPosition);
            } else {
              move(tile.x, maxY);
            }
            game.skipClickHandler = true;
          }
          break;
        case "bottom":
          if (isClick) {
            move(tile.x, minY);
          } else {
            if (tile.y < halfY) {
              move(tile.x, minY);
            } else {
              move(tile.x, maxY);
              game.fixMovement(tile, oldPosition, newPosition);
            }
            game.skipClickHandler = true;
          }
          break;
      }
    }

    function onMouseMove(event) {
      moveAt(event.offsetX, event.offsetY);
    }
    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function (event) {
      finishMove(event);
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  }

  fixMovement(tile, oldPosition, newPosition) {
    this.counter.add();

    if (this.isSoundOn) {
      this.sound.pause();
      this.sound.currentTime = 0;
      this.sound.play();
    }

    this.tiles.set(oldPosition, null);
    this.tiles.set(newPosition, tile);

    setTimeout(() => this.finish(), 0);
  }

  finish() {
    const tiles = this.tiles.values();

    function isCorrectOrder(tiles) {
      tiles = Array.from(tiles);
      if (tiles.indexOf(null) !== tiles.length - 1) {
        return false;
      }

      tiles.splice(tiles.indexOf(null), 1);
      for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i].number > tiles[i + 1].number) {
          return false;
        }
      }

      return true;
    }

    if (isCorrectOrder(tiles)) {
      this.isFinished = true;
      this.disableField();

      this.timer.pause();
      this.saveScore();

      const text = `Hooray!<br>You solved the puzzle in ${this.timer.get()} and ${this.counter.get()} moves!<br>Start a new game?`;
      this.html.generateFinishPopup(this, text);
    }
  }

  save() {
    const save = {};
    save.size = this.size;
    save.sound = this.isSoundOn;
    save.animation = this.isAnimationOn;
    save.finised = this.isFinished;

    save.time = this.timer.time;
    save.count = this.counter.count;

    save.numbers = [];
    for (let tile of this.tiles.values()) {
      if (tile !== null) {
        save.numbers.push(tile.number);
      } else {
        save.numbers.push(tile);
      }
    }

    localStorage.setItem('gem-puzzle-save', JSON.stringify(save));
  }

  restore() {
    const save = JSON.parse(localStorage.getItem('gem-puzzle-save'));
    if (!save) return;

    this.size = save.size;
    this.isSoundOn = save.sound;
    this.isAnimationOn = save.animation;
    this.isFinished = save.finised;

    this.timer.stop();
    this.timer.time = save.time;
    this.timer.refresh();

    this.counter.count = save.count;
    this.counter.refresh();

    if (this.isFinished) {
      this.disableField();
    } else {
      this.enableField();
      this.timer.start();
    }

    this.tiles = new Map();

    let i = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let position = String(x) + String(y);

        if (save.numbers[i] !== null) {
          let tile = new Tile(
            this.ctx,
            save.numbers[i],
            this.tileSize,
            x * this.tileSize,
            y * this.tileSize,
            this.isAnimationOn);

          this.tiles.set(position, tile);
        } else {
          this.tiles.set(position, null);
        }
        i++;
      }
    }

    this.refresh();
  }

  saveScore() {
    const score = JSON.parse(localStorage.getItem('gem-puzzle-score')) || [];

    const save = {
      size: this.size,
      time: this.timer.time,
      count: this.counter.count
    };

    score.push(save);
    score.sort((a, b) => {
      return (a.size === b.size) ? ((a.time === b.time) ? ((a.count === b.count) ?
        0 : a.count - b.count) : a.time - b.time) : b.size - a.size;
    });
    if (score.length > 10) {
      score.pop();
    }

    localStorage.setItem('gem-puzzle-score', JSON.stringify(score));
  }

  showScore() {
    this.timer.pause();
    const score = JSON.parse(localStorage.getItem('gem-puzzle-score')) || [];
    this.html.generateScorePopup(this, score);
  }
}