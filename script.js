import Html from "./modules/html.js";
import Game from "./modules/game.js";

const html = new Html();
const game = new Game(html);

window.addEventListener('load', () => game.start(game.size));

function onResizeWindow() {
  if (game.calculateTileSize() !== game.tileSize) {
    game.refresh();
  }
}

window.addEventListener("resize", onResizeWindow, false);