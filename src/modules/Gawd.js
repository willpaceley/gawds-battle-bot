const fetch = require('node-fetch');

module.exports = class Gawd {
  constructor(id) {
    this.id = id;
    this.health = 100;
    this.alive = true;
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
  }

  getPowers(partsArray) {
    const powers = [];
    partsArray.forEach((part) => {
      powers.push(part.power);
    });
    return powers;
  }
};
