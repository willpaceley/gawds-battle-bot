const augment = require('./augments');
const cult = require('./cults');

module.exports = {
  Divine: {
    name: 'Divine',
    label: '✧ Divine',
    icon: '✧',
    cult: cult.Arcane,
    augment: augment.heal,
  },
  Chaos: {
    name: 'Chaos',
    label: '⦲ Chaos',
    icon: '⦲',
    cult: cult.Arcane,
    augment: augment.hit,
  },
  Mystic: {
    name: 'Mystic',
    label: '☾ Mystic',
    icon: '☾',
    cult: cult.Arcane,
    augment: augment.crit,
  },
  Dark: {
    name: 'Dark',
    label: '❍ Dark',
    icon: '❍',
    cult: cult.Arcane,
    augment: augment.dodge,
  },
  Spirit: {
    name: 'Spirit',
    label: '⧂ Spirit',
    icon: '⧂',
    cult: cult.Arcane,
    augment: augment.damage,
  },
  Oblivion: {
    name: 'Oblivion',
    label: '⨙ Oblivion',
    icon: '⨙',
    cult: cult.Arcane,
    augment: augment.random,
  },
  Corporeal: {
    name: 'Corporeal',
    label: '⩀ Corporeal',
    icon: '⩀',
    cult: cult.Terrene,
    augment: augment.heal,
  },
  Creature: {
    name: 'Creature',
    label: '⧰ Creature',
    icon: '⧰',
    cult: cult.Terrene,
    augment: augment.hit,
  },
  Verdure: {
    name: 'Verdure',
    label: '❖ Verdure',
    icon: '❖',
    cult: cult.Terrene,
    augment: augment.crit,
  },
  Toxic: {
    name: 'Toxic',
    label: '⦵ Toxic',
    icon: '⦵',
    cult: cult.Terrene,
    augment: augment.dodge,
  },
  Mundane: {
    name: 'Mundane',
    label: '⬙ Mundane',
    icon: '⬙',
    cult: cult.Terrene,
    augment: augment.damage,
  },
  Aqueous: {
    name: 'Aqueous',
    label: '⏆ Aqueous',
    icon: '⏆',
    cult: cult.Terrene,
    augment: augment.random,
  },
  Cosmos: {
    name: 'Cosmos',
    label: '✶ Cosmos',
    icon: '✶',
    cult: cult.Astral,
    augment: augment.heal,
  },
  Inferno: {
    name: 'Inferno',
    label: '◊ Inferno',
    icon: '◊',
    cult: cult.Astral,
    augment: augment.hit,
  },
  Geological: {
    name: 'Geological',
    label: '◍ Geological',
    icon: '◍',
    cult: cult.Astral,
    augment: augment.crit,
  },
  Automaton: {
    name: 'Automoton',
    label: '⬡ Automoton',
    icon: '⬡',
    cult: cult.Astral,
    augment: augment.dodge,
  },
  Numerary: {
    name: 'Numerary',
    label: '☉ Numerary',
    icon: '☉',
    cult: cult.Astral,
    augment: augment.damage,
  },
  Alchemy: {
    name: 'Alchemy',
    label: '⦓ Alchemy',
    icon: '⦓',
    cult: cult.Astral,
    augment: augment.random,
  },
};
