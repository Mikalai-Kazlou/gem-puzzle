export default class Html {
  constructor() {
    this.main = document.createElement("main");
    document.body.append(this.main);

    const title = document.createElement("h1");
    title.textContent = "Gem puzzle";
    this.main.append(title);
  }

  generateControls() {
    const controls = document.createElement("div");
    controls.classList.add("controls");
    this.main.append(controls);

    let button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "start";
    button.textContent = "Start";
    controls.append(button);

    button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "score";
    button.textContent = "Score";
    controls.append(button);

    button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "save";
    button.textContent = "Save";
    controls.append(button);

    button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "restore";
    button.textContent = "Restore";
    controls.append(button);

    button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "sound";
    button.textContent = "Sound";
    controls.append(button);

    button = document.createElement("button");
    button.classList.add("button", "action");
    button.dataset.action = "animation";
    button.textContent = "Animation";
    controls.append(button);
  }

  generateIndicators() {
    const indicators = document.createElement("div");
    indicators.classList.add("indicators");
    this.main.append(indicators);

    const moves = document.createElement("span");
    moves.classList.add("moves");
    indicators.append(moves);

    let label = document.createElement("span");
    label.classList.add("label");
    label.textContent = "Moves: ";
    moves.append(label);

    let value = document.createElement("span");
    value.classList.add("value");
    moves.append(value);

    const time = document.createElement("span");
    time.classList.add("time");
    indicators.append(time);

    label = document.createElement("span");
    label.classList.add("label");
    label.textContent = "Time: ";
    time.append(label);

    value = document.createElement("span");
    value.classList.add("value");
    time.append(value);
  }

  generateField() {
    const field = document.createElement("div");
    field.classList.add("field");
    this.main.append(field);

    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    field.append(this.canvas);
  }

  generateSizeButtons() {
    const sizeButtons = document.createElement("div");
    sizeButtons.classList.add("size-buttons");
    this.main.append(sizeButtons);

    let label = document.createElement("span");
    label.classList.add("label");
    label.textContent = "Size: ";
    sizeButtons.append(label);

    let button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "2";
    button.textContent = "2x2";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "3";
    button.textContent = "3x3";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size", "active");
    button.dataset.size = "4";
    button.textContent = "4x4";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "5";
    button.textContent = "5x5";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "6";
    button.textContent = "6x6";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "7";
    button.textContent = "7x7";
    sizeButtons.append(button);

    button = document.createElement("button");
    button.classList.add("button", "size");
    button.dataset.size = "8";
    button.textContent = "8x8";
    sizeButtons.append(button);
  }

  generateFinishPopup(game, text) {
    const background = document.createElement("div");
    background.classList.add("background");
    this.main.append(background);

    const popup = document.createElement("div");
    popup.classList.add("popup");
    background.append(popup);

    let div = document.createElement("div");
    div.classList.add("text");
    div.innerHTML = text;
    popup.append(div);

    let button = document.createElement("button");
    button.classList.add("button", "ok");
    button.textContent = "Ok";
    button.addEventListener('click', () => {
      game.start(game.size);
      background.remove();
    });
    popup.append(button);

    button = document.createElement("button");
    button.classList.add("button", "cancel");
    button.textContent = "Cancel";
    button.addEventListener('click', () => {
      background.remove();
    });
    popup.append(button);
  }

  generateScorePopup(game, score) {
    const background = document.createElement("div");
    background.classList.add("background");
    this.main.append(background);

    const popup = document.createElement("div");
    popup.classList.add("popup");
    background.append(popup);

    const table = document.createElement("table");
    table.classList.add("score");
    popup.append(table);

    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");

    table.append(tr);
    th.textContent = "#";
    tr.append(th);
    th = document.createElement("th");
    th.textContent = "Size";
    tr.append(th);
    th = document.createElement("th");
    th.textContent = "Time";
    tr.append(th);
    th = document.createElement("th");
    th.textContent = "Moves";
    tr.append(th);

    score.forEach(item => {
      tr = document.createElement("tr");
      table.append(tr);

      td = document.createElement("td");
      td.textContent = score.indexOf(item) + 1;
      tr.append(td);
      td = document.createElement("td");
      td.textContent = `${item.size}x${item.size}`;
      tr.append(td);
      td = document.createElement("td");
      td.textContent = game.timer.format(item.time);
      tr.append(td);
      td = document.createElement("td");
      td.textContent = item.count;
      tr.append(td);
    });

    const button = document.createElement("button");
    button.classList.add("button", "ok");
    button.textContent = "Ok";
    button.addEventListener('click', () => {
      if (!game.isFinished) {
        game.timer.start();
      }
      background.remove();
    });
    popup.append(button);
  }
}