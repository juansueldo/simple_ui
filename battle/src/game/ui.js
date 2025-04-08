import { player } from "./player.js";
import { getEnemy } from "./enemy.js";
import { getHand } from "./deck.js";
import { playCard, discardCard } from "./deck.js";
import { setEnemyIntent, loadNextEnemy, getEnemyIntent } from "./enemy.js";
import { drawCards } from "./deck.js";
import { log } from "./log.js";

export function updateUI() {
  const enemy = getEnemy();
  let playerhp = Math.max(0, player.hp);
  let enemyhp = Math.max(0, enemy.hp);

  document.getElementById("enemy-name").textContent = enemy.name;
  document.getElementById("player-hp").textContent = playerhp;
  document.getElementById("player-block").textContent = player.block;
  document.getElementById("player-energy").textContent = player.energy;
  document.getElementById("enemy-hp").textContent = enemyhp;
  document.getElementById("enemy-block").textContent = enemy.block;
  

  document.getElementById("player-health-bar").style.width = (playerhp / player.maxHp) * 100 + "%";
  document.getElementById("enemy-health-bar").style.width = (enemyhp / enemy.maxHp) * 100 + "%";
  
}

export function renderCards() {
  const hand = getHand();
  const handEl = document.getElementById("card-hand");
  handEl.innerHTML = "";

  hand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.textContent = `${card.name} (${card.cost})`;
    div.onclick = () => useCard(index);
    handEl.appendChild(div);
  });
}

export function disableHand() {
  document.getElementById("card-hand").innerHTML = "";
}

function useCard(index) {
  const enemy = getEnemy();
  const card = playCard(index);

  if (player.energy < card.cost) {
    log("¡No tienes suficiente energía!");
    return;
  }

  player.energy -= card.cost;

  let damageTaken = 0;
  if (card.type === "attack") {
    damageTaken = Math.max(0, card.damage - enemy.block);
    enemy.hp -= damageTaken;
    blockBar('enemy', enemy)
    shakeHealthbar('enemy');
    log(`Usaste ${card.name} e hiciste ${card.damage} de daño.`);
  } else if (card.type === "block") {
    player.block += card.block;
    blockBar('player',player)

    log(`Usaste ${card.name} y ganaste ${card.block} de defensa.`);
  }

  discardCard(card);
  updateUI();
  renderCards();

  if (enemy.hp <= 0) {
    log(`¡Has vencido a ${enemy.name}!`);
    setTimeout(() => loadNextEnemy(log, updateUI, disableHand), 1000);
    return;
  }

  if (player.energy === 0 || getHand().length === 0) {
    endPlayerTurn();
  }
}

export function endPlayerTurn() {
  setTimeout(() => {
    log("Turno enemigo...");
    enemyAttack();
  }, 1000);
}

function enemyAttack() {
  const intent = getEnemyIntent();
  const enemy = getEnemy();

  if (!intent) return;

  let damageTaken = 0;

  if (intent.type.includes("attack")) {
    damageTaken = Math.max(0, intent.damage - player.block);
    player.hp -= damageTaken;
    blockBar('player', player)
    shakeHealthbar('player');
    log(`El enemigo te ataca por ${intent.damage}. Recibes ${damageTaken} de daño.`);
  }

  if (intent.type.includes("block")) {
    enemy.block = (enemy.block || 0) + intent.block;
    blockBar('enemy', enemy)
    log(`El enemigo gana ${intent.block} de defensa.`);
  }

  player.block = 0;
  player.energy = 3;
  drawCards(4);
  updateUI();
  renderCards();
  log("Tu turno ha comenzado.");
  setEnemyIntent();
}

function shakeHealthbar(player){
    const healthBar = document.getElementById(`${player}-health-bar`);
    healthBar.classList.add("health-bar-shake");
    setTimeout(() => healthBar.classList.remove("health-bar-shake"), 300);
}


function blockBar(selector,gamer){
    let playerdefense = Math.max(0, (gamer.hp+gamer.block));
    document.getElementById(`${selector}-block-bar`).style.width = (playerdefense / gamer.maxBlock) * 100 + "%";
}