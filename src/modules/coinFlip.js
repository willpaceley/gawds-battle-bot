const { MessageActionRow, MessageButton } = require('discord.js');
const { getButtonClicked } = require('./buttonCollector');

module.exports.getUserResponse = async function (interaction, thread) {
  const headsButton = new MessageButton()
    .setCustomId('heads')
    .setLabel('Heads')
    .setStyle('PRIMARY');

  const tailsButton = new MessageButton()
    .setCustomId('tails')
    .setLabel('Tails')
    .setStyle('PRIMARY');

  const buttons = [headsButton, tailsButton];

  const row = new MessageActionRow().addComponents([headsButton, tailsButton]);

  const coinFlipMessage = await thread.send({
    content: '🪙 Select **Heads** or **Tails**. Winner goes first!',
    components: [row],
  });

  await getButtonClicked(interaction, coinFlipMessage, buttons);
};

// Return true if user won
module.exports.flip = function () {
  return Math.random() > 0.5 ? 'heads' : 'tails';
};
