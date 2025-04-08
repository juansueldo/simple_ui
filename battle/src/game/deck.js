import { allCards } from "./cards.js";

let deck = [...allCards];
let discardPile = [];
let hand = [];

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function drawCards(count) {
  while (hand.length < count) {
    if (deck.length === 0) {
      if (discardPile.length === 0) break;
      deck = [...discardPile];
      discardPile = [];
      shuffle(deck);
    }
    hand.push(deck.pop());
  }
}

export function getHand() {
  return hand;
}

export function playCard(index) {
  return hand.splice(index, 1)[0];
}

export function discardCard(card) {
  discardPile.push(card);
}
