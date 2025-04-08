import { enemies } from "../data/enemies.js";

let currentEnemyIndex = 0;
let enemy = { ...enemies[currentEnemyIndex] };
let enemyIntent = null;

export function getEnemy() {
  return enemy;
}

export function getEnemyIntent() {
  return enemyIntent;
}

export function setEnemyIntent() {
  const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
  enemyIntent = move;

  let intentText = "";
  if (move.type === "attack" || move.type === "attack+block") {
    intentText = "⚔️";
  } else if (move.type === "block") {
    intentText = "🛡️";
  }

  document.getElementById("enemy-intent").textContent = intentText;
}

export function loadNextEnemy(log, updateUI, disableHand) {
  currentEnemyIndex++;
  if (currentEnemyIndex < enemies.length) {
    enemy = { ...enemies[currentEnemyIndex] };
    log(`¡Nuevo enemigo aparece: ${enemy.name}!`);
    updateUI();
    setEnemyIntent();
  } else {
    log("¡Has derrotado a todos los enemigos! 🎉");
    disableHand();
  }
}
