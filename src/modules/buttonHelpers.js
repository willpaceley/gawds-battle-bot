const { MessageButton, MessageActionRow } = require('discord.js');
const { getAvailablePowers } = require('./Gawd');

module.exports.getPowersButtons = function (gawd) {
  // if availablePowers is empty, repopulate
  if (gawd.availablePowers.length === 0) {
    console.log('availablePowers is empty. repopulating');
    gawd.availablePowers = getAvailablePowers(gawd.powers);
  }
  return gawd.availablePowers.map((power) => {
    // custom ID needs to be unique
    // const customId = `${power.name}${Math.floor(Math.random() * Date.now())}`;
    return new MessageButton()
      .setCustomId(power.name)
      .setLabel(
        `${power.count > 1 ? power.count + 'x  ' : ''}
        ${power.cult.icon} ${power.name} `
      )
      .setStyle('PRIMARY');
  });
};

module.exports.getPowersRow = function (buttonsArray) {
  // Note: There can't be more than 5 buttons per row
  // For formatting, only display 4 buttons per row
  if (buttonsArray.length > 4) {
    // Split buttons into two rows
    const rowOne = new MessageActionRow().addComponents(
      buttonsArray.slice(0, 4)
    );
    const rowTwo = new MessageActionRow().addComponents(buttonsArray.slice(4));
    return [rowOne, rowTwo];
  } else {
    return [new MessageActionRow().addComponents(buttonsArray)];
  }
};
