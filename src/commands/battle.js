const { SlashCommandBuilder } = require('@discordjs/builders');
const Gawd = require('../modules/Gawd');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Start a battle of the Gawds!')
    .addIntegerOption((option) =>
      option
        .setName('id')
        .setDescription('The ID of the Gawd to battle')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Immediately deferReply() so interaction token doesn't expire during battle
    await interaction.deferReply();

    // Check if user supplied a valid Gawd ID
    const gawdId = interaction.options.getInteger('id');

    if (gawdId <= 0 || gawdId > 5882) {
      await interaction.editReply('Please select an ID between 1 and 5882.');
      return;
    } else {
      await interaction.editReply('⚔️ Battle in progress! ⚔️');
    }

    const battleName = `${interaction.user.username}'s Battle - Gawd ${gawdId}`;

    // create the battle thread
    const thread = await interaction.channel.threads.create({
      name: battleName,
      autoArchiveDuration: 60,
      reason: 'Time to battle!',
    });
    // add user to the battle thread
    thread.members.add(interaction.user);

    const userGawd = new Gawd(gawdId);
    await userGawd.requestData();
    console.log(userGawd);

    await thread.send('ah sahhhhhh');
  },
};
