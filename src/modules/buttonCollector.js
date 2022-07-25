const { MessageActionRow } = require('discord.js');

module.exports.getButtonClicked = async function (
  interaction,
  message,
  buttons
) {
  const filter = async (i) => {
    // Defer the interaction so the token doesn't expire
    await i.deferUpdate();
    // Only let the user that invoked the battle command click a button
    return i.user.id === interaction.user.id;
  };

  return message
    .awaitMessageComponent({
      filter,
      componentType: 'BUTTON',
      time: 300000,
    })
    .then(async (i) => {
      // Disable buttons and update color of selection
      buttons.forEach((button) => {
        button.setDisabled();
        if (button.customId === i.customId) {
          button.setStyle('SUCCESS');
        }
      });
      const updatedRow = new MessageActionRow().addComponents(buttons);
      await message.edit({ components: [updatedRow] });
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

      await message.edit({
        content: `⚠️ **ERROR** - ${error.message}`,
        components: [errorButtonRow],
      });

      throw new Error(error.message);
    });
};
