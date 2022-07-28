const { MessageButton, MessageActionRow } = require('discord.js');
const { getAvailablePowers } = require('./Gawd');

module.exports.getPowersButtons = function (gawd) {
  // if availablePowers is empty, repopulate
  if (gawd.availablePowers.length === 0) {
    gawd.availablePowers = getAvailablePowers(gawd.powers);
  }
  return gawd.availablePowers.map((power) => {
    return new MessageButton()
      .setCustomId(power.name)
      .setLabel(power.label)
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

module.exports.getBlockButtons = function (userGawd) {
  const blockButton = new MessageButton()
    .setCustomId('block')
    .setLabel('Block')
    .setStyle('PRIMARY');

  if (userGawd.blocks < 1) blockButton.setDisabled();

  const passButton = new MessageButton()
    .setCustomId('pass')
    .setLabel('Pass')
    .setStyle('PRIMARY');

  return [blockButton, passButton];
};

module.exports.getCoinFlipButtons = function () {
  const headsButton = new MessageButton()
    .setCustomId('heads')
    .setLabel('Heads')
    .setStyle('PRIMARY');

  const tailsButton = new MessageButton()
    .setCustomId('tails')
    .setLabel('Tails')
    .setStyle('PRIMARY');

  return [headsButton, tailsButton];
};
