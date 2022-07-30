module.exports = {
  heal: {
    type: 'heal',
    value: 5,
    description: 'Heal +5 HP',
  },
  hit: {
    type: 'hit',
    value: 0.1,
    description: '+10% Hit Chance',
  },
  crit: {
    type: 'crit',
    value: 2.5,
    description: '+2.5% Crit Chance',
  },
  dodge: {
    type: 'dodge',
    value: 0.15,
    description: '-15% Opponent Dodge',
  },
  damage: {
    type: 'damage',
    value: 2.5,
    description: '+2.5 Damage',
  },
  random: {
    type: 'random',
    value: undefined,
    description: 'Random Passive',
  },
};
