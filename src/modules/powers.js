const passive = require('./passives');

module.exports = {
  Divine: {
    label: 'Divine',
    icon: '✧',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.heal,
  },
  Chaos: {
    label: 'Chaos',
    icon: '⦲',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.hit,
  },
  Mystic: {
    label: 'Mystic',
    icon: '☾',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.crit,
  },
  Dark: {
    label: 'Dark',
    icon: '❍',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.dodge,
  },
  Spirit: {
    label: 'Spirit',
    icon: '⧂',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.damage,
  },
  Oblivion: {
    label: 'Oblivion',
    icon: '⨙',
    cult: 'Arcane',
    cultIcon: '🩸',
    passive: passive.random,
  },
  Corporeal: {
    label: 'Corporeal',
    icon: '⩀',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.heal,
  },
  Creature: {
    label: 'Creature',
    icon: '⧰',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.hit,
  },
  Verdure: {
    label: 'Verdure',
    icon: '❖',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.crit,
  },
  Toxic: {
    label: 'Toxic',
    icon: '⦵',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.dodge,
  },
  Mundane: {
    label: 'Mundane',
    icon: '⬙',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.damage,
  },
  Aqueous: {
    label: 'Aqueous',
    icon: '⏆',
    cult: 'Terrene',
    cultIcon: '🌙',
    passive: passive.random,
  },
  Cosmos: {
    label: 'Cosmos',
    icon: '✶',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.heal,
  },
  Inferno: {
    label: 'Inferno',
    icon: '◊',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.hit,
  },
  Geological: {
    label: 'Geological',
    icon: '◍',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.crit,
  },
  Automoton: {
    label: 'Automoton',
    icon: '⬡',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.dodge,
  },
  Numerary: {
    label: 'Numerary',
    icon: '☉',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.damage,
  },
  Alchemy: {
    label: 'Alchemy',
    icon: '⦓',
    cult: 'Astral',
    cultIcon: '✨',
    passive: passive.random,
  },
};
