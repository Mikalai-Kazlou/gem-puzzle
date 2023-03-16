export default class Tile {
  constructor(ctx, number, size, x, y, animation = true) {
    this.ctx = ctx;
    this.number = number;
    this.transition = false;

    this.width = size;
    this.height = size;

    this.x = x;
    this.y = y;

    this.animation = animation;
    this.speed = 5;
    this.frequency = 10;

    this.setFontSize(size);
    this.show();
  }

  show(emphasized = false) {
    this.ctx.fillStyle = emphasized ? "darkgreen" : "green";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = `${this.fontSize} serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.number, this.x + this.width / 2, this.y + this.height / 2);

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  setSize(size) {
    this.x = this.x / this.width * size;
    this.y = this.y / this.height * size;

    this.width = this.height = size;
    this.setFontSize(size);
  }

  setFontSize(size) {
    switch (true) {
      case (size >= 80):
        this.fontSize = "48px"; break;
      case (size >= 60):
        this.fontSize = "32px"; break;
      case (size >= 40):
        this.fontSize = "24px"; break;
      case (size >= 30):
        this.fontSize = "20px"; break;
      default:
        this.fontSize = "16px";
    }
  }

  moveLeft() {
    const tile = this;

    function step(step) {
      this.clear();
      this.x -= step;
      this.show();
      return this.x;
    }

    if (this.animation) {
      tile.transition = true;
      const point = this.x - this.width;
      const interval = setInterval(() => {
        if (step.call(tile, this.speed) <= point) {
          clearInterval(interval);
          tile.transition = false;
        }
      }, this.frequency);
    } else {
      step.call(tile, this.width);
    }
  }

  moveRight() {
    const tile = this;

    function step(step) {
      this.clear();
      this.x += step;
      this.show();
      return this.x;
    }

    if (this.animation) {
      tile.transition = true;
      const point = this.x + this.width;
      const interval = setInterval(() => {
        if (step.call(tile, this.speed) >= point) {
          clearInterval(interval);
          tile.transition = false;
        }
      }, this.frequency);
    } else {
      step.call(tile, this.width);
    }
  }

  moveTop() {
    const tile = this;

    function step(step) {
      this.clear();
      this.y -= step;
      this.show();
      return this.y;
    }

    if (this.animation) {
      tile.transition = true;
      const point = this.y - this.height;
      const interval = setInterval(() => {
        if (step.call(tile, this.speed) <= point) {
          clearInterval(interval);
          tile.transition = false;
        }
      }, this.frequency);
    } else {
      step.call(tile, this.height);
    }
  }

  moveBottom() {
    const tile = this;

    function step(step) {
      this.clear();
      this.y += step;
      this.show();
      return this.y;
    }

    if (this.animation) {
      tile.transition = true;
      const point = this.y + this.height;
      const interval = setInterval(() => {
        if (step.call(tile, this.speed) >= point) {
          clearInterval(interval);
          tile.transition = false;
        }
      }, this.frequency);
    } else {
      step.call(tile, this.height);
    }
  }
}