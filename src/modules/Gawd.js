const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { determineCult } = require('../modules/cults');
const powerSymbols = require('../modules/powerSymbols');

module.exports = class Gawd {
  constructor(id, isUser = true) {
    this.id = id;
    this.health = 100;
    this.alive = true;
    this.isUser = isUser;
  }

  async requestData() {
    const data = await fetch(`https://www.gawds.xyz/api/gawds/${this.id}`).then(
      (response) => {
        // Check if the API returns a Gawd for the ID specified
        if (!response.ok) {
          throw new Error(`No Gawd found with ID ${this.id}`);
        }
        return response.json();
      }
    );
    this.name = data.name;
    this.image = data.image;
    this.dominantPower = data.dominantPower;
    this.powers = this.getPowers(data.parts);
    this.embed = this.getMessageEmbed();
  }

  getMessageEmbed() {
    const color = this.isUser ? '#22C55E' : '#D0034C';
    return new MessageEmbed()
      .setColor(color)
      .setTitle(this.name)
      .setURL(this.image)
      .addFields(
        { name: 'ID', value: String(this.id), inline: true },
        {
          name: 'Cult',
          value: determineCult(this.dominantPower),
          inline: true,
        },
        {
          name: 'Dominant Power',
          value: `${this.dominantPower} ${powerSymbols[this.dominantPower]}`,
          inline: true,
        }
      )
      .setImage(this.image);
  }

  getPowers(partsArray) {
    const powers = [];
    partsArray.forEach((part) => {
      powers.push(part.power);
    });
    return powers;
  }
};