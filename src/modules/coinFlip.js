const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.getUserResponse = async function (thread) {
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

  return coinFlipMessage
    .awaitMessageComponent({
      componentType: 'BUTTON',
      time: 300000,
    })
    .then(async (i) => {
      // Defer the interaction so the token doesn't expire
      await i.deferUpdate();

      // Disable buttons
      buttons.forEach((button) => button.setDisabled());
      // Display user selection by changing button color to green
      i.customId === 'heads'
        ? headsButton.setStyle('SUCCESS')
        : tailsButton.setStyle('SUCCESS');

      const updatedRow = new MessageActionRow().addComponents(buttons);
      await coinFlipMessage.edit({
        content: `You selected **${i.customId}**!`,
        components: [updatedRow],
      });
      await i.editReply(`You selected **${i.customId}**!`);
      return i.customId;
    })
    .catch(async (error) => {
      // Disable buttons and set to red to indicate error
      buttons.forEach((button) => {
        button.setDisabled();
        button.setStyle('DANGER');
      });

      const errorButtonRow = new MessageActionRow().addComponents(buttons);

      await coinFlipMessage.edit({
        content: `⚠️ **ERROR** - ${error.message}`,
        components: [errorButtonRow],
      });

      throw new Error(error.message);
    });
};

// Return true if user won
module.exports.flip = function () {
  return Math.random() > 0.5 ? 'heads' : 'tails';
};
