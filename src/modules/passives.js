function getRandomPassive() {
  const passives = ['heal', 'hit', 'crit', 'dodge', 'damage'];
  const randomIndex = Math.floor(Math.random() * 5);
  return module.exports[passives[randomIndex]];
}

module.exports = {
  heal: {
    type: 'heal',
    value: 5,
    description: 'Heal +5 HP',
  },
  hit: {
    type: 'hit',
    value: 2.5,
    description: '+2.5% Hit Chance',
  },
  crit: {
    type: 'crit',
    value: 2.5,
    description: '+2.5% Crit Chance',
  },
  dodge: {
    type: 'dodge',
    value: 2.5,
    description: '-2.5% Opponent Dodge',
  },
  damage: {
    type: 'damage',
    value: 2.5,
    description: '+2.5 Damage',
  },
  random: getRandomPassive(),
};
