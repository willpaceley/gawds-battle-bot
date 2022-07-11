const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { determineCult } = require('../modules/cults');
const powerSymbols = require('../modules/powerSymbols');
const Gawd = require('../modules/Gawd');

// Returns a psuedorandom valid Gawd ID
function getRandomId() {
  return Math.floor(Math.random() * 5882 + 1);
}

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
    const userGawdId = interaction.options.getInteger('id');
    if (userGawdId <= 0 || userGawdId > 5882) {
      await interaction.editReply('Please select an ID between 1 and 5882.');
      return;
    } else {
      await interaction.editReply('⚔️ Battle in progress! ⚔️');
    }

    // create the battle thread
    const battleName = `${interaction.user.username}'s Battle - Gawd ${userGawdId}`;
    const thread = await interaction.channel.threads.create({
      name: battleName,
      autoArchiveDuration: 60,
      reason: 'Time to battle!',
    });
    // add user to the battle thread
    thread.members.add(interaction.user);

    // create user Gawd object and populate with API data
    const userGawd = new Gawd(userGawdId);
    await userGawd.requestData();

    await thread.send(`You selected **${userGawd.name}** as your fighter! 👇`);

    // create an embed to display the selected Gawd to the user
    const userGawdEmbed = new MessageEmbed()
      .setColor('#22C55E')
      .setTitle(userGawd.name)
      .setURL(userGawd.image)
      .addFields(
        { name: 'ID', value: String(userGawd.id), inline: true },
        {
          name: 'Cult',
          value: determineCult(userGawd.dominantPower),
          inline: true,
        },
        {
          name: 'Dominant Power',
          value: `${userGawd.dominantPower} ${
            powerSymbols[userGawd.dominantPower]
          }`,
          inline: true,
        }
      )
      .setImage(userGawd.image);

    await thread.send({ embeds: [userGawdEmbed] });

    await thread.send('**VERSUS**');

    // Generate a randomized opponent controlled by the CPU
    // if the random ID is the same as user's ID, generate a new ID
    let cpuGawdId;
    do {
      cpuGawdId = getRandomId();
    } while (cpuGawdId === userGawdId);

    // create cpu Gawd object and populate with API data
    const cpuGawd = new Gawd(cpuGawdId);
    await cpuGawd.requestData();

    // create an embed to display cpu opponent to the user
    const cpuGawdEmbed = new MessageEmbed()
      .setColor('#D0034C')
      .setTitle(cpuGawd.name)
      .setURL(cpuGawd.image)
      .addFields(
        { name: 'ID', value: String(cpuGawd.id), inline: true },
        {
          name: 'Cult',
          value: determineCult(cpuGawd.dominantPower),
          inline: true,
        },
        {
          name: 'Dominant Power',
          value: `${cpuGawd.dominantPower} ${
            powerSymbols[cpuGawd.dominantPower]
          }`,
          inline: true,
        }
      )
      .setImage(cpuGawd.image);

    await thread.send({ embeds: [cpuGawdEmbed] });

    await thread.send(
      `The computer selected **${cpuGawd.name}** as your opponent! ☝️`
    );
  },
};
