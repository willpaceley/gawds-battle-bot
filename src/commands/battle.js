const { SlashCommandBuilder } = require('@discordjs/builders');
const Gawd = require('../modules/Gawd');
const coinFlip = require('../modules/coinFlip');

// Returns a psuedorandom valid Gawd ID
function getRandomId() {
  return Math.floor(Math.random() * 5882 + 1);
}

async function sendVersusMessages(thread, userGawd, cpuGawd) {
  await thread.send(`You selected *${userGawd.name}* as your fighter! 👇`);
  await thread.send({ embeds: [userGawd.embed] });
  await thread.send('**VERSUS**');
  await thread.send({ embeds: [cpuGawd.embed] });
  await thread.send(
    `The computer selected *${cpuGawd.name}* as your opponent! ☝️`
  );
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
    await interaction.deferReply({ ephemeral: true });

    // Check if user supplied a valid Gawd ID
    const userGawdId = interaction.options.getInteger('id');
    if (userGawdId <= 0 || userGawdId > 5882) {
      await interaction.editReply(
        'Please try again with an ID between 1 and 5882.'
      );
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

    // Generate a randomized opponent controlled by the CPU
    // if the random ID is the same as user's ID, generate a new ID
    let cpuGawdId;
    do {
      cpuGawdId = getRandomId();
    } while (cpuGawdId === userGawdId);

    // create cpu Gawd object and populate with API data
    const cpuGawd = new Gawd(cpuGawdId, false);
    await cpuGawd.requestData();

    // Send VERSUS intro messages to thread
    await sendVersusMessages(thread, userGawd, cpuGawd);

    // Flip a coin to determine who goes first
    const userCalledSide = await coinFlip.getUserResponse(thread);
    console.log(userCalledSide);
    const userWin = await coinFlip.getWinner(thread, userCalledSide);
    console.log(userWin);
    userWin
      ? await thread.send(
          `🎉 The coin landed on **${userCalledSide}**. You won!`
        )
      : await thread.send(
          `😔 The coin landed on **${userCalledSide}**. You lost.`
        );
  },
};
