export const enemies=[
    { name: "Esqueleto", hp: 20, damage: 4, maxHp: 20, block: 0, maxBlock: 20,
    moves: [
        { type: "attack", damage: 5 },
        { type: "block", block: 5 },
        { type: "attack+block", damage: 3, block: 3 },
      ], },
    { name: "Orco", hp: 30, damage: 6, maxHp: 30 , block: 0, maxBlock: 30,
    moves: [
        { type: "attack", damage: 6 },
        { type: "attack", damage: 8 },
        { type: "block", block: 6 },
      ],},
    { name: "Jefe Final", hp: 50, damage: 10, maxHp: 50, block: 0, maxBlock: 50,
    moves: [
        { type: "attack", damage: 6 },
        { type: "attack", damage: 8 },
        { type: "block", block: 6 },
      ],},
];