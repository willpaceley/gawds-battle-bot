module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Exit function if interaction is not a command
    if (!interaction.isCommand()) return;

    // Search commands Collection for the interaction's command name
    const command = interaction.client.commands.get(interaction.commandName);

    // Exit function if there was no data for the command in the collection
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
