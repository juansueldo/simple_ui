import { shuffle, drawCards } from "./game/deck.js";
import { updateUI, renderCards, endPlayerTurn } from "./game/ui.js";
import { setEnemyIntent } from "./game/enemy.js";
import { allCards } from "./game/cards.js";

shuffle(allCards);
drawCards(4);
updateUI();
renderCards();
setEnemyIntent();

document.getElementById("end-turn-button").addEventListener("click", () => {
  endPlayerTurn();
});
