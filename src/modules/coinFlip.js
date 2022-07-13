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

  const row = new MessageActionRow().addComponents([headsButton, tailsButton]);

  const coinFlipMessage = await thread.send({
    content: '🪙 Select **Heads** or **Tails**. Winner goes first!',
    components: [row],
  });

  return coinFlipMessage
    .awaitMessageComponent({
      componentType: 'BUTTON',
      time: 60000,
    })
    .then(async (i) => {
      // Defer the interaction so the token doesn't expire
      await i.deferUpdate();

      // Disable buttons
      headsButton.setDisabled();
      tailsButton.setDisabled();
      // Display user selection by changing button color to green
      i.customId === 'heads'
        ? headsButton.setStyle('SUCCESS')
        : tailsButton.setStyle('SUCCESS');

      const updatedRow = new MessageActionRow().addComponents([
        headsButton,
        tailsButton,
      ]);
      await coinFlipMessage.edit({
        content: `You selected **${i.customId}**!`,
        components: [updatedRow],
      });
      await i.editReply(`You selected **${i.customId}**!`);
      return i.customId;
    })
    .catch((err) => {
      throw new Error(`⚠️ ERROR: ${err.message}`);
    });
};

// Return true if user won
module.exports.flip = function () {
  return Math.random() > 0.5 ? 'heads' : 'tails';
};
