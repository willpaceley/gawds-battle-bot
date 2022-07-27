const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const powers = require('../data/powers');

function getPowers(partsArray) {
  return partsArray.map((part) => {
    return { ...powers[part.power] };
  });
}

function sortByCount(a, b) {
  return b.count - a.count;
}

module.exports.getAvailablePowers = function (powersArray) {
  const availablePowers = [];
  powersArray.forEach((power) => {
    // If there's a duplicate power, increase count prop
    // And don't push the duplicate to return array
    if (availablePowers.find((availPower) => availPower.name === power.name)) {
      const index = availablePowers.findIndex(
        (availPower) => availPower.name === power.name
      );
      availablePowers[index].count += 1;
    } else {
      power.count = 1;
      availablePowers.push(power);
    }
  });
  // Sort array by count to make highest count buttons display first
  availablePowers.sort(sortByCount);
  return availablePowers;
};

module.exports.Gawd = class {
  constructor(id, isUser = true) {
    this.id = id;
    this.health = 100;
    this.alive = true;
    this.isUser = isUser;
    this.blocks = 2;
  }

  async requestData() {
    const data = await fetch(`https://www.gawds.xyz/api/gawds/${this.id}`).then(
      (response) => {
        // Check if the API returns a Gawd for the ID specified
        if (!response.ok) {
          throw new Error('A problem occurred calling the Gawds API.');
        }
        return response.json();
      }
    );
    this.name = data.name;
    this.image = data.image;
    this.dominantPower = powers[data.dominantPower];
    this.cult = this.dominantPower.cult;
    this.powers = getPowers(data.parts);
    this.availablePowers = module.exports.getAvailablePowers(this.powers);
    this.versusEmbed = this.createVersusEmbed();
  }

  createVersusEmbed() {
    const color = this.isUser ? '#22C55E' : '#D0034C';
    return new MessageEmbed()
      .setColor(color)
      .setTitle(this.name)
      .setURL(`https://www.gawds.xyz/gallery/${this.id}`)
      .addFields(
        { name: 'ID', value: String(this.id), inline: true },
        {
          name: 'Cult',
          value: this.cult.label,
          inline: true,
        },
        {
          name: 'Dominant Power',
          value: this.dominantPower.label,
          inline: true,
        }
      )
      .setImage(this.image);
  }
};
