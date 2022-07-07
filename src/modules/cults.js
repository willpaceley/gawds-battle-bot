module.exports.cults = [
  {
    name: 'Arcane 🩸',
    powers: ['Divine', 'Chaos', 'Mystic', 'Dark', 'Spirit', 'Oblivion'],
  },
  {
    name: 'Terrene 🌙',
    powers: ['Corporeal', 'Creature', 'Verdure', 'Toxic', 'Mundane', 'Aqueous'],
  },
  {
    name: 'Astral ✨',
    powers: [
      'Cosmos',
      'Inferno',
      'Geological',
      'Automoton',
      'Numerary',
      'Alchemy',
    ],
  },
];

module.exports.determineCult = function (dominantPower) {
  const cultMatch = module.exports.cults.find((cult) =>
    cult.powers.includes(dominantPower)
  );
  return cultMatch.name;
};
